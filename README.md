# Josep Su — Portfolio

Portafolio estático con galería y admin conectado a Supabase Auth, Postgres y Storage.

## Local

Node.js 22 o superior.

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:3000. Admin: /admin.html.

## Compilar

```sh
npm test
npm run build
```

Publicar solamente `dist/`. No publicar node_modules, archivos SQL ni herramientas del servidor.

## GitHub Pages

El workflow `.github/workflows/pages.yml` comprueba y compila el sitio en cada push a `main`, luego publica `dist/`.
En el repositorio, Settings > Pages > Source: GitHub Actions.
La cuenta y visibilidad del repositorio deben permitir GitHub Pages.
Todos los enlaces y recursos propios son relativos para soportar una URL con el nombre del repositorio.

## Supabase

config.js contiene únicamente la URL y clave publishable pública, diseñadas para usarse en el navegador. Los permisos reales están en las políticas RLS del proyecto. No subir claves secret ni service_role.
Las tablas, el bucket y el administrador ya fueron configurados en el proyecto conectado; NO volver a ejecutar el SQL de creación en la base existente.
Al conocer la URL publicada, establecerla en Authentication > URL Configuration > Site URL. Agregar la URL exacta del admin a Redirect URLs si se usan flujos de recuperación o enlaces por correo. El login actual usa correo y contraseña, sin redirección externa.

Las imágenes y trabajos ya viven en Supabase. Publicar un trabajo desde el admin no requiere recompilar GitHub Pages. La galería conserva imágenes en su proporción original y mezcla mensajes con los trabajos recientes.
No hay copia estática de datos: si Supabase está pausado o no disponible, las tarjetas de mensajes siguen visibles y se muestra un aviso.

## Seguridad y verificación

No se incluyen credenciales privadas en el sitio. La clave pública por sí sola no permite publicar: es necesario iniciar sesión con un usuario presente en portfolio_admins.
Las pruebas locales verifican URLs seguras, orden de lectura y manejo de errores. La publicación final requiere comprobar el dominio online, acceso al admin y una subida real desde ese dominio.
