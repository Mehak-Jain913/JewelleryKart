import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(payload.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    
    // Also verify admin email for extra security
    const ADMIN_EMAIL = "mehakj1208@gmail.com";
    if (user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    
    req.userId = payload.userId;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};




