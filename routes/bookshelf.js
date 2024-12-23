import express from 'express';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

const userBookshelf = {};

// Fetch all books in the user's bookshelf
router.get("/my-bookshelf", authenticateUser, (req, res) => {
  const bookshelf = userBookshelf[req.userId] || [];
  res.json(bookshelf);
});

// Add a book to the user's bookshelf
router.post("/my-bookshelf", authenticateUser, (req, res) => {
    const userId = req.userId; // From the JWT token
    const { id, title, author, description, coverImage } = req.body;
  
    if (!id || !title || !author) {
      return res.status(400).json({ error: "Missing required book details" });
    }
  
    // Initialize bookshelf if not present
    if (!userBookshelf[userId]) userBookshelf[userId] = [];
  
    // Check if the book already exists
    if (userBookshelf[userId].some((book) => book.id === id)) {
      return res.status(400).json({ error: "Book already in bookshelf" });
    }
  
    // Add the book to the user's bookshelf
    userBookshelf[userId].push({ id, title, author, description, coverImage });
    res.status(201).json({ message: "Book added to bookshelf" });
  });
// Remove a book from the user's bookshelf
router.delete("/my-bookshelf/:bookId", authenticateUser, (req, res) => {
  const bookId = req.params.bookId;

  if (!userBookshelf[req.userId]) {
    return res.status(404).json({ error: "Bookshelf not found" });
  }

  userBookshelf[req.userId] = userBookshelf[req.userId].filter((book) => book.id !== bookId);
  res.json({ message: "Book removed from bookshelf" });
});

export default router;
