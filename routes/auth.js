import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

const router = express.Router();

const HARDCODED_USER = {
  email: "test@example.com",
  password: "password123",
};

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
    const token = jwt.sign({ userId: 1, email }, JWT_SECRET, { expiresIn: "1h" }); // Including userId for consistency
    return res.status(200).json({ token, message: "Login successful!" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

export default router;
