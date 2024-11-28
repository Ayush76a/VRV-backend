const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // Log the request data to ensure it's being received correctly
    console.log("Register request data:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    // Save user to database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Error in register route:", err); // Log the error for debugging
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send the token and user role in the response
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Error in login route:", err); // Log the error for debugging
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

module.exports = router;
