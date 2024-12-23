import express from "express";
import Book from "../models/Book.js";
import { authenticateUser } from "../middleware/auth.js"; // Import the authentication middleware

const router = express.Router();

// Get details for a specific book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Add a review and rating for a book
router.post("/review/:id", authenticateUser, async (req, res) => { // Add the authentication middleware
  const { rating, review } = req.body;

  if (!rating || !review) {
    return res.status(400).json({ message: "Rating and review are required" });
  }

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add the review and rating
    book.reviews.push({
      rating,
      review,
      user: req.user.id, // Assuming you have the user ID available
    });

    // Update the book's average rating
    const totalReviews = book.reviews.length;
    const totalRating = book.reviews.reduce((acc, review) => acc + review.rating, 0);
    book.averageRating = totalRating / totalReviews;

    await book.save();

    res.status(201).json({ message: "Review added successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;