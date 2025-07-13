const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

// Определяем путь для загрузки изображений.
// Важно: он должен быть относительно корневой директории вашего основного API-проекта
// или быть абсолютным путем, доступным на сервере.
// Для Docker контейнера '/var/www/fileUpload/uploaded_files/media' может быть корректным,
// если это путь внутри контейнера, куда монтируется том.
// Для локальной разработки лучше использовать относительный путь.
let imageUploadPath;

if (process.env.NODE_ENV === 'production') {
  // Путь для продакшена (внутри Docker контейнера, который будет смонтирован к тому)
  imageUploadPath = '/var/www/fileUpload/uploaded_files/media';
} else {
  // Путь для локальной разработки (папка 'uploads' в корневой директории API)
  imageUploadPath = path.join(__dirname, '..', 'uploads');
}

// Убедимся, что директория для загрузки существует
// Это должно быть сделано только один раз при старте приложения
// if (!fs.existsSync(imageUploadPath)) {
//   try {
//     fs.mkdirSync(imageUploadPath, { recursive: true });
//     console.log(`Директория для загрузки создана: ${imageUploadPath}`);
//   } catch (err) {
//     console.error(`Ошибка при создании директории ${imageUploadPath}:`, err);
//     // Возможно, здесь стоит выйти из приложения или бросить ошибку,
//     // так как без этой директории загрузка файлов невозможна.
//     process.exit(1); // Выход из процесса
//   }
// }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    // Рекомендуется добавить уникальный префикс (например, timestamp)
    // чтобы избежать перезаписи файлов с одинаковыми именами
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Маршрут для загрузки изображения
router.post('/image-upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не был загружен.' });
  }

  const fileName = req.file.filename;
  const filePath = path.join(imageUploadPath, fileName); // Используем path.join для корректных путей

  try {
    // sizeOf.default(fileBuffer) - если image-size импортируется как commonJS module,
    // то sizeOf(fileBuffer) будет достаточно.
    // Если у вас TypeScript или ES Modules, то sizeOf.default может быть нужен.
    // В чистом Node.js CommonJS:
    const dimensions = sizeOf.default(fs.readFileSync(filePath));

    // URL для доступа к изображению через статический сервер Express
    // Предполагаем, что вы настроите Express для отдачи файлов из imageUploadPath по пути '/media'
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const imageUrl = `${baseUrl}/media/${fileName}`;

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

// Маршрут для удаления изображения
router.delete('/image-delete', (req, res) => {
  const fileName = req.body.fileName;
  if (!fileName) {
    return res
      .status(400)
      .json({ message: 'Имя файла не указано для удаления.' });
  }

  const filePath = path.join(imageUploadPath, fileName); // Используем path.join

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
