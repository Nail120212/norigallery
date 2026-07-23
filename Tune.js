const express = require('express');
const router = express.Router();
const axios = require('axios');

const PASTEFY_API = "https://pastefy.app/api/v2/paste";
const PASTEFY_KEY = process.env.PASTEFY_KEY || "";

router.post('/create', async (req, res) => {
    try {
        const { target, displayName, userId, jeepName, fh, rh, fs, rs, fd, rd, tuneCode, date } = req.body;
        const payload = {
            target, displayName, userId, jeepName,
            frontHeight: fh, rearHeight: rh,
            frontStiffness: fs, rearStiffness: rs,
            frontDampening: fd, rearDampening: rd,
            tuneCode, date
        };
        const pasteRes = await axios.post(PASTEFY_API, {
            content: JSON.stringify(payload, null, 2),
            title: `tune-${target}-${Date.now()}`,
            type: "json"
        }, {
            headers: PASTEFY_KEY ? { Authorization: `Bearer ${PASTEFY_KEY}` } : {}
        });
        const pasteId = pasteRes.data?.id || pasteRes.data?.paste?.id;
        const url = `https://nexxtohubontop.vercel.app/tune/${pasteId}`;
        res.json({ success: true, id: pasteId, url, data: payload });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const r = await axios.get(`${PASTEFY_API}/${req.params.id}`);
        let content = r.data?.content || r.data?.paste?.content;
        if (typeof content === 'string') content = JSON.parse(content);
        res.json(content);
    } catch (e) {
        res.status(404).json({ error: "Paste not found" });
    }
});

