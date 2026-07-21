// SGallery.js - Sticker Gallery (kept for compatibility)
const express = require('express');
const router = express.Router();
const axios = require('axios');

const PASTEFY_API = "https://pastefy.app/api/v2/paste";
const PASTEFY_KEY = process.env.PASTEFY_KEY || "";

// Create sticker paste
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
        const id = req.params.id;
        const r = await axios.get(`https://pastefy.app/api/v2/paste/${id}`);
        res.json(r.data);
    } catch (e) {
        res.status(404).json({ error: "Not found" });
    }
});

module.exports = { router };
