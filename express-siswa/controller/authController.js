const db = require('../database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'token-jwt'; // Ganti ini di real project

// Helper buat cek kata-kata berbahaya
const containsSQLInjection = (input) => {
    const forbiddenWords = ['select', 'insert', 'update', 'delete', 'drop', 'alter', 'create', 'replace', 'truncate'];
    const lowerInput = input.toLowerCase();
    return forbiddenWords.some(word => lowerInput.includes(word));
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan Password wajib diisi!' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email tidak ditemukan!' });
        }

        const user = rows[0];

        // Kalau password kamu belum di-bcrypt saat simpan di database:
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password salah!' });
        }

        // Pastikan role siswa
        if (user.role !== 'siswa') {
            return res.status(403).json({ message: 'Hanya siswa yang boleh login.' });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            message: 'Login berhasil!',
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { login };
