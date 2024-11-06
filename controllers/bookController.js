const Book = require('../models/Book');

exports.addBook = async (req, res) => {
    console.log("reached add book")
    const { title, author, genre, condition } = req.body;
  
    // Validate request body
    if (!title || !author || !genre || !condition) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Create a new book instance
      const book = new Book({
        title,
        author,
        genre,
        condition,
        availability:1,
        owner: req.user.id,
      });
  
      // Save the book to the database
      await book.save();
  
      // Respond with the created book
      res.status(201).json(book); // 201 Created
    } catch (err) {
      console.error('Error adding book:', err.message); // Log the error message for debugging
      res.status(500).json({ message: 'Server error', error: err.message }); // Return the error message
    }
  };

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('owner', 'name');
    res.json(books);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.searchBooks = async (req, res) => {
  const { title, author, genre } = req.query;
  const query = {};

  if (title) query.title = new RegExp(title, 'i');
  if (author) query.author = new RegExp(author, 'i');
  if (genre) query.genre = genre;

  try {
    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
exports.getBookById = async (req, res) => {
  const { id } = req.params; // Get book ID from URL params
  const userId = req.user.id; // User ID from the auth middleware

  try {
    const book = await Book.findOne({ _id: id, owner: userId }); // Ensure the book belongs to the user
    if (!book) {
      return res.status(404).json({ msg: 'Book not found or not authorized' });
    }

    res.json(book); // Return the book details
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).send('Server error');
  }
};

exports.editBooks = async (req, res) => {
  const { id } = req.params; // Get book ID from URL params
  const updates = req.body; // Get updated details from the request body
  const userId = req.user.id; // User ID from the auth middleware

  try {
    const book = await Book.findOneAndUpdate(
      { _id: id, owner: userId }, // Ensure it belongs to the user
      updates,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ msg: 'Book not found or not authorized' });
    }

    res.json(book); // Return the updated book details
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send('Server error');
  }
};


exports.deleteBook = async (req, res) => {
  const { id } = req.params; // Get book ID from URL params

  try {
    const book = await Book.findByIdAndDelete(id); // Find and delete the book

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.json({ msg: 'Book deleted successfully' }); // Confirm deletion
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Server error');
  }
};
