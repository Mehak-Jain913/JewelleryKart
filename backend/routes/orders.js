import { Router } from "express";
import { checkout, getUserOrders } from "../controllers/orderController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authRequired);

// Create order from cart (checkout)
router.post("/checkout", checkout);

// Get user's orders (userId comes from auth token)
router.get("/", getUserOrders);

export default router;

