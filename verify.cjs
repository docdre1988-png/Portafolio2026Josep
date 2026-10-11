const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let requestedOrder = [];
const rows = [{ id:'new' }, { id:'old' }];
const query = { select(){ return this; }, order(column, options){ requestedOrder.push([column, options.ascending]); return this; }, then(resolve){ return Promise.resolve({ data:rows, error:null }).then(resolve); } };
const code = fs.readFileSync('portfolio-api.js','utf8').replace(/^import .*;\r?\n/, '').replaceAll('export ', '');
const context = vm.createContext({ window:{ PORTFOLIO_CONFIG:{supabaseUrl:'https://example.supabase.co',supabaseKey:'public'} }, createClient:()=>({from:()=>query}), URL });
vm.runInContext(code, context);
(async () => {
  assert.equal(vm.runInContext("safeUrl('javascript:alert(1)')",context),null);
  assert.equal(vm.runInContext("safeUrl('https://example.com')",context),'https://example.com/');
  const result = await vm.runInContext('getProjects()',context);
  assert.equal(result, rows);
  assert.deepEqual(requestedOrder,[['created_at',false],['id',false]]);
  query.then = resolve => Promise.resolve({data:null,error:new Error('Denied')}).then(resolve);
  await assert.rejects(vm.runInContext('getProjects()',context), /Denied/);
  console.log('OK: URLs seguras, orden descendente y propagación de errores.');
})().catch(error=>{ console.error(error); process.exitCode=1; });
