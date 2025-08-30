const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/users');
const postcardRoutes = require('./routes/postcards');
const likeRoutes = require('./routes/likes');
const albumRoutes = require('./routes/albums');
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://frontend:3000',
      'http://212.113.120.58:3001',
      'http://postcardfolio.ru',
    ],
    credentials: true,
  })
); // Allow CORS from your frontend

// Определяем путь к папке с медиа файлами
let staticFilesPath;
if (process.env.NODE_ENV === 'production') {
  staticFilesPath = '/var/www/fileUpload/uploaded_files/media'; // для сервера
} else {
  staticFilesPath = path.join(__dirname, 'uploads'); // Папка 'uploads' в корне папки api
}

app.use('/media', express.static(staticFilesPath)); // <-- Отдаем файлы по URL /media

// Test API
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'API is working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const apiBasePath = process.env.NODE_ENV === 'production' ? '' : '/api';

// routes
app.use(`${apiBasePath}/users`, userRoutes);
app.use(`${apiBasePath}/auth`, authRoutes);
app.use(`${apiBasePath}/postcards`, postcardRoutes);
app.use(`${apiBasePath}/likes`, likeRoutes);
app.use(`${apiBasePath}/albums`, albumRoutes);
app.use(`${apiBasePath}/upload`, imageRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
