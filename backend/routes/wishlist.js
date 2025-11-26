import { Router } from "express";
import {
  addWishlistItem,
  removeWishlistItem,
  getUserWishlist,
  checkWishlistStatus,
} from "../controllers/wishlistController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authRequired);

// Check if product is in wishlist (must come before /:userId to avoid route conflicts)
router.get("/check/:productId", checkWishlistStatus);

// Add to wishlist
router.post("/add/:productId", addWishlistItem);

// Remove from wishlist
router.delete("/remove/:productId", removeWishlistItem);

// Get user's wishlist (userId param is for RESTful convention, but we use req.userId from token for security)
router.get("/:userId", getUserWishlist);

export default router;

