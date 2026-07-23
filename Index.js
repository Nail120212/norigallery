const express = require('express');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Landing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tune - with or without ID, always same UI (shows "no input" if no id)
app.get('/tune', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});
app.get('/tune/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});
app.get('/t/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});
app.get('/t', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tune.html'));
});

// Sticker - with or without ID, always same UI (shows "no input" if no id)
app.get('/SG', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/SG/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/SG/Id=:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/s/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/s', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/sticker', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});
app.get('/sticker/:pasteId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
});

// Fallback - no 404, show same UI with "no input"
app.get('*', (req, res) => {
    // If path looks like tune, serve tune, else sticker or index
    if (req.path.startsWith('/t')) {
        res.sendFile(path.join(__dirname, 'public', 'tune.html'));
    } else if (req.path.startsWith('/s') || req.path.startsWith('/SG')) {
        res.sendFile(path.join(__dirname, 'public', 'sgallery.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`[NexxToHubOnTop] Running on http://localhost:${PORT} - 3 files only`);
    });
}

module.exports = app;

