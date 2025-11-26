import { getPool } from "../config/dbConfig.js";

/**
 * Add product to wishlist
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Wishlist item
 */
export const addToWishlist = async (userId, productId) => {
  await getPool().query(
    `INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE user_id = user_id`,
    [userId, productId]
  );
  return { user_id: userId, product_id: productId };
};

/**
 * Remove product from wishlist
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 */
export const removeFromWishlist = async (userId, productId) => {
  await getPool().query(
    `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );
};

/**
 * Get all wishlist items for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of wishlist items with product details
 */
export const getWishlistByUser = async (userId) => {
  const [rows] = await getPool().query(
    `SELECT w.id, w.user_id, w.product_id,
            p.name, p.price, p.image_url, p.type, p.description, p.quantity
     FROM wishlist w
     JOIN products p ON p.id = w.product_id
     WHERE w.user_id = ?
     ORDER BY w.id DESC`,
    [userId]
  );
  return rows;
};

/**
 * Check if product is in wishlist
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} True if product is in wishlist
 */
export const isInWishlist = async (userId, productId) => {
  const [rows] = await getPool().query(
    `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`,
    [userId, productId]
  );
  return rows.length > 0;
};


