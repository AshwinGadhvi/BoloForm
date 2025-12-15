import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // ← ADD THIS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟢 DEBUG: Show where we're saving files
const uploadDir = path.join(__dirname, "../uploads/original");
console.log("📁 Multer upload directory:", uploadDir);
console.log("📁 Directory exists?", fs.existsSync(uploadDir));

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("💾 Saving file to:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueName + path.extname(file.originalname);
    console.log("📄 Generated filename:", filename);
    cb(null, filename);
  },
});

const uploadPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files allowed"));
    } else {
      cb(null, true);
    }
  },
});

export default uploadPdf;