const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const router = express.Router();
const protect = require('../middlewares/protect');

// Example protected route to get user profile (accessible to authenticated users)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

module.exports = router;
