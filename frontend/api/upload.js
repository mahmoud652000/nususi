const express = require('express');
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload book (requires authentication)
router.post('/book', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const { title, author, category, description, year } = req.body;

    // Validation
    if (!title || !author || !category) {
      // Delete uploaded file if validation fails
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please provide title, author, and category' });
    }

    // Create file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    // Create book record
    const book = new Book({
      title,
      author,
      category,
      description: description || '',
      year: year || null,
      fileUrl,
      fileSize: req.file.size,
      userId: req.user.id,
      status: 'approved'
    });

    await book.save();

    // Update user's book count
    await User.findByIdAndUpdate(req.user.id, { $inc: { booksCount: 1 } });

    res.status(201).json({
      message: 'Book uploaded successfully',
      book: await Book.findById(book._id).populate('userId', 'name')
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Delete uploaded file if error
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Upload book cover (optional)
router.post('/cover', auth, upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const coverUrl = `/uploads/${req.file.filename}`;
    res.json({ coverUrl });
  } catch (error) {
    console.error('Cover upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Max 50MB allowed.' });
    }
  }
  res.status(500).json({ message: error.message || 'Upload error' });
});

module.exports = router;
