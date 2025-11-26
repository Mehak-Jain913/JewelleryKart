import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../models/productModel.js";

export const listProducts = async (req, res) => {
  try {
    const { q, type, minPrice, maxPrice } = req.query;
    const products = await getAllProducts({
      search: q?.trim() || undefined,
      type: type?.trim() || undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, type, price, quantity, description, image_url } = req.body;
    if (!name || !type || price == null || quantity == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const created = await createProduct({ name, type, price, quantity, description, image_url });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getProductById(id);
    if (!existing) return res.status(404).json({ message: "Product not found" });

    const { name, type, price, quantity, description, image_url } = req.body;
    if (!name || !type || price == null || quantity == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const updated = await updateProduct(id, { name, type, price, quantity, description, image_url });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getProductById(id);
    if (!existing) return res.status(404).json({ message: "Product not found" });
    await deleteProduct(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};


