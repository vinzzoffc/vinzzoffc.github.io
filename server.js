const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = 'gantiencryptsendiri';

app.use(express.json());
app.use(express.static('public'));

app.post('/api/tambah', (req, res) => {
  const { apiKey, nomor, nama } = req.body;

  if (apiKey !== API_KEY) {
    return res.status(403).json({ message: 'API Key Salah!' });
  }

  if (!nomor || !nama) {
    return res.status(400).json({ message: 'Isi semua form!' });
  }

  const path = './database.json';
  let db = { status: 200, success: true, data: [], creator: "Vinzz-Developer" };

  if (fs.existsSync(path)) {
    db = JSON.parse(fs.readFileSync(path, 'utf-8'));
  }

  db.data.push({ nomor, nama });

  fs.writeFileSync(path, JSON.stringify(db, null, 2));
  res.json({ message: 'Berhasil Ditambahkan!' });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});