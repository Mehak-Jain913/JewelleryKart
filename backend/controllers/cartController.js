import { clearCart, getCartItemsByUser, removeCartItem, upsertCartItem } from "../models/cartModel.js";

export const getCart = async (req, res) => {
  try {
    const items = await getCartItemsByUser(req.userId);
    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addOrUpdateItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity == null) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }
    const q = Math.max(1, Number(quantity));
    const item = await upsertCartItem(req.userId, Number(productId), q);
    res.status(201).json(item);
  } catch {
    res.status(500).json({ message: "Failed to update cart" });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    await removeCartItem(req.userId, Number(productId));
    res.json({ message: "Item removed" });
  } catch {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

export const emptyCart = async (req, res) => {
  try {
    await clearCart(req.userId);
    res.json({ message: "Cart cleared" });
  } catch {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};




