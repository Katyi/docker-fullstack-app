const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

let imageUploadPath;

if (process.env.NODE_ENV === 'production') {
  // Путь для продакшена (внутри Docker контейнера, который будет смонтирован к тому)
  imageUploadPath = '/var/www/fileUpload/uploaded_files/media';
} else {
  // Путь для локальной разработки (папка 'uploads' в корневой директории API)
  imageUploadPath = path.join(__dirname, '..', 'uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB лимит
  }
});

// для загрузки изображения
router.post('/image-upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен.' });
  }

  const fileName = req.file.filename;
  const filePath = path.join(imageUploadPath, fileName);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const dimensions = sizeOf.default(fileBuffer);

    const imageUrl = `/media/${fileName}`;

    res.status(200).json({
      message: `Файл успешно загружен: ${fileName}`,
      width: dimensions.width,
      height: dimensions.height,
      fileName: fileName, // Возвращаем имя файла для удаления
      imageUrl: imageUrl, // Возвращаем URL для использования на фронтенде
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    res
      .status(500)
      .json({ error: error.message || 'Ошибка при обработке файла.' });
  }
});

// для удаления изображения
router.delete('/image-delete', (req, res) => {
  const fileName = req.body.fileName;
  if (!fileName) {
    return res
      .status(400)
      .json({ message: 'Имя файла не указано для удаления.' });
  }

  const filePath = path.join(imageUploadPath, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      // Проверяем, если файл не существует, это не ошибка 500
      if (err.code === 'ENOENT') {
        return res.status(404).send({ message: 'Файл не найден.' });
      }
      console.error('Ошибка при удалении файла:', err);
      return res.status(500).send({
        message: 'Не удалось удалить файл. ' + err.message,
      });
    }
    res.status(200).send({
      message: 'Файл успешно удален.',
    });
  });
});

module.exports = router;
