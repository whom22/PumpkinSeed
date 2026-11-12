// Kiro proposed these scenarios; this executable fixture was independently corrected.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_EXECUTABLE ? {executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 let count=0;
 const ok=(name)=>{count++; console.log('PASS',name)};
 try {
  const page=await browser.newPage();
  await page.route('**/*',r=>r.abort());
  const source=fs.readFileSync(path.join(__dirname,'../template/src/ui/modalFocus.ts'),'utf8').replace('export function','function');
  const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None}}).outputText;
  await page.setContent(`<button id="opener">Open</button><button id="outside">Outside</button><div id="dialog" role="dialog" tabindex="-1"><div hidden><button id="hiddenAncestor">Hidden</button></div><div inert><button id="inertChild">Inert</button></div><fieldset disabled><button id="fieldsetChild">Disabled</button></fieldset><input id="first"><button disabled>Disabled</button><button tabindex="-2">Negative</button><button id="last">Last</button></div>`);
  await page.addScriptTag({content:js+'; window.activateModalFocus=activateModalFocus;'});
  const active=()=>page.evaluate(()=>document.activeElement.id);
  const open=()=>page.evaluate(()=>{document.getElementById('opener').focus();window.__closeCount=0;window.cleanup=activateModalFocus(document.getElementById('dialog'),()=>{window.__closeCount++;window.cleanup()});});
  await open(); assert.equal(await active(),'first');ok('initial focus ignores hidden/inert/disabled controls');
  await page.keyboard.press('Shift+Tab');assert.equal(await active(),'last');ok('reverse wrapping');
  await page.keyboard.press('Tab');assert.equal(await active(),'first');ok('forward wrapping');
  await page.evaluate(()=>document.getElementById('outside').focus()); assert.equal(await active(),'first');ok('outside focus contained');
  await page.evaluate(()=>{const b=document.createElement('button');b.id='dynamic';b.textContent='Dynamic';document.getElementById('dialog').appendChild(b)});
  await page.keyboard.press('Shift+Tab');assert.equal(await active(),'dynamic');ok('dynamic content recomputed');
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.__closeCount),1);assert.equal(await active(),'opener');ok('Escape once and restores opener');
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.__closeCount),1);ok('cleanup removes listeners');
  await open();assert.equal(await active(),'first');await page.evaluate(()=>{window.cleanup();window.cleanup()});assert.equal(await active(),'opener');ok('repeat open and idempotent cleanup');
  await page.evaluate(()=>{document.getElementById('dialog').innerHTML='';document.getElementById('opener').focus();window.cleanup=activateModalFocus(document.getElementById('dialog'),()=>{})});
  assert.equal(await active(),'dialog');await page.keyboard.press('Tab');assert.equal(await active(),'dialog');await page.keyboard.press('Shift+Tab');assert.equal(await active(),'dialog');ok('empty dialog keyboard containment');
  await page.evaluate(()=>document.getElementById('outside').focus());assert.equal(await active(),'dialog');ok('empty dialog outside focus containment');
  await page.evaluate(()=>{document.getElementById('opener').remove();window.cleanup()});ok('removed opener cleanup safe');
  fs.mkdirSync(path.join(__dirname,'../.qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../.qa/modal-focus-test-results.json'),JSON.stringify({passed:count,date:new Date().toISOString()},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});


