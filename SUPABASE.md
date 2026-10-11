# Activar el admin

La URL del proyecto y su clave pública ya están en config.js. Nunca poner una clave secret o service_role en archivos públicos.

1. En Supabase abre SQL Editor y ejecuta supabase-setup.sql una vez en este proyecto nuevo. Crea la tabla, el bucket público y permisos restringidos al administrador.
2. En Authentication > Users crea tu usuario de administración con correo y contraseña. La cuenta del dashboard Supabase es distinta del usuario del portafolio. No compartas la contraseña aquí.
3. Copia el UUID de ese usuario y ejecuta en SQL Editor:

   insert into public.portfolio_admins (user_id) values ('UUID_DEL_USUARIO');

4. Desactiva el registro público en Authentication si no necesitas otros usuarios. Aunque esté habilitado, un usuario nuevo no tiene permisos de publicación.
5. Ejecuta npm run dev y abre http://127.0.0.1:3000/admin.html. Inicia sesión y publica tu primer trabajo.

Las imágenes se guardan en Storage y son públicas, como el portafolio. Los proyectos se ordenan por fecha de creación del servidor, de más reciente a más antiguo. Conservan la proporción original. Al publicar desde el admin, la galería los consulta automáticamente; una pestaña ya abierta se actualiza cada 15 segundos mientras esté visible.

La galería vacía muestra un mensaje; no muestra los ejemplos inventados cuando Supabase está configurado. Si la consulta falla, muestra un aviso. Este proyecto todavía no implementa generación de copia estática de los datos.

El admin incluye publicación y eliminación. La conexión real requiere ejecutar el SQL y crear el usuario; la clave pública no permite hacerlo por sí sola.
