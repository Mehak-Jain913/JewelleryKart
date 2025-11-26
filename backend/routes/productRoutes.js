import { Router } from "express";
import {
  listProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
} from "../controllers/productController.js";
import { adminRequired } from "../middleware/auth.js";

const router = Router();

// Public routes - anyone can view products
router.get("/", listProducts);
router.get("/:id", getProduct);

// Protected routes - only admin can add/edit/delete products
router.post("/", adminRequired, addProduct);
router.put("/:id", adminRequired, editProduct);
router.delete("/:id", adminRequired, removeProduct);

export default router;


