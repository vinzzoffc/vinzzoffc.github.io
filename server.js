const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3005;
const DATA_FILE = path.join(__dirname, "numbers.json");
const API_KEY = "vinzzoffc"; // API Key untuk keamanan
const NOT_FOUND_PAGE = path.join(__dirname, "404z.html"); // Path halaman 404

app.use(express.json());

// Middleware untuk validasi API Key
const validateApiKey = (req, res, next) => {
    if (req.query.apikey !== API_KEY) {
        return res.status(403).json({ 
            status: 403, 
            error: "API Key tidak valid", 
            creator: "Vinzz-NotDeveloper" 
        });
    }
    next();
};

// Fungsi untuk membaca database
const readDatabase = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

// Fungsi untuk menulis database
const writeDatabase = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Endpoint untuk menambahkan nomor
app.get("/add", validateApiKey, (req, res) => {
    const { nomor, nama } = req.query;
    if (!nomor || !nama) {
        return res.status(400).json({
            status: 400,
            error: "Nomor dan nama wajib diisi",
            creator: "Vinzz-NotDeveloper"
        });
    }

    let db = readDatabase();
    const plainNomor = nomor;

    if (db.some(entry => entry.nomor === plainNomor)) {
        return res.status(400).json({
            status: 400,
            error: "Nomor sudah terdaftar",
            creator: "Vinzz-NotDeveloper"
        });
    }

    db.push({ nomor: plainNomor, nama });
    writeDatabase(db);

    res.status(201).json({
        status: 201,
        success: true,
        message: "Nomor berhasil ditambahkan",
        nomor: plainNomor,
        nama,
        creator: "Vinzz-NotDeveloper"
    });
});

// Endpoint untuk menghapus nomor
app.get("/delete", validateApiKey, (req, res) => {
    const { nomor } = req.query;
    if (!nomor) {
        return res.status(400).json({ 
            status: 400, 
            error: "Nomor wajib diisi", 
            creator: "Vinzz-NotDeveloper" 
        });
    }

    let db = readDatabase();
    const plainNomor = nomor;
    const newDb = db.filter(entry => entry.nomor !== plainNomor);

    if (db.length === newDb.length) {
        return res.status(404).json({ 
            status: 404, 
            error: "Nomor tidak ditemukan", 
            creator: "Vinzz-NotDeveloper" 
        });
    }

    writeDatabase(newDb);
    res.json({ 
        status: 200, 
        success: true, 
        message: "Nomor berhasil dihapus", 
        nomor: plainNomor,
        creator: "Vinzz-NotDeveloper" 
    });
});

// Endpoint untuk melihat daftar nomor
app.get("/list", (req, res) => {
    const db = readDatabase();
    res.json({ 
        status: 200, 
        success: true, 
        data: db, 
        creator: "Vinzz-NotDev" 
    });
});

// Middleware untuk menangani halaman 404
app.use((req, res) => {
    if (fs.existsSync(NOT_FOUND_PAGE)) {
        res.status(404).sendFile(NOT_FOUND_PAGE);
    } else {
        res.status(404).json({ 
            status: 404, 
            error: "Halaman tidak ditemukan", 
            creator: " Vinzz-NotDeveloper" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});