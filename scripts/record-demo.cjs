// Local-only, isolated-context UI recording. Requires installed Playwright and ffmpeg.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
// Reuse the installed recorder binary without downloading or changing its installation.
const localTools = path.resolve(__dirname, '../.qa/demo-video/browser-tools');
fs.mkdirSync(path.join(localTools, 'ffmpeg-1013'), { recursive: true });
fs.copyFileSync('C:/ProgramData/chocolatey/lib/ffmpeg/tools/ffmpeg/bin/ffmpeg.exe', path.join(localTools, 'ffmpeg-1013/ffmpeg-win64.exe'));
process.env.PLAYWRIGHT_BROWSERS_PATH = localTools;
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/A/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '.qa/demo-video');
fs.mkdirSync(out, { recursive: true });
const servers = []; let browser, ctx;
const checks = [], errors = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const wrapper = `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#101017;color:#fff;font:23px Segoe UI,Arial,sans-serif}header{height:72px;padding:15px 28px;display:flex;justify-content:space-between;align-items:center}header strong{color:#ffb65a;font-size:30px}header span{color:#bdb8ca;font-size:20px}.views{display:flex;gap:16px;padding:0 20px}.pane{width:calc(50% - 8px)}.label{height:38px;color:#c5bfd2;font-size:19px}iframe{width:100%;height:810px;border:1px solid #55435e;border-radius:10px;background:#17111e}footer{height:160px;padding:20px 30px}#title{font-size:28px;font-weight:700;color:#ffc478;margin-bottom:8px}#caption{font-size:24px;line-height:1.4}#tour{display:none;position:absolute;left:140px;right:140px;top:155px;bottom:220px;background:#171321;border:1px solid #765780;border-radius:22px;padding:45px}#tour h1{color:#ffc478}#tour pre{font:27px/1.6 Consolas,monospace}#tour p{color:#cec5dc}
body{background:radial-gradient(ellipse at 12% 0%,#3b2441 0%,transparent 48%),radial-gradient(ellipse at 90% 100%,#34221c 0%,transparent 45%),#100e18}
header{height:82px;padding:15px 28px;border-bottom:1px solid #ffffff12;margin-bottom:8px}header strong{font-size:31px;letter-spacing:-1px}header strong:before{content:'?';color:#b49aff;margin-right:13px}header span{font-size:17px;color:#bcb0cc}
.views{gap:20px;padding:0 26px}.pane{width:calc(50% - 10px)}.label{height:34px;font-size:16px;letter-spacing:2px;color:#b9a5cb}iframe{height:780px;border:1px solid #8d6ca855;box-shadow:0 15px 40px #0006;border-radius:15px}
footer{padding:19px 32px 14px;border-top:1px solid #ffffff12;margin-top:10px;background:#100e18bb}#title{font-size:26px;letter-spacing:.2px}#caption{font-size:22px;color:#dfd5e7;max-width:1800px}#title,#caption{animation:reveal .5s ease both}@keyframes reveal{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
#tour{background:linear-gradient(135deg,#21182d,#110f1b);box-shadow:0 40px 100px #000b;border:1px solid #ae8dba;border-radius:24px}#tour h1{font-size:43px;letter-spacing:-1px}#tour pre{font-size:25px;color:#e5dced}
#intro{position:absolute;z-index:5;inset:0;background:radial-gradient(ellipse at 75% 35%,#513047,transparent 48%),#110f1b;display:flex;flex-direction:column;justify-content:center;padding:140px;transition:opacity .7s ease}#intro .eyebrow{font-size:22px;letter-spacing:6px;color:#b69acc}#intro h1{font-size:116px;letter-spacing:-6px;color:#ffbf72;margin:24px 0 10px}#intro p{font-size:36px;color:#eee3f2;margin:12px 0}#intro small{font-size:21px;color:#bcabc8;margin-top:50px}#intro:after{content:'?';position:absolute;right:180px;top:230px;font-size:300px;color:#b18ad126;transform:rotate(13deg)}
</style>
<div id="intro"><div class="eyebrow">TWO APPS �� ONE SHARED FOUNDATION</div><h1>PumpkinSeed</h1><p>Small moments. A little Halloween magic.</p><small>Trick-or-Treat Map + Ghost Story Relay<br><br>Actual UI �� Fictional data �� Same-browser local demo</small></div><header><strong>PumpkinSeed</strong><span>Fictional data ? Two views in one isolated browser ? Silent, caption-led</span></header>
<div class="views"><div class="pane"><div class="label">VIEW A �� same browser profile</div><iframe name="left" src="http://127.0.0.1:5173"></iframe></div><div class="pane"><div class="label">VIEW B �� same app origin</div><iframe name="right" src="http://127.0.0.1:5173"></iframe></div></div>
<div id="tour"></div><footer><div id="title">Two festival apps. One shared foundation.</div><div id="caption">Actual local UI interactions. Synchronization stays within this browser profile, not across devices.</div></footer>`;
async function serve(port, app) {
 const dir = app && path.join(root, 'apps', app, 'dist');
 const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
 const server = http.createServer((req,res) => {
  if (!dir) {res.writeHead(200,{'Content-Type':'text/html'});res.end(wrapper);return;}
  let file = path.resolve(dir, '.' + decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(file===dir) file=path.join(dir,'index.html');
  if(!file.startsWith(dir+path.sep)){res.writeHead(403).end();return;}
  try {res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});servers.push(server);
}
async function waitFor(fn) {for(let n=0;n<100;n++){if(await fn())return;await sleep(100);}throw Error('UI state did not arrive');}
(async()=>{
 await serve(5173,'trick-or-treat-map');await serve(5174,'ghost-story-relay');await serve(5179);
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||'C:/Users/A/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe'});
 ctx=await browser.newContext({locale:'en-US',viewport:{width:1920,height:1080},recordVideo:{dir:out,size:{width:1920,height:1080}},serviceWorkers:'block'});
 await ctx.route('**/*',r=>{const h=new URL(r.request().url()).hostname;return h==='127.0.0.1'||h.endsWith('.tile.openstreetmap.org')?r.continue():r.abort();});
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
 const video=p.video();await p.goto('http://127.0.0.1:5179');
 await sleep(5200);await p.evaluate(()=>document.querySelector('#intro').style.opacity='0');await sleep(800);await p.evaluate(()=>document.querySelector('#intro').remove());
 const a=p.frame({name:'left'}),b=p.frame({name:'right'});
 const caption=async(title,caption,ms=0)=>{await p.evaluate(({title,caption})=>{for(const id of ['title','caption']){const el=document.getElementById(id);el.style.animation='none';void el.offsetWidth;el.style.animation='reveal .5s ease both';}document.querySelector('#title').textContent=title;document.querySelector('#caption').textContent=caption;},{title,caption});if(ms)await sleep(ms);};
 await waitFor(async()=>await a.locator('.leaflet-tile-loaded').count()>0);
 assert.match(await a.locator('body').innerText(),/local/i);checks.push('Local mode and actual OSM tiles visible');await sleep(8000);
 await caption('01 / Trick-or-Treat Map','Create a fictional stop. No device location or real household information is used.',3000);
 await a.locator('.tot-toolbar button').last().click();await sleep(1500);
 await a.getByRole('button',{name:'Use fictional demo point',exact:true}).click();
 await a.locator('.tot-form input.ps-input').nth(0).fill('Demo Moon Porch');await sleep(1500);
 await a.locator('.tot-form textarea').fill('Fictional demo only. Verify food labels in real use.');
 await a.locator('.tot-form input[type=checkbox]').check();await sleep(3500);
 await a.getByRole('button',{name:/Save$/}).click();
 await waitFor(async()=>await b.locator('.tot-row').count()===1);checks.push('Stop creation synchronized without refresh');
 await caption('One save. Both views update.','The second view receives the new stop without refreshing. This is same-browser local synchronization.',7000);
 await a.locator('.tot-row button').last().click();await waitFor(async()=>/1/.test(await b.locator('.tot-row button').last().innerText()));
 await caption('A little thanks travels too','The thanks count updates in both views. Allergy labels are sample data, not verified safety information.',6000);
 await a.locator('.tot-toolbar button').last().click();await a.getByRole('button',{name:'Choose on map',exact:true}).click();
 await a.locator('.tot-map').click({position:{x:370,y:220}});await a.getByRole('dialog').waitFor();
 await a.locator('.tot-form input.ps-input').nth(0).fill('Demo Lantern House');await a.locator('.tot-form textarea').fill('Fictional demo stop. Not a real household.');
 await a.locator('.tot-form input[type=checkbox]').uncheck();await sleep(2000);await a.getByRole('button',{name:/Save$/}).click();
 await waitFor(async()=>await b.locator('.tot-row').count()===2);
 await caption('Pick a point. Filter the map.','A second fictional stop is added by clicking the map. The allergy filter changes map pins, not the leaderboard.',2500);
 await a.getByRole('button',{name:/Allergy-friendly only/}).click();await waitFor(async()=>await a.locator('.leaflet-marker-icon').count()===1);await sleep(4500);
 await a.getByRole('button',{name:/Allergy-friendly only/}).click();checks.push('Manual location picker and allergy map filter');
 await caption('02 / Ghost Story Relay','Build a short story, one line at a time. Both views still belong to the same browser profile.');
 await Promise.all([a.goto('http://127.0.0.1:5174'),b.goto('http://127.0.0.1:5174')]);await sleep(4500);
 await a.locator('.gsr-panel input').first().fill('Demo Ghost');await a.getByRole('button',{name:/Start a new story/}).click();
 await waitFor(async()=>await a.locator('.gsr-line').count()===1);await b.goto(a.url());await waitFor(async()=>await b.locator('.gsr-line').count()===1);
 await caption('A shared local story room','The generated room code groups local story lines. It is not a password or proof of cross-device access.',5000);
 await a.locator('.gsr-composer input').fill('A tiny pumpkin knocked on the locked door.');await sleep(2500);await a.getByRole('button',{name:'Whisper it',exact:true}).click();
 await waitFor(async()=>await b.locator('.gsr-line').count()===2);await sleep(5000);
 await caption('The relay works in both directions','Add the next sentence from View B. View A receives it without refreshing.');
 await b.locator('.gsr-composer input').fill('Inside, the candle answered in a whisper.');await sleep(2500);await b.getByRole('button',{name:'Whisper it',exact:true}).click();
 await waitFor(async()=>await a.locator('.gsr-line').count()===3);await sleep(5000);checks.push('Story lines synchronized in both directions');
 await a.locator('.gsr-vibe').last().click();await waitFor(async()=>/1/.test(await b.locator('.gsr-vibe').last().innerText()));
 await caption('React, then preview the finished story','Finish & share opens an assembled local preview. Nothing is published by this action.',2500);
 await a.getByRole('button',{name:'Finish & share',exact:true}).click();await a.getByRole('dialog').waitFor();await sleep(7000);
 await p.screenshot({path:path.join(out,'preview-story.png')});
 await a.locator('body').press('Escape');
 await caption('One shared theme system','Switch the festival skin from Halloween to Christmas, then back again.');
 await a.getByLabel('Festival skin').selectOption('christmas');await sleep(4500);await a.getByLabel('Festival skin').selectOption('halloween');await sleep(2500);
 await caption('Persistence after a reload','Reload View A: the same three story lines remain. View B stays open throughout.');
 await a.goto(a.url());await waitFor(async()=>await a.locator('.gsr-line').count()===3);await sleep(5000);checks.push('Votes, local preview, themes and reload persistence');
 const folders=['template/src','.kiro/specs','.kiro/steering','.kiro/hooks'].map(dir=>dir+'/\n  '+fs.readdirSync(path.join(root,dir)).filter(name=>{const item=path.join(root,dir,name);return !fs.statSync(item).isDirectory()||fs.readdirSync(item).length>0;}).join('  |  ')).join('\n\n');
 await p.evaluate(text=>{const box=document.querySelector('#tour');box.style.display='block';const h=document.createElement('h1');h.textContent='Shared foundation / repository inventory';const pre=document.createElement('pre');pre.style.whiteSpace='pre-wrap';pre.textContent=text;box.replaceChildren(h,pre);},folders);
 await caption('Repository artifacts, accurately labeled','Kiro generated a shared keyboard-focus helper and test draft. Independently corrected and tested; not a claim of original Kiro authorship.',9000);
 await p.screenshot({path:path.join(out,'preview-foundation.png')});
 await p.evaluate(()=>{document.querySelector('#tour').style.display='none';const labels=document.querySelectorAll('.label');labels[0].textContent='Trick-or-Treat Map �� local';labels[1].textContent='Ghost Story Relay �� local';});await a.goto('http://127.0.0.1:5173');
 await caption('PumpkinSeed / Two focused local demos','Local storage + same-browser synchronization. Map tiles need internet. No cross-device sync is claimed. Built from one reusable template.',7500);
 await p.screenshot({path:path.join(out,'preview-close.png')});assert.deepEqual(errors,[]);
 await ctx.close();ctx=null;const raw=await video.path();await browser.close();browser=null;
 const mp4=path.join(out,'pumpkinseed-showcase-final.mp4');
 execFileSync('C:/ProgramData/chocolatey/bin/ffmpeg.exe',['-y','-i',raw,'-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','-an',mp4],{stdio:'ignore'});
 const probe=JSON.parse(execFileSync('C:/ProgramData/chocolatey/bin/ffprobe.exe',['-v','quiet','-show_format','-show_streams','-of','json',mp4],{encoding:'utf8'}));
 assert(Number(probe.format.duration)<180,'Video must be under three minutes');
 fs.writeFileSync(path.join(out,'recording-report.json'),JSON.stringify({mp4,checks,errors,probe,limitations:['Silent caption-led recording','Actual app views embedded in a recording-only wrapper','Same browser profile and origin only; not separate users or devices','Map tiles require network','Repository artifact presence is not evidence of actual Kiro use','No upload or publication']},null,2));
 console.log(JSON.stringify({mp4,duration:probe.format.duration,size:probe.format.size,checks},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(ctx)await ctx.close();if(browser)await browser.close();for(const server of servers)server.close();});


