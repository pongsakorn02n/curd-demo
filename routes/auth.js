import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db.js';

dotenv.config();
const router = express.Router();
const secret = process.env.JWT_SECRET || 'your-secret-key';

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'กรอกข้อมูลให้ครบ' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hash]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Username ซ้ำ' });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('📥 Login attempt:', username, password);
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
  
      if (!user) return res.status(401).json({ error: 'ไม่พบผู้ใช้' });
  
      console.log('🔎 User from DB:', user);
  
      const match = await bcrypt.compare(password, user.password);
      console.log('✅ Compare bcrypt:', match);
  
      if (!match) return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
  
      const token = jwt.sign(
        { id: user.id, username: user.username },
        secret,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
  });
  

export default router;
