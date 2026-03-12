// api/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const booksRoutes = require('./books');
const uploadRoutes = require('./upload');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/upload', uploadRoutes);

module.exports = app; // هكذا Vercel يعرف كيف يشغل السيرفر