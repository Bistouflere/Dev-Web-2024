import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import slugify from "slugify";

const generateUniqueFilename = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const slug = slugify(`${timestamp}-${randomString}`, { lower: true });
  return slug;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/webp",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const processImage = async (file: Express.Multer.File) => {
  const fileName = generateUniqueFilename();

  await sharp(file.path)
    .resize(500)
    .webp({ quality: 80 })
    .toFile(path.resolve(file.destination, `${fileName}.webp`));

  // Delete original file
  fs.unlinkSync(file.path);

  return fileName;
};
