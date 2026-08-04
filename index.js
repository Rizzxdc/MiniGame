const express = require('express');
const path = require('path');
const axios = require('axios');
const { tiktokDl } = require('./scrapers/tiktok');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const tools = {
  game: [
    { icon: '<i data-lucide="worm"></i>', name: 'Snake', sub: 'Kumpulin skor', badge: 'MAIN', open: 'snake' },
    { icon: '<i data-lucide="list-ordered"></i>', name: '2048', sub: 'Gabung angka', badge: 'MAIN', open: 'g2048' },
    { icon: '<i data-lucide="arrow-up-down"></i>', name: 'Gravity Flip', sub: 'Balik gravitasi, hindari duri', badge: 'BARU', open: 'gravity' },
    { icon: '<i data-lucide="brain"></i>', name: 'Otak Kilat', sub: 'Hafalin pola makin cepat', badge: 'BARU', open: 'otak' },
    { icon: '<i data-lucide="target"></i>', name: 'Ketuk Refleks', sub: 'Tap sebelum waktu habis', badge: 'BARU', open: 'reflex' },
    { icon: '<i data-lucide="layers"></i>', name: 'Stack Tower', sub: 'Susun balok setinggi mungkin', badge: 'BARU', open: 'stack' }
  ],
  downloader: [
    { icon: '<i data-lucide="instagram"></i>', name: 'Instagram', sub: 'Download video & foto', badge: 'HD', open: 'dl-instagram', platform: 'instagram' },
    { icon: '<i data-lucide="music-2"></i>', name: 'TikTok', sub: 'No watermark', badge: 'MP4', open: 'dl-tiktok', platform: 'tiktok' },
    { icon: '<i data-lucide="youtube"></i>', name: 'YouTube', sub: 'Video & audio HD', badge: 'MP4/MP3', open: 'dl-youtube', platform: 'youtube' }
  ]
};

app.get('/', (req, res) => {
  res.render('index', { tools });
});

app.post('/api/download', express.json(), async (req, res) => {
  const { platform, url } = req.body || {};

  if (!url) {
    return res.status(400).json({ ok: false, message: 'URL belum diisi.' });
  }

  if (platform === 'tiktok') {
    try {
      const result = await tiktokDl(url);
      return res.json({ ok: true, data: result });
    } catch (e) {
      return res.status(500).json({ ok: false, message: e.message || 'Gagal mengambil data TikTok.' });
    }
  }

  return res.json({
    ok: false,
    message: `Scraper untuk ${platform} belum dipasang.`
  });
});

// Proxy download -> maksa file kedownload beneran, bukan diputar/dibuka di tab
app.get('/api/proxy-download', async (req, res) => {
  const { url, filename, type } = req.query;

  if (!url) {
    return res.status(400).send('URL kosong.');
  }

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const ext = type === 'audio' ? 'mp3' : 'mp4';
    const safeName = (filename || 'download').replace(/[^a-z0-9_\-]/gi, '_');

    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.${ext}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

    response.data.pipe(res);
  } catch (e) {
    res.status(500).send('Gagal mengambil file.');
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`VIP Tools jalan di http://localhost:${PORT}`);
  });
}

module.exports = app;