import multer from "multer";
import fs from "fs";

const folders = ["uploads/resumes", "uploads/documents"];
folders.forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents"); // all company docs go here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
export default upload;
