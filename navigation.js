(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  let position = 0;
  let destination = null;
  toggle.addEventListener('click', () => {
    position = window.scrollY;
    menu.showModal();
    document.body.style.position = 'fixed';
    document.body.style.top = `-${position}px`;
    document.body.style.width = '100%';
    toggle.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top:position, behavior:'instant' });
    toggle.setAttribute('aria-expanded', 'false');
    const target = destination;
    destination = null;
    if (target) requestAnimationFrame(() => {
      history.replaceState(null, '', '#' + target.id);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll:true });
      target.scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  });
  menu.querySelector('.menu-close').addEventListener('click', () => menu.close());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.getElementById(href.slice(1));
      if (section) { event.preventDefault(); destination = section; }
    }
    menu.close();
  }));
  matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches && menu.open) menu.close(); });
})();

