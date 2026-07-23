const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Landing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tune routes - all serve tune.html (it parses id from path/query)
app.get('/tune', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});
app.get('/t/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});
app.get('/tune/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});

// Sticker routes - all serve sgallery.html
app.get('/SG', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/SG/Id=:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/SG/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/s/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/sticker', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/sticker/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});

app.listen(PORT, () => {
    console.log(`[NexxToHubOnTop] Running on http://localhost:${PORT} - 3 files only: index, tune, sgallery`);
});

module.exports = app;

