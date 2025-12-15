import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();

// 🔹 Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== MIDDLEWARES ==================
app.use(cors({ origin: "*" }));
app.use(express.json());

// ================== STATIC FILES ==================
// Serve uploaded PDFs
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ================== ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pdf", pdfRoutes);

// ================== DEFAULT ROUTE ==================
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
