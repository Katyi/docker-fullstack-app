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
      'http://frontend:3000',
      'http://212.113.120.58:3001',
      'http://postcardfolio.ru',
    ],
    credentials: true,
  })
); // Allow CORS from your frontend

// --------------------------------------------------------------------
// НОВОЕ: Настройка для отдачи статических файлов (изображений)
// Убедитесь, что путь соответствует imageUploadPath из routes/images.js
// и что папка 'uploads' действительно находится в корне вашего API проекта.
// Если imageUploadPath = '/var/www/fileUpload/uploaded_files/media', то здесь нужно указать его.
let staticFilesPath;
if (process.env.NODE_ENV === 'production') {
  staticFilesPath = '/var/www/fileUpload/uploaded_files/media';
} else {
  staticFilesPath = path.join(__dirname, 'uploads'); // Папка 'uploads' в корне API
}

app.use('/media', express.static(staticFilesPath)); // <-- Отдаем файлы по URL /media
// Теперь изображения будут доступны по адресу: http://yourdomain.com/media/имя_файла.jpg
// --------------------------------------------------------------------

// Test API
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'API is working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/postcards', postcardRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/upload', imageRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
