import { getPool } from "../config/dbConfig.js";

// FIX: Include password field for login verification
export const findUserByEmail = async (email) => {
  const [rows] = await getPool().query("SELECT id, name, email, password, role FROM users WHERE email = ?", [email]);
  return rows[0] || null;
};

export const createUser = async ({ name, email, passwordHash, role = 'user' }) => {
  const [result] = await getPool().query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return { id: result.insertId, name, email, role: role || 'user' };
};

export const findUserById = async (id) => {
  const [rows] = await getPool().query("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
  return rows[0] || null;
};

export const updateUserRole = async (id, role) => {
  await getPool().query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
};

export const updateUserPassword = async (id, passwordHash) => {
  await getPool().query("UPDATE users SET password = ? WHERE id = ?", [passwordHash, id]);
};

export const getAllUsers = async () => {
  const [rows] = await getPool().query("SELECT id, name, email, role FROM users ORDER BY id DESC");
  return rows;
};




