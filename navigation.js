(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  let position = 0;
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
  });
  menu.querySelector('.menu-close').addEventListener('click', () => menu.close());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
    menu.close();
    if (link.hash && link.getAttribute('href').startsWith('#')) {
      event.preventDefault();
      requestAnimationFrame(() => {
        const section = document.querySelector(link.hash);
        history.replaceState(null, '', link.hash);
        section?.scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        if (section) { section.setAttribute('tabindex','-1'); section.focus({preventScroll:true}); }
      });
    }
  }));
  matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches && menu.open) menu.close(); });
})();
