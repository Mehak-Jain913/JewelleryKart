import { Router } from "express";
import { getAdminStats, getAdminSummary, getAdminOrders, getAdminUsers } from "../controllers/adminStatsController.js";
import { adminRequired } from "../middleware/auth.js";

const router = Router();

// All routes require admin authentication
router.use(adminRequired);

// Get admin summary (users, orders, products, revenue)
router.get("/summary", getAdminSummary);

// Get admin statistics (includes monthly sales, top product)
router.get("/stats", getAdminStats);

// Get recent orders with items
router.get("/orders", getAdminOrders);

// Get all users
router.get("/users", getAdminUsers);

export default router;


