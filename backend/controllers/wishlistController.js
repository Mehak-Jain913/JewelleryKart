import {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUser,
  isInWishlist,
} from "../models/wishlistModel.js";

/**
 * Add product to wishlist
 * POST /api/wishlist/add/:productId
 */
export const addWishlistItem = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = parseInt(req.params.productId);
    if (!productId) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    await addToWishlist(userId, productId);
    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

/**
 * Remove product from wishlist
 * DELETE /api/wishlist/remove/:productId
 */
export const removeWishlistItem = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = parseInt(req.params.productId);
    if (!productId) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    await removeFromWishlist(userId, productId);
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

/**
 * Get user's wishlist
 * GET /api/wishlist/:userId
 */
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const wishlist = await getWishlistByUser(userId);
    res.json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

/**
 * Check if product is in wishlist
 * GET /api/wishlist/check/:productId
 */
export const checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = parseInt(req.params.productId);
    if (!productId) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const inWishlist = await isInWishlist(userId, productId);
    res.json({ inWishlist });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({ message: "Failed to check wishlist status" });
  }
};


