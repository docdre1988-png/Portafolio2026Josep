(async () => {
const message = document.getElementById('status');
const enter = document.getElementById('enter');
document.getElementById('login').addEventListener('submit', event => event.preventDefault());
const timer = setTimeout(() => {
  message.textContent = 'La conexión está tardando. Comprueba tu conexión y recarga la página.';
  message.className = 'error';
}, 15000);
try {
  await import('./admin.js');
  clearTimeout(timer);
  enter.disabled = false;
  enter.textContent = 'Entrar';
} catch (error) {
  clearTimeout(timer);
  message.textContent = 'No se pudo cargar la conexión del admin. Recarga la página para reintentarlo.';
  message.className = 'error';
  enter.textContent = 'Conexión no disponible';
  console.error('Admin initialization failed', error);
}

})();
