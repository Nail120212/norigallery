const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SGallery = require('./SGallery');
const Tune = require('./Tune');

app.use('/api/sgallery', SGallery.router);
app.use('/api/tune', Tune.router);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tune', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});

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

app.get('/t/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});

app.listen(PORT, () => {
    console.log(`[NexxToHubOnTop] Running on http://localhost:${PORT}`);
});

module.exports = app;
