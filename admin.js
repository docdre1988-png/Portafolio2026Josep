import { db, getProjects, card, safeUrl } from './portfolio-api.js';
const $ = (id) => document.getElementById(id);
const status = (text, error = false) => { $('status').textContent = text; $('status').className = error ? 'error' : ''; };
let previewUrl;
async function load() {
  const projects = await getProjects(); $('count').textContent = `(${projects.length})`; $('list').replaceChildren();
  for (const project of projects) {
    const item = document.createElement('article'); item.className = 'admin-item';
    const image = card(project).querySelector('img');
    const info = document.createElement('div'); const title = document.createElement('strong'); title.textContent = project.title;
    const meta = document.createElement('small'); meta.textContent = `${project.category === 'IA' ? 'Agente IA' : ['ecommerce', 'E-commerce / Tiendas digitales'].includes(project.category) ? 'Ecommerce' : project.category} · ${new Date(project.created_at).toLocaleDateString('es-PE')}`;
    const link = document.createElement('a'); link.textContent = 'Visitar sitio ↗'; link.href = safeUrl(project.website_url); link.target = '_blank'; link.rel = 'noopener noreferrer'; info.append(title, meta, link);
    const remove = document.createElement('button'); remove.textContent = 'Eliminar'; remove.setAttribute('aria-label', `Eliminar ${project.title}`);
    remove.onclick = async () => {
      if (!confirm(`¿Eliminar “${project.title}” de la galería?`)) return;
      remove.disabled = true;
      try {
        const { error } = await db.from('projects').delete().eq('id', project.id); if (error) throw error;
        const { error: storageError } = await db.storage.from('portfolio').remove([project.image_path]);
        await load(); status(storageError ? 'Trabajo eliminado. No se pudo limpiar su imagen del almacenamiento.' : 'Trabajo eliminado.');
      } catch (error) { status(error.message, true); remove.disabled = false; }
    };
    item.append(image, info, remove); $('list').append(item);
  }
}
async function sessionView() {
  const { data: { session } } = await db.auth.getSession();
  $('login').hidden = !!session; $('workspace').hidden = !session; $('logout').hidden = !session;
  if (session) { try { await load(); } catch (error) { status(`No se pudo cargar: ${error.message}. Revisa SUPABASE.md.`, true); } }
}
if (!db) { $('setup').hidden = false; } else {
  sessionView().catch(error => status(error.message, true));
  db.auth.onAuthStateChange(() => { setTimeout(sessionView, 0); });
  $('login').onsubmit = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); button.disabled = true; status('Entrando…');
    try { const { error } = await db.auth.signInWithPassword({ email: form.elements.email.value, password: form.elements.password.value }); if (error) throw error; form.reset(); status(''); await sessionView(); } catch (error) { status(error.message, true); } finally { button.disabled = false; }
  };
  $('logout').onclick = async () => { const { error } = await db.auth.signOut(); if (error) status(error.message, true); else { $('list').replaceChildren(); status('Sesión cerrada.'); await sessionView(); } };
  $('upload').elements.image.onchange = (event) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const file = event.target.files[0]; $('preview').hidden = !file;
    if (file) { previewUrl = URL.createObjectURL(file); $('preview').src = previewUrl; }
  };
  $('upload').onsubmit = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const file = form.elements.image.files[0];
    const title = form.elements.title.value.trim(); const website = safeUrl(form.elements.url.value);
    if (!title || !website) { status('Introduce un nombre y una URL http o https válida.', true); return; }
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { status('Selecciona una imagen JPG, PNG o WebP de hasta 5 MB.', true); return; }
    $('publish').disabled = true; status('Subiendo imagen…'); let uploadedPath = null; let saved = false;
    try {
      const bitmap = await createImageBitmap(file); const width = bitmap.width; const height = bitmap.height; bitmap.close();
      const { data: { user }, error: userError } = await db.auth.getUser(); if (userError || !user) throw userError || new Error('Vuelve a iniciar sesión.');
      const extension = { 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' }[file.type];
      const imagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await db.storage.from('portfolio').upload(imagePath, file, { contentType:file.type, upsert:false }); if (uploadError) throw uploadError; uploadedPath = imagePath;
      status('Publicando trabajo…');
      const { error } = await db.from('projects').insert({ title, website_url:website, category:form.elements.category.value === 'E-commerce / Tiendas digitales' ? 'ecommerce' : form.elements.category.value, image_path:imagePath, image_width:width, image_height:height }); if (error) throw error;
      saved = true; form.reset(); $('preview').hidden = true; if (previewUrl) URL.revokeObjectURL(previewUrl);
      status('Publicado. Ya aparece primero en tu portafolio.');
      try { await load(); } catch { status('Publicado correctamente. Recarga para actualizar la lista del admin.'); }
    } catch (error) {
      let cleanupFailed = false;
      if (uploadedPath && !saved) { const { error: cleanupError } = await db.storage.from('portfolio').remove([uploadedPath]); cleanupFailed = !!cleanupError; }
      status(`${error.message}${cleanupFailed ? ' La imagen quedó en Storage; puedes eliminarla allí.' : ''}`, true);
    } finally { $('publish').disabled = false; }
  };
}




