const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL, // Load frontend URL from environment variable
    'http://localhost:3000', 
    'https://booknest-app.netlify.app' // Added additional frontend URL explicitly
  ],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include HTTP methods for preflight
  allowedHeaders: ['Content-Type', 'Authorization'] // Include allowed headers
}));

// Handle preflight requests explicitly
app.options('*', cors());

// To log incoming origins for debugging
// app.use((req, res, next) => {
//   console.log(`Incoming request from Origin: ${req.headers.origin}`);
//   next();
// });

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// For serving images (static files)
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
