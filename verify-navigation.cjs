const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const calls=[];const handlers={};let queued;
const target={id:'proyectos',setAttribute(){},focus(){calls.push('focus')},scrollIntoView(){calls.push('navigate')}};
const link={getAttribute:()=> '#proyectos',addEventListener:(name,fn)=>handlers.link=fn};
const menu={open:true,addEventListener:(name,fn)=>handlers[name]=fn,querySelector:()=>({addEventListener(){}}),querySelectorAll:()=>[link],close(){queued=handlers.close},showModal(){}};
const body={style:{position:'fixed'}};
vm.runInNewContext(fs.readFileSync('navigation.js','utf8'),{document:{body,querySelector:()=>({addEventListener(){},setAttribute(){}}),getElementById:id=>id==='mobile-menu'?menu:target},window:{scrollY:0,scrollTo(){assert.equal(body.style.position,'');calls.push('restore')}},requestAnimationFrame:fn=>fn(),history:{replaceState(){}},matchMedia:()=>({matches:false,addEventListener(){}})});
handlers.link({preventDefault(){}});assert.deepEqual(calls,[]);queued();assert.deepEqual(calls,['restore','focus','navigate']);console.log('OK: navegación después de desbloquear el scroll y cerrar el menú.');
