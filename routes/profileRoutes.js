// Backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Register route called with body:', req.body);
    
    const { name, contact } = req.body;
    
    // Validation
    if (!name || !contact) {
      console.log('Validation failed: Missing name or contact');
      return res.status(400).json({
        success: false,
        message: 'Name and contact are required'
      });
    }
    
    // Check if user with this contact already exists
    const existingUser = await User.findOne({ contact });
    
    if (existingUser) {
      console.log('User already exists with contact:', contact);
      return res.status(400).json({
        success: false,
        message: 'User with this email/phone already exists'
      });
    }
    
    // Create new user
    const newUser = new User({
      name,
      contact
    });
    
    console.log('Attempting to save new user:', newUser);
    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);
    
    res.status(201).json({
      success: true,
      data: savedUser,
      message: 'User registered successfully'
    });
    
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;