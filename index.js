// index.js
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
import checkoutRouter from './api/checkout.js';
import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js'



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', checkoutRouter);
// app.use('/images', express.static('./images'));
app.use('/api', uploadRouter);
app.use('/api', authRouter);
// ให้ static access กับรูป
app.use('/images', express.static('public/images'));

// get db
// app.get('/', (req, res) => {
//   res.send('Welcome to the Demo Shop API');
// });

// GET: ทั้งหมด
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM shop ORDER BY id ASC');
  res.json(result.rows);
});

// GET: รายการเดียว
app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM shop WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

// POST: เพิ่ม
app.post('/', async (req, res) => {
  const { name, category, price, quantity, image } = req.body;
  // console("name : ",result.name);
  // if(result.name!=''){
  const result = await pool.query(
    'INSERT INTO shop (name, category, price, quantity, image) VALUES ($1, $2, $3, $4 ,$5) RETURNING *',
    [name, category, price, quantity, image]
  );
  res.json(result.rows[0]);
// }
// res.json({ message: 'ไม่มีชื่อรายการที่ต้องการเพิ่ม' });
});

// PUT: แก้ไข
app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity, image } = req.body;
 try {
    const result = await pool.query(
      'UPDATE shop SET name = $1, category = $2, price = $3, quantity = $4, image = $5 WHERE id = $6 RETURNING *',
      [name, category, price, quantity, image, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('ไม่พบสินค้า');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดในเซิร์ฟเวอร์');
  }
  res.json(result.rows[0]);
});

// DELETE: ลบ
app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM shop WHERE id = $1', [id]);
  res.json({ message: 'ลบเรียบร้อย' });
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
