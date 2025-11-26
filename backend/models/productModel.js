import { getPool } from "../config/dbConfig.js";

export const getAllProducts = async (filters = {}) => {
  const { search, type, minPrice, maxPrice } = filters;

  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push("(name LIKE ? OR description LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like);
  }
  if (type) {
    whereClauses.push("type = ?");
    params.push(type);
  }
  if (minPrice != null && minPrice !== "") {
    whereClauses.push("price >= ?");
    params.push(Number(minPrice));
  }
  if (maxPrice != null && maxPrice !== "") {
    whereClauses.push("price <= ?");
    params.push(Number(maxPrice));
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const [rows] = await getPool().query(
    `SELECT * FROM products ${whereSql} ORDER BY id DESC`,
    params
  );
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await getPool().query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0] || null;
};

export const createProduct = async (product) => {
  const { name, type, price, quantity, description, image_url } = product;
  const [result] = await getPool().query(
    "INSERT INTO products (name, type, price, quantity, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    [name, type, price, quantity, description ?? null, image_url ?? null]
  );
  return { id: result.insertId, ...product };
};

export const updateProduct = async (id, product) => {
  const { name, type, price, quantity, description, image_url } = product;
  await getPool().query(
    `UPDATE products SET name = ?, type = ?, price = ?, quantity = ?, description = ?, image_url = ? WHERE id = ?`,
    [name, type, price, quantity, description ?? null, image_url ?? null, id]
  );
  return { id, ...product };
};

export const deleteProduct = async (id) => {
  await getPool().query("DELETE FROM products WHERE id = ?", [id]);
};


