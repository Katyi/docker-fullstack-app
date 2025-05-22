const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/users');
const postcardRoutes = require('./routes/postcards');
const likeRoutes = require('./routes/likes');
const albumRoutes = require('./routes/albums');
const authRoutes = require('./routes/auth');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware
app.use(cookieParser());
app.use(express.json());

//cors
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://frontend:3000'],
    credentials: true,
  })
); // Allow CORS from your frontend

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend's origin if different
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', '*'); // Add 'Authorization'
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// Test API
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'API is working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/postcards', postcardRoutes);
app.use('/likes', likeRoutes);
app.use('/albums', albumRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
