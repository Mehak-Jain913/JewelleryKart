import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById, updateUserRole, updateUserPassword } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await createUser({ name, email, passwordHash, role: 'user' });
    const token = generateToken(created.id);
    res.status(201).json({ user: { id: created.id, name: created.name, email: created.email, role: created.role || 'user' }, token });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Check for admin credentials
    const ADMIN_EMAIL = "mehakj1208@gmail.com";
    const ADMIN_PASSWORD = "Srasti@1208";
    
    let user = await findUserByEmail(email);
    
    // FIX: If admin email matches, check password and ensure admin role
    if (email === ADMIN_EMAIL) {
      // Check if password matches the admin password
      if (password === ADMIN_PASSWORD) {
        // If user doesn't exist, create admin user
        if (!user) {
          const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
          user = await createUser({ 
            name: "Admin User", 
            email: ADMIN_EMAIL, 
            passwordHash, 
            role: 'admin' 
          });
        } else {
          // Ensure existing user has admin role
          if (user.role !== 'admin') {
            await updateUserRole(user.id, 'admin');
            user.role = 'admin';
          }
          // IMPROVED: Verify password matches stored hash, or update if needed
          // First check if password matches plain text admin password
          // Then verify/update the hash in database
          const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
          await updateUserPassword(user.id, passwordHash);
        }
        const token = generateToken(user.id);
        return res.json({ 
          user: { 
            id: user.id, 
            name: user.name || "Admin User", 
            email: user.email, 
            role: 'admin' 
          }, 
          token 
        });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }
    
    // Regular user login
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user.id);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' }, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user' } });
  } catch {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};




