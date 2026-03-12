const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDownloads = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]);
    const totalViews = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    // Books by category
    const booksByCategory = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Recent books
    const recentBooks = await Book.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top downloaded books
    const topBooks = await Book.find()
      .populate('userId', 'name')
      .sort({ downloads: -1 })
      .limit(5);

    res.json({
      stats: {
        totalBooks,
        totalUsers,
        totalDownloads: totalDownloads[0]?.total || 0,
        totalViews: totalViews[0]?.total || 0
      },
      booksByCategory,
      recentBooks,
      topBooks
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats (for logged in user)
router.get('/user-stats', auth, async (req, res) => {
  try {
    const myBooks = await Book.find({ userId: req.user.id });
    const totalDownloads = myBooks.reduce((sum, book) => sum + book.downloads, 0);
    const totalViews = myBooks.reduce((sum, book) => sum + book.views, 0);

    res.json({
      booksCount: myBooks.length,
      totalDownloads,
      totalViews,
      books: myBooks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await User.findByIdAndDelete(req.params.id);
    // Delete user's books
    await Book.deleteMany({ userId: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book status (admin only)
router.put('/books/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
