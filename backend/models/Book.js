const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['islamic', 'literature', 'science', 'history', 'philosophy', 'law', 'medicine', 'economy', 'other']
  },
  description: {
    type: String,
    default: ''
  },
  year: {
    type: Number,
    default: null
  },
  fileUrl: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    default: null
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  fileSize: {
    type: Number,
    default: 0
  },
  pages: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
