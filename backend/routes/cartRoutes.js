import { Router } from "express";
import { addOrUpdateItem, emptyCart, getCart, removeItem } from "../controllers/cartController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.use(authRequired);
router.get("/", getCart);
router.post("/", addOrUpdateItem);
router.delete("/:productId", removeItem);
router.delete("/", emptyCart);

export default router;




