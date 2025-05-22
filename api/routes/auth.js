const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, country, city, birthday, imageUrl, about } =
      req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        country,
        city,
        birthday,
        imageUrl,
        about,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET);

    // Set cookies
    res.cookie('token', token, {
      sameSite: 'strict',
      path: '/',
      expires: new Date(new Date().getTime() + 3650 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // secure: true,
    });

    res.status(201).json({
      message: 'User registered successfully',
      // token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET);

    // Set cookies
    res.cookie('token', token, {
      sameSite: 'strict',
      path: '/',
      expires: new Date(new Date().getTime() + 3650 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // secure: true,
    });

    res.status(200).json({
      message: 'Login successful',
      // token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.status(200).clearCookie('token').json('Logout successful');
});

module.exports = router;
