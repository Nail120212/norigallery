const express = require('express');
const router = express.Router();
const axios = require('axios');

const PASTEFY_API = "https://pastefy.app/api/v2/paste";
const PASTEFY_KEY = process.env.PASTEFY_KEY || "";

router.post('/create', async (req, res) => {
    try {
        const { stickers, player } = req.body;
        const pasteRes = await axios.post(PASTEFY_API, {
            content: JSON.stringify({ stickers, player, date: new Date().toISOString() }, null, 2),
            title: `stickers-${player}-${Date.now()}`,
            type: "json"
        }, {
            headers: PASTEFY_KEY ? { Authorization: `Bearer ${PASTEFY_KEY}` } : {}
        });
        const pasteId = pasteRes.data?.id || pasteRes.data?.paste?.id;
        res.json({ success: true, id: pasteId, url: `https://nexxtohubontop.vercel.app/s/${pasteId}` });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const r = await axios.get(`${PASTEFY_API}/${req.params.id}`);
        let content = r.data?.content || r.data?.paste?.content;
        if (typeof content === 'string') content = JSON.parse(content);
        res.json({ stickers: content?.stickers, player: content?.player, date: content?.date });
    } catch (e) {
        res.status(404).json({ error: "Not found" });
    }
});

function getStickerPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sticker Gallery — NexxToHubOnTop</title>
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
    max-width: 600px;
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
    max-width: 600px;
    margin: 0 auto;
  }
  .profile {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  .avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    border: 2px solid #2a2a3a;
    object-fit: cover;
    background: #1e1e28;
  }
  .profile-info .display { font-size: 1.1rem; font-weight: 700; }
  .profile-info .meta { font-size: 0.78rem; color: #555; margin-top: 4px; }
  .section-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 14px;
  }
  .sticker-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 12px;
  }
  .sticker-item {
    background: #0e0e16;
    border: 1px solid #1e1e2e;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 8px 8px;
    gap: 6px;
    transition: border-color 0.15s;
  }
  .sticker-item:hover { border-color: #5b6ef5; }
  .sticker-item img {
    width: 72px; height: 72px;
    object-fit: contain;
    border-radius: 8px;
  }
  .sticker-item .sticker-name {
    font-size: 0.68rem;
    color: #666;
    text-align: center;
    word-break: break-word;
    line-height: 1.3;
  }
  .sticker-item .sticker-count {
    font-size: 0.75rem;
    font-weight: 700;
    color: #5b6ef5;
  }
  .empty {
    text-align: center;
    padding: 60px 20px;
    color: #444;
  }
  .empty .icon { font-size: 2.5rem; margin-bottom: 12px; }
  .empty p { font-size: 0.9rem; }
  #mainContent { display: none; }
  #emptyState { display: block; }
  .no-stickers { color: #444; font-size: 0.85rem; text-align: center; padding: 24px 0; }
</style>
</head>
<body>
<div class="topbar">
  <img class="site-logo" src="/logo.png" alt="Logo" onerror="this.style.display='none'">
  <a href="/">NexxToHubOnTop</a>
</div>

<div id="emptyState" class="card">
  <div class="empty">
    <div class="icon">🎨</div>
    <p>No sticker gallery loaded. Use a valid gallery link.</p>
  </div>
</div>

<div id="mainContent" class="card">
  <div class="profile">
    <img id="avatar" class="avatar" src="" alt="Avatar">
    <div class="profile-info">
      <div class="display" id="playerName">—</div>
      <div class="meta" id="galleryMeta">—</div>
    </div>
  </div>
  <div class="section-label" id="stickerCountLabel">Stickers</div>
  <div id="stickerGrid" class="sticker-grid"></div>
</div>

<script>
async function loadGallery() {
  const params = new URLSearchParams(window.location.search);
  const segments = window.location.pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  let data = null;
  let pasteId = null;

  if (params.get('id')) {
    pasteId = params.get('id');
  } else if (params.get('Id')) {
    pasteId = params.get('Id');
  } else if (lastSegment && !['s','SG','sticker'].includes(lastSegment)) {
    pasteId = lastSegment;
  }

  if (pasteId) {
    try {
      const res = await fetch('/api/sticker/' + pasteId);
      data = await res.json();
    } catch {}
  }

  if (!data || data.error) return;

  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';

  const player = data.player || 'Unknown';
  document.getElementById('playerName').textContent = player;
  document.getElementById('galleryMeta').textContent = data.date ? new Date(data.date).toLocaleString() : '';

  const stickers = data.stickers;
  const grid = document.getElementById('stickerGrid');

  if (!stickers || (Array.isArray(stickers) && stickers.length === 0)) {
    grid.innerHTML = '<div class="no-stickers">No stickers found.</div>';
    document.getElementById('stickerCountLabel').textContent = 'Stickers';
    return;
  }

  let items = [];

  if (Array.isArray(stickers)) {
    items = stickers.map(s => ({
      id: s.id || s.assetId || s,
      name: s.name || s.Name || '',
      count: s.count || s.Count || 1
    }));
  } else if (typeof stickers === 'object') {
    items = Object.entries(stickers).map(([k, v]) => ({
      id: typeof v === 'object' ? (v.id || v.assetId || k) : k,
      name: typeof v === 'object' ? (v.name || v.Name || k) : k,
      count: typeof v === 'object' ? (v.count || v.Count || 1) : v
    }));
  }

  document.getElementById('stickerCountLabel').textContent = items.length + ' Sticker' + (items.length !== 1 ? 's' : '');

  grid.innerHTML = items.map(item => {
    const imgUrl = item.id ? \`https://assetdelivery.roblox.com/v1/asset/?id=\${item.id}\` : '';
    const fallback = \`this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22><rect width=%2272%22 height=%2272%22 fill=%22%231e1e28%22/><text x=%2236%22 y=%2244%22 text-anchor=%22middle%22 font-size=%2228%22>🎨</text></svg>'\`;
    return \`<div class="sticker-item">
      <img src="\${imgUrl}" alt="\${item.name}" onerror="\${fallback}">
      \${item.name ? \`<div class="sticker-name">\${item.name}</div>\` : ''}
      \${item.count > 1 ? \`<div class="sticker-count">x\${item.count}</div>\` : ''}
    </div>\`;
  }).join('');
}

loadGallery();
</script>
</body>
</html>`;
}

module.exports = { router, getStickerPage };
