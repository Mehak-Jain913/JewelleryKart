import { createOrder, getOrdersByUser } from "../models/orderModel.js";
import { getCartItemsByUser, clearCart } from "../models/cartModel.js";

/**
 * Create a new order from cart items
 * POST /api/orders/checkout
 */
export const checkout = async (req, res) => {
  try {
    const userId = req.userId;

    // Get cart items
    const cartItems = await getCartItemsByUser(userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    // Prepare order items
    const orderItems = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    // Create order
    const order = await createOrder(userId, total, orderItems);

    // Clear cart
    await clearCart(userId);

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

/**
 * Get all orders for the authenticated user
 * GET /api/orders/:userId
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


