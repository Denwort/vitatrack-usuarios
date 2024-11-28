const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();  // Cargar las variables de entorno

// Configuración del cliente de S3
const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

// Configuración de Multer para cargar archivos a S3

const uploadImage = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'vitatrack',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const userId = req.userId;
        const extension = file.originalname.split('.').pop();
        const fileName = `${userId}.${extension}`;
        cb(null, `profile/${fileName}`);
      },
    }),
  });
  
module.exports = uploadImage;