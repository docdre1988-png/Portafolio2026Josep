const fs = require('node:fs');
const path = require('node:path');
const { build } = require('esbuild');
(async () => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'dist');
  fs.mkdirSync(path.join(output, 'assets'), { recursive:true });
  for (const name of ['index.html','styles.css','admin.html','admin.css','config.js','navigation.js']) fs.copyFileSync(path.join(root,name), path.join(output,name));
  fs.copyFileSync(path.join(root,'assets/josep-hero.webp'),path.join(output,'assets/josep-hero.webp'));
  fs.copyFileSync(path.join(root,'assets/josep-hero-mobile.jpg'),path.join(output,'assets/josep-hero-mobile.jpg'));
  fs.copyFileSync(path.join(root,'assets/favicon.png'),path.join(output,'assets/favicon.png'));
  for (const [entry, name] of [['gallery.js','gallery.bundle.js'],['admin-bootstrap.js','admin.bundle.js']]) {
    await build({entryPoints:[path.join(root,entry)],bundle:true,format:'iife',platform:'browser',minify:true,outfile:path.join(output,'assets',name)});
  }
  fs.writeFileSync(path.join(output,'.nojekyll'),'');
  console.log('Build listo: dist/ (solo archivos públicos)');
})().catch(error=>{console.error(error);process.exitCode=1;});



