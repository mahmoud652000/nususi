const express = require('express');
const Book = require('../models/Book');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all books (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { status: 'approved' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const books = await Book.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest books (public)
router.get('/latest', async (req, res) => {
  try {
    const books = await Book.find({ status: 'approved' })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('userId', 'name');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Increment views
    book.views += 1;
    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's books (private)
router.get('/user/mybooks', auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book (private - owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized' });
    }

    const { title, author, category, description, year } = req.body;
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.description = description || book.description;
    book.year = year || book.year;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book (private - owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found or unauthorized' });
    }

    await Book.deleteOne({ _id: req.params.id });
    
    // Update user's book count
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { $inc: { booksCount: -1 } });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      book.downloads += 1;
      await book.save();
    }
    res.json({ message: 'Download counted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get books by category
router.get('/category/:category', async (req, res) => {
  try {
    const books = await Book.find({ 
      category: req.params.category,
      status: 'approved'
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
