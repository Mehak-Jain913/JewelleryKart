import { Router } from "express";
import { loginUser, registerUser, me } from "../controllers/userController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authRequired, me);

export default router;




