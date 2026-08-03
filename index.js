const express = require('express');
const path = require('path');
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

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`VIP Tools jalan di http://localhost:${PORT}`);
  });
}

module.exports = app;