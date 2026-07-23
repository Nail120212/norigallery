const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));

const { router: tuneRouter, getTunePage } = require('./tune');
const { router: stickerRouter, getStickerPage } = require('./sticker');

app.use('/api/tune', tuneRouter);
app.use('/api/sticker', stickerRouter);

app.get('/', (req, res) => {
    res.send(getIndexPage());
});

app.get('/favicon.ico', (req, res) => {
    res.redirect('https://nexxtohubontop.vercel.app/logo.png');
});

app.get('/tune', (req, res) => res.send(getTunePage()));
app.get('/tune/:pasteId', (req, res) => res.send(getTunePage()));
app.get('/t', (req, res) => res.send(getTunePage()));
app.get('/t/:pasteId', (req, res) => res.send(getTunePage()));

app.get('/SG', (req, res) => res.send(getStickerPage()));
app.get('/SG/:pasteId', (req, res) => res.send(getStickerPage()));
app.get('/s', (req, res) => res.send(getStickerPage()));
app.get('/s/:pasteId', (req, res) => res.send(getStickerPage()));
app.get('/sticker', (req, res) => res.send(getStickerPage()));
app.get('/sticker/:pasteId', (req, res) => res.send(getStickerPage()));

app.get('*', (req, res) => {
    const p = req.path;
    if (p.startsWith('/t')) return res.send(getTunePage());
    if (p.startsWith('/s') || p.startsWith('/SG')) return res.send(getStickerPage());
    res.send(getIndexPage());
});

function getIndexPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NexxToHubOnTop</title>
<link rel="icon" type="image/png" href="/logo.png">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', sans-serif;
    background: #0a0a0f;
    color: #e8e8f0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 24px;
  }
  img.logo { width: 80px; height: 80px; border-radius: 16px; object-fit: cover; }
  h1 { font-size: 2rem; font-weight: 900; letter-spacing: -0.03em; color: #fff; }
  p { color: #888; font-size: 0.95rem; }
  .cards { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  .card {
    background: #13131a;
    border: 1px solid #2a2a3a;
    border-radius: 14px;
    padding: 24px 32px;
    text-align: center;
    text-decoration: none;
    color: #e8e8f0;
    transition: border-color 0.2s, transform 0.15s;
    min-width: 160px;
  }
  .card:hover { border-color: #5b6ef5; transform: translateY(-2px); }
  .card .icon { font-size: 2rem; margin-bottom: 8px; }
  .card .label { font-weight: 600; font-size: 0.9rem; color: #aaa; }
</style>
</head>
<body>
  <img class="logo" src="/logo.png" alt="Logo" onerror="this.style.display='none'">
  <h1>NexxToHubOnTop</h1>
  <p>Roblox tune & sticker sharing</p>
  <div class="cards">
    <a class="card" href="/tune">
      <div class="icon">🔧</div>
      <div class="label">Tune Viewer</div>
    </a>
    <a class="card" href="/s">
      <div class="icon">🎨</div>
      <div class="label">Sticker Gallery</div>
    </a>
  </div>
</body>
</html>`;
}

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => console.log(`[NexxToHubOnTop] http://localhost:${PORT}`));
}

module.exports = app;
