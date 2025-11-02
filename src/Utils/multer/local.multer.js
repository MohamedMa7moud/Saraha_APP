import multer from "multer";
import path from "node:path";
export const localFileUpload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve("./src/uploads"));
    },

    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;
      cb(null, uniqueSuffix);
    },
  });
  return multer({ storage });
};
