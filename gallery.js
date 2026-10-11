import { db, getProjects, card } from './portfolio-api.js';
const grid = document.querySelector('.masonry');
const messages = [...grid.querySelectorAll('.project-frame')].map((frame) => {
  const template = frame.cloneNode(true);
  template.classList.add('message-card');
  template.querySelector('.mock-brand').textContent = 'JOSEP SU / IDEAS';
  const caption = template.querySelector('figcaption');
  caption.firstElementChild.textContent = 'Ideas en movimiento';
  caption.lastElementChild.textContent = '✳';
  return template;
});
// Stable shuffle: varied positions without moving cards on every refresh.
const messageOrder = [7, 0, 5, 2, 9, 4, 1, 10, 3, 8, 11, 6];
function render(projects) {
  const fillers = Math.min(messages.length, Math.max(4, 12 - projects.length));
  const tiles = [];
  let messageIndex = 0;
  projects.forEach((project, index) => {
    tiles.push(card(project));
    if (index % 3 === 1 && messageIndex < fillers) {
      tiles.push(messages[messageOrder[messageIndex++]].cloneNode(true));
    }
  });
  while (messageIndex < fillers) tiles.push(messages[messageOrder[messageIndex++]].cloneNode(true));
  grid.replaceChildren(...tiles);
}
render([]);
if (db) {
  const note = document.querySelector('.projects-heading p span');
  note.textContent = 'Cargando trabajos…';
  let busy = false;
  async function refresh() {
    if (busy) return; busy = true;
    try {
      const projects = await getProjects();
      render(projects);
      note.textContent = projects.length ? 'Trabajos recientes e ideas en movimiento.' : 'Ideas en movimiento. Nuevos trabajos pronto.';
    } catch { note.textContent = 'No se pudieron cargar los trabajos. Reintentando…'; }
    finally { busy = false; }
  }
  refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, 15000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}