function getTunePage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tune Viewer — NexxToHubOnTop</title>
<link rel="icon" type="image/png" href="/logo.png">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', sans-serif;
    background: #0a0a0f;
    color: #e8e8f0;
    min-height: 100vh;
    padding: 24px 16px 48px;
  }
  .topbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
  }
  .topbar img.site-logo {
    width: 32px; height: 32px; border-radius: 8px; object-fit: cover;
  }
  .topbar a { color: #666; text-decoration: none; font-size: 0.85rem; }
  .topbar a:hover { color: #aaa; }
  .card {
    background: #13131a;
    border: 1px solid #2a2a3a;
    border-radius: 18px;
    padding: 28px;
    max-width: 520px;
    margin: 0 auto;
  }
  .profile {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  .avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    border: 2px solid #2a2a3a;
    object-fit: cover;
    background: #1e1e28;
  }
  .profile-info .display { font-size: 1.2rem; font-weight: 700; }
  .profile-info .username { font-size: 0.85rem; color: #666; margin-top: 2px; }
  .profile-info .jeep {
    font-size: 0.8rem; color: #5b6ef5;
    margin-top: 4px; font-weight: 600; letter-spacing: 0.02em;
  }
  .meta { font-size: 0.78rem; color: #555; margin-bottom: 20px; }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    cursor: pointer;
    user-select: none;
  }
  .section-header .title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #555;
  }
  .section-header .chevron { color: #444; font-size: 0.8rem; transition: transform 0.2s; }
  .section-header.open .chevron { transform: rotate(180deg); }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }
  .stat {
    background: #0e0e16;
    border: 1px solid #1e1e2e;
    border-radius: 10px;
    padding: 12px 10px;
    text-align: center;
  }
  .stat .val { font-size: 1rem; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; }
  .stat .key { font-size: 0.68rem; color: #555; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.05em; }
  .divider { border: none; border-top: 1px solid #1e1e2e; margin: 16px 0; }
  .copy-btn {
    width: 100%;
    background: #5b6ef5;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, transform 0.1s;
    margin-top: 4px;
  }
  .copy-btn:hover { background: #4a5de0; }
  .copy-btn:active { transform: scale(0.98); }
  .hidden { display: none; }
  .empty {
    text-align: center;
    padding: 60px 20px;
    color: #444;
  }
  .empty .icon { font-size: 2.5rem; margin-bottom: 12px; }
  .empty p { font-size: 0.9rem; }
  #mainContent { display: none; }
  #emptyState { display: block; }
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: #1e1e28; border: 1px solid #2a2a3a; color: #e8e8f0;
    padding: 10px 20px; border-radius: 8px; font-size: 0.85rem;
    transition: transform 0.3s; z-index: 999;
  }
  .toast.show { transform: translateX(-50%) translateY(0); }
</style>
</head>
<body>
<div class="topbar">
  <img class="site-logo" src="/logo.png" alt="Logo" onerror="this.style.display='none'">
  <a href="/">NexxToHubOnTop</a>
</div>

<div id="emptyState" class="card">
  <div class="empty">
    <div class="icon">🔧</div>
    <p>No tune loaded. Use a valid tune link.</p>
  </div>
</div>

<div id="mainContent" class="card">
  <div class="profile">
    <img id="avatar" class="avatar" src="" alt="Avatar">
    <div class="profile-info">
      <div class="display" id="displayName">—</div>
      <div class="username" id="username">—</div>
      <div class="jeep" id="jeep">—</div>
    </div>
  </div>
  <div class="meta" id="time">—</div>

  <div class="section-header open" onclick="toggleSection('front', this)">
    <span class="title">Front Suspension</span>
    <span class="chevron">▾</span>
  </div>
  <div id="frontPanel" class="stats-grid">
    <div class="stat"><div class="val" id="fh">—</div><div class="key">Height</div></div>
    <div class="stat"><div class="val" id="fs">—</div><div class="key">Stiffness</div></div>
    <div class="stat"><div class="val" id="fd">—</div><div class="key">Dampening</div></div>
  </div>

  <hr class="divider">

  <div class="section-header open" onclick="toggleSection('rear', this)">
    <span class="title">Rear Suspension</span>
    <span class="chevron">▾</span>
  </div>
  <div id="rearPanel" class="stats-grid">
    <div class="stat"><div class="val" id="rh">—</div><div class="key">Height</div></div>
    <div class="stat"><div class="val" id="rs">—</div><div class="key">Stiffness</div></div>
    <div class="stat"><div class="val" id="rd">—</div><div class="key">Dampening</div></div>
  </div>

  <hr class="divider">
  <button class="copy-btn" onclick="copyTuneCode()">Copy Tune Code</button>
</div>

<div class="toast" id="toast">Tune code copied!</div>

<script>
async function loadTune() {
  const params = new URLSearchParams(window.location.search);
  const segments = window.location.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  let data = null;
  let pasteId = null;

  if (params.get('data')) {
    try { data = JSON.parse(atob(params.get('data'))); } catch {}
  } else if (window.location.hash) {
    try { data = JSON.parse(atob(window.location.hash.slice(1))); } catch {}
  } else if (params.get('id')) {
    pasteId = params.get('id');
  } else if (lastSegment && lastSegment !== 'tune' && lastSegment !== 't') {
    pasteId = lastSegment;
  }

  if (pasteId && !data) {
    try {
      const res = await fetch('/api/tune/' + pasteId);
      data = await res.json();
    } catch {}
  }

  if (!data || data.error) return;

  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';

  const userId = data.userId || data.targetId;
  let avatarUrl = '';
  if (userId) {
    try {
      const thumb = await fetch('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=' + userId + '&size=420x420&format=Png&isCircular=false').then(r => r.json());
      avatarUrl = thumb?.data?.[0]?.imageUrl || '';
    } catch {}
  }
  document.getElementById('avatar').src = avatarUrl;

  document.getElementById('displayName').textContent = data.displayName || data.target || 'Unknown';
  document.getElementById('username').textContent = '@' + (data.target || 'unknown');
  document.getElementById('jeep').textContent = data.jeepName || data.jeep || '';
  document.getElementById('time').textContent = data.date ? new Date(data.date).toLocaleString() : '';

  const fmt = v => v != null ? parseFloat(v).toFixed(4) : '—';
  document.getElementById('fh').textContent = fmt(data.fh ?? data.frontHeight);
  document.getElementById('fs').textContent = fmt(data.fs ?? data.frontStiffness);
  document.getElementById('fd').textContent = fmt(data.fd ?? data.frontDampening);
  document.getElementById('rh').textContent = fmt(data.rh ?? data.rearHeight);
  document.getElementById('rs').textContent = fmt(data.rs ?? data.rearStiffness);
  document.getElementById('rd').textContent = fmt(data.rd ?? data.rearDampening);

  window.__tuneCode = data.tuneCode;
}

function copyTuneCode() {
  if (!window.__tuneCode) return;
  navigator.clipboard.writeText(window.__tuneCode).then(() => showToast('Tune code copied!'));
}

function toggleSection(id, header) {
  const panel = document.getElementById(id + 'Panel');
  panel.classList.toggle('hidden');
  header.classList.toggle('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

loadTune();
</script>
</body>
</html>`;
}

module.exports = { router, getTunePage };
