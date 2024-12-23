import express from 'express';
import axios from 'axios';

const router = express.Router();
const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const GOOGLE_API_KEY = "AIzaSyC7h5u8QmOunNH-tBs2lsaLSer3Wk_iVS4"; // Optional

// Fetch books
router.get("/books", async (req, res) => {
  const query = req.query.q || "bestsellers";

  try {
    const response = await axios.get(GOOGLE_BOOKS_API_BASE_URL, {
      params: { q: query, key: GOOGLE_API_KEY, maxResults: 20 },
    });

    const books = response.data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["Unknown Author"],
      description: item.volumeInfo.description || "No description available",
      image: item.volumeInfo.imageLinks?.thumbnail || null,
      infoLink: item.volumeInfo.infoLink || "#",
    }));

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books from Google Books API" });
  }
});

export default router;
