import mongoose from "mongoose";

// Define the schema for the Book model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      review: { type: String, required: true },
    },
  ],
  averageRating: { type: Number, default: 0 },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;