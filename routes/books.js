const express = require("express");
const router = express.Router();

const Book = require("../models/Book");


// GET ALL BOOKS WITH SEARCH & PAGINATION
router.get("/", async (req, res) => {
  try {

    const { author, genre, page = 1, limit = 5 } = req.query;

    let filter = {};

    if (author) {
      filter.author = new RegExp(author, "i");
    }

    if (genre) {
      filter.genre = new RegExp(genre, "i");
    }

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      total,
      page: Number(page),
      books
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET SINGLE BOOK
router.get("/:id", async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// CREATE BOOK
router.post("/", async (req, res) => {

  try {

    const {
      title,
      author,
      genre,
      price,
      publishedDate,
      inStock
    } = req.body;

    if (!title || !author || !price) {
      return res.status(400).json({
        message: "Title, Author and Price are required"
      });
    }

    const book = new Book({
      title,
      author,
      genre,
      price,
      publishedDate,
      inStock
    });

    const savedBook = await book.save();

    res.status(201).json(savedBook);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// UPDATE BOOK
router.put("/:id", async (req, res) => {

  try {

    const {
      title,
      author,
      price
    } = req.body;

    if (!title || !author || !price) {
      return res.status(400).json({
        message: "Title, Author and Price are required"
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(updatedBook);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });
  }
});


// DELETE BOOK
router.delete("/:id", async (req, res) => {

  try {

    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json({
      message: "Book deleted successfully"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;
