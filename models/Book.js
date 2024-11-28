const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  copies: { type: Number, required: true },
  image: { type: String }, // Path to the image file
  issued: { type: Boolean, default: false }, // Whether the book is currently issued
  lastIssued: { type: Date }, // Timestamp for when the book was last issued
});

module.exports = mongoose.model('Book', BookSchema);
