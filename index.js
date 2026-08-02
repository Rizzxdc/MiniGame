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
  { icon: '<i data-lucide="worm"></i>', name: 'Snake', ... },
  { icon: '<i data-lucide="list-ordered"></i>', name: '2048', ... },
  { icon: '<i data-lucide="arrow-up-down"></i>', name: 'Gravity Flip', ... },
  { icon: '<i data-lucide="brain"></i>', name: 'Otak Kilat', ... }
]

app.get('/', (req, res) => {
  res.render('index', { tools });
});

// app.listen cuma jalan pas dites lokal — di Vercel, app-nya di-export sebagai serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`VIP Tools And Mini Game jalan di http://localhost:${PORT}`);
  });
}

module.exports = app;