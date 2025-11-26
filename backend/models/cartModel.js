import { getPool } from "../config/dbConfig.js";

export const getCartItemsByUser = async (userId) => {
  const [rows] = await getPool().query(
    `SELECT c.id, c.user_id, c.product_id, c.quantity,
            p.name, p.price, p.image_url, p.type, p.description
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?
     ORDER BY c.id DESC`,
    [userId]
  );
  return rows;
};

export const upsertCartItem = async (userId, productId, quantity) => {
  await getPool().query(
    `INSERT INTO cart (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
    [userId, productId, quantity]
  );
  return { user_id: userId, product_id: productId, quantity };
};

export const removeCartItem = async (userId, productId) => {
  await getPool().query(`DELETE FROM cart WHERE user_id = ? AND product_id = ?`, [userId, productId]);
};

export const clearCart = async (userId) => {
  await getPool().query(`DELETE FROM cart WHERE user_id = ?`, [userId]);
};




