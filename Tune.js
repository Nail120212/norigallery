// Tune.js - Tune Website Backend + Frontend Logic
const express = require('express');
const router = express.Router();
const axios = require('axios');

const PASTEFY_API = "https://pastefy.app/api/v2/paste";
const PASTEFY_KEY = process.env.PASTEFY_KEY || ""; // set if you have API key, else anon works

// POST /api/tune/create - Create pastefy paste from Roblox and return url
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

        // Create pastefy
        const pasteRes = await axios.post(PASTEFY_API, {
            content: JSON.stringify(payload, null, 2),
            title: `tune-${target}-${Date.now()}`,
            type: "json"
        }, {
            headers: PASTEFY_KEY ? { Authorization: `Bearer ${PASTEFY_KEY}` } : {}
        });

        const pasteId = pasteRes.data?.id || pasteRes.data?.paste?.id;
        const url = `https://nexxtohubontop.vercel.app/tune?id=${pasteId}`;

        res.json({ success: true, id: pasteId, url, data: payload });
    } catch (e) {
        console.error(e.response?.data || e.message);
        res.status(500).json({ success: false, error: e.message });
    }
});

// GET /api/tune/:id - Fetch pastefy data
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const r = await axios.get(`https://pastefy.app/api/v2/paste/${id}`);
        let content = r.data?.content || r.data?.paste?.content;
        if (typeof content === 'string') content = JSON.parse(content);
        res.json(content);
    } catch (e) {
        res.status(404).json({ error: "Paste not found" });
    }
});

module.exports = { router };

/*
==== FRONTEND TUNE.HTML CLIENT LOGIC (include this in public/tune.html) ====

<script>
async function loadTune(){
  const params = new URLSearchParams(window.location.search);
  const hashData = window.location.hash.slice(1);
  let data = null;

  if(params.get('data')){
    // Base64 encoded JSON from direct webhook URL
    try { data = JSON.parse(atob(params.get('data'))); } catch{}
  } else if(hashData){
    try { data = JSON.parse(atob(hashData)); } catch{}
  } else if(params.get('id')){
    // Fetch from pastefy
    const res = await fetch(`/api/tune/${params.get('id')}`);
    data = await res.json();
  }

  if(!data) return document.body.innerHTML = '<h1>Invalid Tune Link</h1>';

  // Fetch avatar
  const userId = data.userId || data.targetId;
  let avatarUrl = `https://tr.rbxcdn.com/30DAY-AvatarHeadshot-...`;
  if(userId){
    try{
      const thumb = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`).then(r=>r.json());
      avatarUrl = thumb.data[0].imageUrl;
    }catch{}
  }

  document.getElementById('avatar').src = avatarUrl;
  document.getElementById('username').innerText = data.target || 'Unknown';
  document.getElementById('displayName').innerText = data.displayName || data.target;
  document.getElementById('jeep').innerText = data.jeepName || data.jeep;
  document.getElementById('time').innerText = data.date || new Date().toLocaleString();

  document.getElementById('fh').innerText = parseFloat(data.fh || data.frontHeight).toFixed(4);
  document.getElementById('fs').innerText = parseFloat(data.fs || data.frontStiffness).toFixed(4);
  document.getElementById('fd').innerText = parseFloat(data.fd || data.frontDampening).toFixed(4);
  document.getElementById('rh').innerText = parseFloat(data.rh || data.rearHeight).toFixed(4);
  document.getElementById('rs').innerText = parseFloat(data.rs || data.rearStiffness).toFixed(4);
  document.getElementById('rd').innerText = parseFloat(data.rd || data.rearDampening).toFixed(4);

  window.__tuneCode = data.tuneCode;
}
function copyTuneCode(){
  navigator.clipboard.writeText(window.__tuneCode);
  alert('Tune Code Copied!');
}
function toggleFront(){
  document.getElementById('frontPanel').classList.toggle('hidden');
}
function toggleRear(){
  document.getElementById('rearPanel').classList.toggle('hidden');
}
loadTune();
</script>
*/
