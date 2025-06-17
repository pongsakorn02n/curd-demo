// upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// สร้างโฟลเดอร์ถ้ายังไม่มี
const imagePath = path.join(process.cwd(), 'public/images');
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

// ตั้งค่า multer สำหรับเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagePath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// POST /api/upload-image
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'ไม่พบไฟล์ที่อัปโหลด' });
  }
  res.json({
    message: 'อัปโหลดสำเร็จ',
    filename: req.file.filename,
    path: `/images/${req.file.filename}`,
  });
  
});

export default router;
