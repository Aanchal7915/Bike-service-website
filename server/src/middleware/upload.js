const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key';

// Local storage fallback setup
const getLocalStorage = (folder) => {
  const uploadPath = path.join(__dirname, '../../uploads', folder);
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
  
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });
};

// Bike image/video storage
const bikeStorage = isCloudinaryConfigured 
  ? new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
          folder: 'bikeservice/bikes',
          resource_type: isVideo ? 'video' : 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'],
        };
      },
    })
  : getLocalStorage('bikes');

// Avatar storage
const avatarStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'bikeservice/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
    })
  : getLocalStorage('avatars');

// Parts storage — auto resource_type handles both images and video
const partsStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: async (_req, file) => ({
        folder: 'bikeservice/parts',
        resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm'],
      }),
    })
  : getLocalStorage('parts');

const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
  cb(null, allowedMime.includes(file.mimetype));
};

const partMulter = multer({ storage: partsStorage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

exports.uploadBikeMedia = multer({ storage: bikeStorage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });
exports.uploadAvatar = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
// Handles both images[] (up to 5) and video (1) in one multipart request
// Handles both images[] (up to 5) and video (1) in one multipart request
exports.uploadPartMedia = partMulter.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]);

// Added for category/brand images
exports.uploadCategoryMedia = multer({ 
  storage: isCloudinaryConfigured 
    ? new CloudinaryStorage({ cloudinary, params: { folder: 'bikeservice/categories', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] } }) 
    : getLocalStorage('categories'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

