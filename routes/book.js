const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const multer = require('multer');
const verifyRole = require('../middlewares/verifyRole'); // Correct import
const protect = require('../middlewares/protect');

const cloudinary = require('../config/cloudinary'); // Import Cloudinary configuration
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure the Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'books', // Folder where images will be stored in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats for images
  },
});

// Configure Multer with Cloudinary storage
const upload = multer({ storage });


// Route to add a book (only accessible by Admin)
router.post('/add', protect, verifyRole('Admin'), upload.single('image'), async (req, res) => {
  try {
    const { title, author, copies } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Uploaded image URL from Cloudinary

    const newBook = new Book({
      title,
      author,
      copies,
      image: imageUrl, // Save the image URL in the book document
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Error adding book' });
  }
});

// Route to delete a book (only accessible by Admin)
router.delete('/:id/delete', protect, verifyRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});

// Route to get all books (accessible by all roles)
router.get('/', protect,  async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});



router.post('/issue', protect, verifyRole('Librarian'), async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.copies <= 0) {
      return res.status(400).json({ message: 'No copies available to issue' });
    }

    // Update the book details
    book.copies -= 1;
    book.issued = true;
    book.lastIssued = new Date();

    await book.save();

    res.status(200).json({ message: 'Book issued successfully', book });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ message: 'Error issuing book' });
  }
});


// Route to get all issued books (accessible by all roles)
router.get('/issued-books', async (req, res) => {
  try {
    const books = await Book.find({ issued:true});
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching issued books:', error);
    res.status(500).json({ message: 'Error fetching issued books' });
  }
});


module.exports = router;
