import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

const router = express.Router();

const USERS = [];

// Signup route
router.post("/signup", (req, res) => {
  console.log("Signup request received:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Validation failed: Missing fields.");
    return res.status(400).json({ message: "Email and password are required." });
  }

  const userExists = USERS.find((user) => user.email === email);
  if (userExists) {
    console.log("User already exists:", email);
    return res.status(409).json({ message: "User already exists. Please log in." });
  }

  const newUser = { id: USERS.length + 1, email, password };
  USERS.push(newUser);
  console.log("New user added:", newUser);

  return res.status(201).json({ message: "Signup successful. Please log in." });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = USERS.find((user) => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({ token, message: "Login successful!" });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is missing or invalid." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token data to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default router;
