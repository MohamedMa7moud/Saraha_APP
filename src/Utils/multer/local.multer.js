import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import path from "node:path";
import fs from "node:fs";

export const allowedType = {
  images: ["image/png", "image/jpeg", "image/jpg"],
  videos: ["video/mp4", "video/mov", "video/mpeg"],
  audios: ["audio/mp3"],
  document: ["application/msword", "application/pdf"],
};


export const localFileUpload = ({
  customPath = "general",
  validation = [],
}) => {
  const basePath = `uploads/${customPath}`;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userBasePath = basePath;
      if (req.user?._id) userBasePath += `/${req.user._id}`;
      const fullPath = path.resolve(`./src/${userBasePath}`);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath);
    },

    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;
      file.finalPath = `${basePath}/${req.user._id}/${uniqueSuffix}`;
      cb(null, uniqueSuffix);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid File Type Error"), false);
    }
  };
  return multer({ fileFilter, storage });
};


export const fileValidation = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const type = await fileTypeFromBuffer(buffer);
    const allowedTypes = allowedType.images;
    if (!type || !allowedTypes.includes(type.mime))
      return next(new Error("Invalid file type"));

    return next();
  } catch (error) {
    return next(new Error("Something Went Wrong !!"));
  }
};