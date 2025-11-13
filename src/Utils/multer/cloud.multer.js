import multer from "multer";

export const cloudFileUpload = ({ validation = [] }) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid File Type Error"), false);
    }
  };
  return multer({ fileFilter, storage });
};
