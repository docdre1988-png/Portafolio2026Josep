import { createClient } from '@supabase/supabase-js';
const config = window.PORTFOLIO_CONFIG || {};
export const db = config.supabaseUrl && config.supabaseKey ? createClient(config.supabaseUrl, config.supabaseKey) : null;
export const categories = ['Web', 'App', 'IA', 'Landing', 'Web app', 'SaaS', 'ecommerce'];
export function safeUrl(value) { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } }
export async function getProjects() {
  const { data, error } = await db.from('projects').select('*').order('created_at', { ascending: false }).order('id', { ascending: false });
  if (error) throw error;
  return data;
}
export function card(project) {
  const figure = document.createElement('figure');
  figure.className = 'work-card';
  const link = document.createElement('a');
  const url = safeUrl(project.website_url);
  if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  const img = document.createElement('img');
  img.src = db.storage.from('portfolio').getPublicUrl(project.image_path).data.publicUrl;
  img.alt = project.title; img.loading = 'lazy'; img.width = project.image_width; img.height = project.image_height;
  link.append(img);
  const caption = document.createElement('figcaption');
  const title = document.createElement('span'); title.textContent = project.title;
  const category = document.createElement('small'); category.textContent = project.category === 'IA' ? 'Agente IA' : ['ecommerce', 'E-commerce / Tiendas digitales'].includes(project.category) ? 'Ecommerce' : project.category;
  caption.append(title, category); link.append(caption); figure.append(link);
  return figure;
}






