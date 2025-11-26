import { getPool } from "../config/dbConfig.js";
import { getAllOrders } from "../models/orderModel.js";
import { getAllUsers } from "../models/userModel.js";

/**
 * Get admin dashboard summary (users, orders, products, revenue)
 * GET /api/admin/summary
 */
export const getAdminSummary = async (req, res) => {
  try {
    const pool = getPool();

    // Get total users
    const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users");
    const totalUsers = userCount[0].count;

    // Get total products
    const [productCount] = await pool.query(
      "SELECT COUNT(*) as count FROM products"
    );
    const totalProducts = productCount[0].count;

    // Get total orders
    const [orderCount] = await pool.query("SELECT COUNT(*) as count FROM orders");
    const totalOrders = orderCount[0].count;

    // Get total revenue
    const [revenueRows] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) as totalRevenue FROM orders"
    );
    const totalRevenue = parseFloat(revenueRows[0].totalRevenue) || 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    res.status(500).json({ message: "Failed to fetch admin summary" });
  }
};

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const pool = getPool();

    // Get total users
    const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users");
    const totalUsers = userCount[0].count;

    // Get total products
    const [productCount] = await pool.query(
      "SELECT COUNT(*) as count FROM products"
    );
    const totalProducts = productCount[0].count;

    // Get total orders
    const [orderCount] = await pool.query("SELECT COUNT(*) as count FROM orders");
    const totalOrders = orderCount[0].count;

    // Get top-selling product
    const [topProductRows] = await pool.query(
      `SELECT p.name, SUM(oi.quantity) as total_sold
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       GROUP BY p.id, p.name
       ORDER BY total_sold DESC
       LIMIT 1`
    );
    const topProduct = topProductRows.length > 0 ? topProductRows[0].name : "N/A";

    // Get monthly sales (last 12 months)
    const [monthlySalesRows] = await pool.query(
      `SELECT 
         DATE_FORMAT(order_date, '%Y-%m') as month,
         DATE_FORMAT(order_date, '%b %Y') as monthLabel,
         SUM(total) as sales
       FROM orders
       WHERE order_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(order_date, '%Y-%m'), DATE_FORMAT(order_date, '%b %Y')
       ORDER BY month ASC`
    );

    // Format monthly sales as array of objects with labels
    const monthlySales = monthlySalesRows.map((row) => ({
      month: row.month,
      monthLabel: row.monthLabel,
      sales: parseFloat(row.sales) || 0
    }));

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      topProduct,
      monthlySales,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Failed to fetch admin statistics" });
  }
};

/**
 * Get recent orders with items
 * GET /api/admin/orders
 */
export const getAdminOrders = async (req, res) => {
  try {
    const pool = getPool();
    const limit = parseInt(req.query.limit) || 50;

    // Get recent orders with user info
    const [orders] = await pool.query(
      `SELECT o.id, o.user_id, o.total, o.order_date, 
              u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.order_date DESC
       LIMIT ?`,
      [limit]
    );

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.query(
          `SELECT oi.id, oi.product_id, oi.quantity,
                  p.name as product_name, p.price, p.image_url, p.type
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * Get all users
 * GET /api/admin/users
 */
export const getAdminUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


