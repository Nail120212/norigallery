const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.get('/favicon.ico', (req, res) => res.redirect('/logo.png'));
app.get('/logo.png', (req, res) => res.sendFile(__dirname + '/public/logo.png'));

app.get('/', (req, res) => res.send(getIndexPage()));
app.get('/tune', (req, res) => res.send(getTunePage()));
app.get('/tune/:pasteId', (req, res) => res.send(getTunePage()));
app.get('/t/:pasteId', (req, res) => res.send(getTunePage()));
app.get('/sticker', (req, res) => res.send(getStickerPage()));
app.get('/sticker/:pasteId', (req, res) => res.send(getStickerPage()));
app.get('/s/:pasteId', (req, res) => res.send(getStickerPage()));
app.get('/SG/:pasteId', (req, res) => res.send(getStickerPage()));
app.get('/s', (req, res) => res.send(getStickerPage()));
app.get('/SG', (req, res) => res.send(getStickerPage()));

app.get('*', (req, res) => {
const p = req.path;
if (p.startsWith('/tune') || p.startsWith('/t/')) return res.send(getTunePage());
if (p.startsWith('/sticker') || p.startsWith('/s/') || p.startsWith('/SG')) return res.send(getStickerPage());
res.send(getIndexPage());
});

function getIndexPage(){
return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nexxtohub</title>
<link rel="icon" href="/logo.png">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0c0c0d;--surface:#111113;--border:#1f1f22;--text:#e8e8ea;--dim:#5a5a62;--mono:'DM Mono',monospace;--display:'Syne',sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:var(--mono);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px;}
.logo{width:64px;height:64px;border-radius:16px;}
h1{font-family:var(--display);font-size:28px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;}
.sub{color:var(--dim);font-size:11px;text-align:center;max-width:340px;line-height:1.6;}
.search{margin-top:12px;display:flex;gap:8px;width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border);padding:6px;}
.search input{flex:1;background:transparent;border:none;outline:none;color:var(--text);font-family:var(--mono);font-size:12px;padding:10px 12px;}
.search button{background:var(--text);color:var(--bg);border:none;padding:10px 16px;font-family:var(--mono);font-size:11px;font-weight:600;cursor:pointer;}
.cards{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;justify-content:center;}
.card{background:var(--surface);border:1px solid var(--border);padding:16px 20px;text-decoration:none;color:var(--text);font-size:11px;min-width:130px;text-align:center;}
.card:hover{border-color:#3a3a3e;}
.card span{font-family:var(--display);font-weight:700;font-size:12px;display:block;}
.card small{color:var(--dim);font-size:9px;margin-top:4px;display:block;}
</style>
</head>
<body>
<img class="logo" src="/logo.png">
<h1>Nexxtohub</h1>
<div class="sub">Pastefy ID auto detects tune or sticker</div>
<div class="search"><input id="pid" placeholder="Pastefy ID or link"><button onclick="go()">Open</button></div>
<div class="cards">
<a class="card" href="/tune"><span>Tune</span><small>/tune/ID</small></a>
<a class="card" href="/sticker"><span>Sticker</span><small>/sticker/ID</small></a>
</div>
<script>
function getId(v){let s=v.trim();let m=s.match(/pastefy\.app\/([^\/\s]+)/);if(m)s=m[1];return s.replace(/[^a-zA-Z0-9]/g,'');}
async function fetchRaw(id){let u=[\`https://pastefy.app/\${id}/raw\`,\`https://api.allorigins.win/raw?url=\${encodeURIComponent(\`https://pastefy.app/\${id}/raw\`)}\`];for(let x of u){try{let r=await fetch(x);if(r.ok){let t=await r.text();if(t)return t;}}catch(e){}}return null;}
async function go(){let v=document.getElementById('pid').value;let id=getId(v);if(!id)return;let txt=await fetchRaw(id);let isTune=false;if(txt){try{let j=JSON.parse(txt);if(j.fh!=null||j.tuneCode) isTune=true;}catch{}if(txt.includes('fh;')) isTune=true;}location.href=(isTune?'/tune/':'/sticker/')+id;}
document.getElementById('pid').addEventListener('keydown',e=>{if(e.key==='Enter')go();});
</script>
</body>
</html>`;
}

function getTunePage(){
return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nexxto Tune</title>
<link rel="icon" href="/logo.png">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#0c0c0d;--surface:#111113;--border:#1f1f22;--border-soft:#19191c;--text:#e8e8ea;--dim:#5a5a62;--mono:'DM Mono',monospace;--display:'Syne',sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:var(--mono);min-height:100vh;}
header{height:56px;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;justify-content:space-between;position:sticky;top:0;background:rgba(12,12,13,0.9);backdrop-filter:blur(12px);}
.logo{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--text);}
.logo img{width:24px;height:24px;border-radius:6px;}
.logo span{font-family:var(--display);font-weight:800;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;}
main{max-width:520px;margin:0 auto;padding:28px 18px 60px;}
.card{background:var(--surface);border:1px solid var(--border-soft);padding:22px;}
.avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:18px;}
.avatar{width:84px;height:84px;border-radius:50%;border:2px solid var(--border);object-fit:cover;background:#161618;}
.display{font-family:var(--display);font-weight:700;font-size:15px;}
.username{font-size:10px;color:var(--dim);}
.jeep{font-size:9px;background:#161618;border:1px solid var(--border-soft);padding:5px 10px;border-radius:999px;margin-top:2px;}
.time{font-size:8px;color:var(--dim);margin-top:4px;letter-spacing:0.08em;text-transform:uppercase;}
.toggle{display:flex;gap:1px;background:var(--border-soft);border:1px solid var(--border-soft);margin:14px 0;}
.toggle button{flex:1;background:var(--bg);border:none;color:var(--dim);padding:9px;font-family:var(--mono);font-size:9px;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;}
.toggle button.active{background:var(--text);color:var(--bg);font-weight:600;}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border-soft);border:1px solid var(--border-soft);}
.stat{background:var(--surface);padding:12px 8px;text-align:center;}
.stat .val{font-size:12px;font-weight:600;}
.stat .key{font-size:7px;color:var(--dim);margin-top:3px;text-transform:uppercase;}
.btn{width:100%;background:var(--text);color:var(--bg);border:1px solid var(--text);padding:11px;font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;margin-top:14px;}
.empty{text-align:center;padding:50px 20px;color:var(--dim);font-size:11px;}
#mainContent{display:none;}
#emptyState{display:block;}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--surface);border:1px solid var(--border);padding:8px 14px;font-size:10px;transition:transform 0.25s;z-index:99;}
.toast.show{transform:translateX(-50%) translateY(0);}
</style>
</head>
<body>
<header><a class="logo" href="/"><img src="/logo.png"><span>Nexxtohub</span></a></header>
<main>
<div id="emptyState" class="card"><div class="empty">No tune loaded. Use /tune/ID</div></div>
<div id="mainContent" class="card">
<div class="avatar-wrap">
<img id="avatar" class="avatar" src="">
<div class="display" id="displayName">—</div>
<div class="username" id="username">—</div>
<div class="jeep" id="jeep">—</div>
<div class="time" id="time">—</div>
</div>
<div class="toggle"><button id="bF" class="active" onclick="showF()">Front</button><button id="bR" onclick="showR()">Rear</button></div>
<div id="front" class="stats"><div class="stat"><div class="val" id="fh">—</div><div class="key">Height</div></div><div class="stat"><div class="val" id="fs">—</div><div class="key">Stiffness</div></div><div class="stat"><div class="val" id="fd">—</div><div class="key">Dampening</div></div></div>
<div id="rear" class="stats" style="display:none;"><div class="stat"><div class="val" id="rh">—</div><div class="key">Height</div></div><div class="stat"><div class="val" id="rs">—</div><div class="key">Stiffness</div></div><div class="stat"><div class="val" id="rd">—</div><div class="key">Dampening</div></div></div>
<button class="btn" onclick="copyCode()">Get Tune Code</button>
</div>
</main>
<div id="toast" class="toast"></div>
<script>
function getId(){let s=location.pathname.split('/').filter(Boolean);let l=s[s.length-1];if(!l||['tune','t'].includes(l)){let p=new URLSearchParams(location.search).get('id');return p;}return l;}
async function fetchRaw(id){let a=[\`https://pastefy.app/\${id}/raw\`,\`https://api.allorigins.win/raw?url=\${encodeURIComponent(\`https://pastefy.app/\${id}/raw\`)}\`];for(let u of a){try{let r=await fetch(u);if(r.ok){let t=await r.text();if(t)return t;}}catch(e){}}return null;}
function showF(){document.getElementById('front').style.display='grid';document.getElementById('rear').style.display='none';document.getElementById('bF').classList.add('active');document.getElementById('bR').classList.remove('active');}
function showR(){document.getElementById('front').style.display='none';document.getElementById('rear').style.display='grid';document.getElementById('bR').classList.add('active');document.getElementById('bF').classList.remove('active');}
async function load(){let id=getId();if(!id)return;let txt=await fetchRaw(id);if(!txt)return;let d=null;try{d=JSON.parse(txt);}catch{try{let m=txt.match(/\{[\s\S]*\}/);if(m)d=JSON.parse(m[0]);}catch{}if(!d){let fh=(txt.match(/fh;([\d.]+)/)||[])[1];if(fh)d={fh,rh:(txt.match(/rh;([\d.]+)/)||[])[1],fs:(txt.match(/fs;([\d.]+)/)||[])[1],rs:(txt.match(/rs;([\d.]+)/)||[])[1],fd:(txt.match(/fd;([\d.]+)/)||[])[1],rd:(txt.match(/rd;([\d.]+)/)||[])[1],tuneCode:txt};}}if(!d)return;document.getElementById('emptyState').style.display='none';document.getElementById('mainContent').style.display='block';let uid=d.userId||d.targetId;if(uid)fetch(\`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=\${uid}&size=420x420&format=Png&isCircular=false\`).then(r=>r.json()).then(j=>{if(j.data&&j.data[0])document.getElementById('avatar').src=j.data[0].imageUrl;});document.getElementById('displayName').textContent=d.displayName||d.target||'Unknown';document.getElementById('username').textContent='@'+(d.target||'unknown');document.getElementById('jeep').textContent=d.jeepName||d.jeep||'Unknown Jeep';document.getElementById('time').textContent=d.date?new Date(d.date).toLocaleString():'';let fmt=v=>v!=null?parseFloat(v).toFixed(4):'—';document.getElementById('fh').textContent=fmt(d.fh??d.frontHeight);document.getElementById('fs').textContent=fmt(d.fs??d.frontStiffness);document.getElementById('fd').textContent=fmt(d.fd??d.frontDampening);document.getElementById('rh').textContent=fmt(d.rh??d.rearHeight);document.getElementById('rs').textContent=fmt(d.rs??d.rearStiffness);document.getElementById('rd').textContent=fmt(d.rd??d.rearDampening);window._code=d.tuneCode;}
function copyCode(){if(!window._code)return;navigator.clipboard.writeText(window._code).then(()=>{let t=document.getElementById('toast');t.textContent='Copied';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);});}
load();
</script>
</body>
</html>`;
}

function getStickerPage(){
return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NexGallery</title>
<link rel="icon" href="/logo.png">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0c0c0d;--surface:#111113;--border:#1f1f22;--border-soft:#19191c;--text:#e8e8ea;--dim:#5a5a62;--muted:#2e2e34;--mono:'DM Mono',monospace;--display:'Syne',sans-serif;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:var(--mono);min-height:100vh;line-height:1.5;}
header{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:56px;border-bottom:1px solid var(--border);background:rgba(12,12,13,0.9);backdrop-filter:blur(12px);}
.logo{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--text);}
.logo img{width:24px;height:24px;border-radius:6px;}
.logo-title{font-family:var(--display);font-weight:800;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;}
.logo-sub{font-size:7px;color:var(--dim);letter-spacing:0.15em;text-transform:uppercase;}
.count{font-size:10px;color:var(--dim);display:none;align-items:center;gap:6px;}
.dot{width:5px;height:5px;background:#888;border-radius:50%;}
main{padding:24px 20px 60px;max-width:1080px;margin:0 auto;}
#loading,#empty,#error{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:40vh;gap:10px;text-align:center;}
.spinner{width:24px;height:24px;border:1.5px solid var(--border);border-top-color:#888;border-radius:50%;animation:spin 0.8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
#content{display:none;}
.bar{margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border-soft);display:flex;gap:8px;}
.btn{border:1px solid var(--border);background:none;color:var(--dim);padding:7px 12px;font-family:var(--mono);font-size:9px;letter-spacing:0.08em;cursor:pointer;text-decoration:none;}
.btn:hover{border-color:#3a3a3e;color:var(--text);}
.btn-primary{background:var(--text);color:var(--bg);border-color:var(--text);font-weight:600;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1px;background:var(--border-soft);border:1px solid var(--border-soft);}
@media(max-width:600px){.grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));}}
.card{background:var(--bg);display:flex;flex-direction:column;}
.card:hover{background:var(--surface);}
.card-img{width:100%;aspect-ratio:1;background:var(--surface);display:flex;align-items:center;justify-content:center;overflow:hidden;}
.card-img img{width:100%;height:100%;object-fit:contain;transition:transform 0.2s;}
.card:hover .card-img img{transform:scale(1.04);}
.card-foot{padding:8px 10px;border-top:1px solid var(--border-soft);display:flex;flex-direction:column;gap:6px;}
.card-id{font-size:8px;color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.copy-btn{width:100%;border:1px solid var(--border-soft);background:none;color:var(--muted);padding:5px;font-family:var(--mono);font-size:7px;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;}
.copy-btn:hover{border-color:#333;color:var(--dim);background:var(--surface);}
</style>
</head>
<body>
<header>
<a class="logo" href="/"><img src="/logo.png"><div><div class="logo-title">Nexxtohub</div><div class="logo-sub">Sticker Gallery</div></div></a>
<div class="count" id="hcount"><div class="dot"></div><span id="hcount-text"></span></div>
</header>
<main>
<div id="loading"><div class="spinner"></div><div style="font-size:11px;color:var(--dim);">Loading</div></div>
<div id="empty" style="display:none;"><div style="font-size:11px;color:var(--dim);">No sticker gallery loaded. Use /sticker/ID</div></div>
<div id="error" style="display:none;"><div style="font-size:11px;">Could not load</div></div>
<div id="content">
<div class="bar"><button class="btn btn-primary" id="copy-all">Copy All IDs</button><a class="btn" id="raw-link" target="_blank">Raw</a></div>
<div class="grid" id="grid"></div>
</div>
</main>
<script>
function getId(){let p=new URLSearchParams(location.search).get('id');if(p)return p;let s=location.pathname.split('/').filter(Boolean);let l=s[s.length-1];if(!l||['sticker','s','SG'].includes(l))return null;return l;}
function showState(s){['loading','empty','error','content'].forEach(x=>{let el=document.getElementById(x);el.style.display=(x===s)?(s==='content'?'block':'flex'):'none';});}
function copyText(t,btn){let fb=()=>{let ta=Object.assign(document.createElement('textarea'),{value:t,style:'position:fixed;opacity:0'});document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);};(navigator.clipboard?navigator.clipboard.writeText(t).catch(fb):Promise.resolve(fb())).then(()=>{if(!btn)return;let o=btn.textContent;btn.textContent='Copied';setTimeout(()=>btn.textContent=o,1200);});}
function parseIds(t){return t.match(/\d{6,}/g)||[];}
async function fetchRaw(id){let urls=[\`https://pastefy.app/\${id}/raw\`,\`https://api.allorigins.win/raw?url=\${encodeURIComponent(\`https://pastefy.app/\${id}/raw\`)}\`];for(let u of urls){try{let r=await fetch(u);if(r.ok){let txt=await r.text();if(txt)return txt;}}catch(e){}}return null;}
async function init(){
let id=getId();if(!id){showState('empty');return;}
let raw=\`https://pastefy.app/\${id}/raw\`;
document.getElementById('raw-link').href=raw;
let text=await fetchRaw(id);
if(!text){showState('error');return;}
let ids=parseIds(text);
if(!ids.length){showState('error');return;}
document.getElementById('hcount-text').textContent=ids.length+' Stickers';
document.getElementById('hcount').style.display='flex';
document.getElementById('copy-all').onclick=function(){copyText(ids.join('\n'),this);};
let grid=document.getElementById('grid');
ids.forEach(i=>{
let c=document.createElement('div');
c.className='card';
c.innerHTML=\`<div class="card-img"><img id="img-\${i}" src="https://placehold.co/420x420/111/444?text=..." loading="lazy"></div><div class="card-foot"><div class="card-id">\${i}</div><button class="copy-btn">Copy ID</button></div>\`;
c.querySelector('.copy-btn').onclick=()=>copyText(i,c.querySelector('.copy-btn'));
grid.appendChild(c);
});
showState('content');
for(let k=0;k<ids.length;k+=100){
let chunk=ids.slice(k,k+100);
fetch(\`https://thumbnails.roproxy.com/v1/assets?assetIds=\${chunk.join(',')}&returnPolicy=PlaceHolder&size=420x420&format=Png\`).then(r=>r.json()).then(d=>{if(d&&d.data){d.data.forEach(it=>{let el=document.getElementById(\`img-\${it.targetId}\`);if(el)el.src=it.state==='Completed'?it.imageUrl:'https://placehold.co/420x420/111/ff3333?text=N/A';});}}).catch(()=>{});
}
}
init();
</script>
</body>
</html>`;
}

const PORT = process.env.PORT || 3000;
if (require.main === module) {
app.listen(PORT, () => console.log('[NexxToHubOnTop] http://localhost:' + PORT));
}
module.exports = app;
