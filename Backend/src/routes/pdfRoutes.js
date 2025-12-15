import express from "express";
import protect from "../middleware/authMiddleware.js";
import uploadPdf from "../middleware/uploadPdf.js";

import {
  uploadPdf as uploadPdfController,
  getUserPdfs,
  getPdfById,
  savePdfElements,
  downloadPdf,
  deletePdf
} from "../controllers/pdfController.js";

const router = express.Router();

// Upload PDF
router.post(
  "/upload",
  protect,
  uploadPdf.single("pdf"),
  uploadPdfController
);

// Get all PDFs
router.get("/", protect, getUserPdfs);

// Get single PDF
router.get("/:id", protect, getPdfById);

// Save editor state
router.post("/:id/save", protect, savePdfElements);

// Download signed PDF
router.get("/:id/download", protect, downloadPdf);

//Delete PDf
router.delete('/:id', protect, deletePdf);
export default router;
