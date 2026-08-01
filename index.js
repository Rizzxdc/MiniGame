const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Data menu tools -> gampang ditambah/diedit dari sini
const tools = {
  game: [
    { icon: '🐍', name: 'Snake', sub: 'Kumpulin skor', badge: 'MAIN', open: 'snake' },
    { icon: '🔢', name: '2048', sub: 'Gabung angka', badge: 'MAIN', open: 'g2048' },
    { icon: '🌀', name: 'Gravity Flip', sub: 'Balik gravitasi, hindari duri', badge: 'BARU', open: 'gravity' },
    { icon: '🧠', name: 'Otak Kilat', sub: 'Hafalin pola makin cepat', badge: 'BARU', open: 'otak' }
  ]
};

app.get('/', (req, res) => {
  res.render('index', { tools });
});

// app.listen cuma jalan pas dites lokal — di Vercel, app-nya di-export sebagai serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`VIP Tools jalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
