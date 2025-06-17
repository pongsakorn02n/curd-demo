import express from 'express';
import pool from '../db.js';

const router = express.Router();

console.log("🛠️ Checkout route is ready!");
router.post('/checkout', async (req, res) => {
  const { cart } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query('INSERT INTO orders DEFAULT VALUES RETURNING id');
    const orderId = orderRes.rows[0].id;

    for (const item of cart) {
      console.log('🛒 Checking item:', item);

      if (!item.id || !Number.isInteger(item.id)) {
        throw new Error(`Invalid item ID: ${item.id}`);
      }

      const stockRes = await client.query('SELECT quantity FROM shop WHERE id = $1', [item.id]);
      const currentQty = stockRes.rows[0]?.quantity ?? 0;

      if (currentQty < item.quantity) {
        throw new Error(`สินค้า ${item.name} มีไม่พอในคลัง (เหลือ ${currentQty})`);
      }

      await client.query(
        'UPDATE shop SET quantity = quantity - $1 WHERE id = $2',
        [item.quantity, item.id]
      );

      await client.query(
        'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'ยืนยันคำสั่งซื้อเรียบร้อย', orderId });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('❌ Checkout failed:', e);
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});

// ✅ export router
export default router;
