import { getPool } from "../config/dbConfig.js";

/**
 * Create a new order from cart items
 * @param {number} userId - User ID
 * @param {number} total - Total order amount
 * @param {Array} items - Array of {product_id, quantity}
 * @returns {Promise<Object>} Created order with items
 */
export const createOrder = async (userId, total, items) => {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total) VALUES (?, ?)`,
      [userId, total]
    );
    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
        [orderId, item.product_id, item.quantity]
      );
    }

    await connection.commit();
    return { id: orderId, user_id: userId, total, items };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get all orders for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of orders with items
 */
export const getOrdersByUser = async (userId) => {
  const [orders] = await getPool().query(
    `SELECT o.id, o.user_id, o.total, o.order_date
     FROM orders o
     WHERE o.user_id = ?
     ORDER BY o.order_date DESC`,
    [userId]
  );

  // Get items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const [items] = await getPool().query(
        `SELECT oi.id, oi.product_id, oi.quantity,
                p.name, p.price, p.image_url, p.type
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      return { ...order, items };
    })
  );

  return ordersWithItems;
};

/**
 * Get all orders (for admin)
 * @returns {Promise<Array>} Array of all orders
 */
export const getAllOrders = async () => {
  const [orders] = await getPool().query(
    `SELECT o.id, o.user_id, o.total, o.order_date, u.name as user_name, u.email as user_email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.order_date DESC`
  );
  return orders;
};


