const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware

// handling cors erros
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'], // Allow both deployed frontend URL and local development URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// For multer (serving images)
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const adminRoutes = require('./routes/admin');
const librarianRoutes = require('./routes/librarian');
const memberRoutes = require('./routes/member');

// Use routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/admin', adminRoutes);
app.use('/librarian', librarianRoutes);
app.use('/member', memberRoutes);

// Database connection and server start
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => console.error(err));
