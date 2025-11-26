import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orders.js";
import wishlistRoutes from "./routes/wishlist.js";
import adminStatsRoutes from "./routes/adminStats.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// FIX: Initialize database connection before starting server
const startServer = async () => {
  try {
    await connectDB();
    
    app.get("/", (req, res) => {
      res.json({ message: "API is live" });
    });

    app.use("/api/products", productRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/wishlist", wishlistRoutes);
    app.use("/api/admin", adminStatsRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
