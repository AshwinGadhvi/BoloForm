import Pdf from "../models/Pdf.js";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import { fileURLToPath } from "url";
import { logAudit } from "../utils/auditLogger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* --------------------------------------------------
   UPLOAD PDF
-------------------------------------------------- */
export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const pdf = await Pdf.create({
      title: req.file.originalname,
      filePath: `/uploads/original/${req.file.filename}`,
      uploadedBy: req.user._id,
      elements: [],
    });

    res.status(201).json(pdf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------------
   GET ALL USER PDFs
-------------------------------------------------- */
export const getUserPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------------
   GET PDF BY ID
-------------------------------------------------- */
export const getPdfById = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }
    res.json(pdf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------------
   SAVE ELEMENTS
-------------------------------------------------- */
export const savePdfElements = async (req, res) => {
  try {
    const { elements } = req.body;

    if (!Array.isArray(elements)) {
      return res.status(400).json({ message: "Elements must be an array" });
    }

    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    await logAudit({
  pdfId: pdf._id,
  action: "ELEMENT_SAVED",
  actor: req.user._id,
  ip: req.ip,
  userAgent: req.headers["user-agent"],
  payload: elements,
});

    pdf.elements = elements;
    await pdf.save();

    res.json({ message: "PDF saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------------
   DOWNLOAD / BURN SIGNED PDF  ✅ FINAL
-------------------------------------------------- */
export const downloadPdf = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const uploadDir = path.join(__dirname, "../uploads/original");
    const filename = path.basename(pdf.filePath);
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "PDF file not found on server" });
    }

    // Load PDF
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    // Burn elements
    for (const el of pdf.elements || []) {
      const page = pages[el.page - 1];
      if (!page) continue;

      const { width, height } = page.getSize();
      const x = el.xPercent * width;
      const y =
        height -
        el.yPercent * height -
        (el.heightPercent || 0.05) * height;

      if (el.type === "text" || el.type === "date") {
        const color = el.color
          ? rgb(
              parseInt(el.color.slice(1, 3), 16) / 255,
              parseInt(el.color.slice(3, 5), 16) / 255,
              parseInt(el.color.slice(5, 7), 16) / 255
            )
          : rgb(0, 0, 0);

        page.drawText(el.value || "", { x, y, size: 12, color });
      }

      if (el.type === "checkbox" && el.checked) {
        page.drawText("✔", { x, y, size: 16 });
      }

      if (el.type === "signature" || el.type === "image") {
        if (el.image?.includes(",")) {
          const base64Data = el.image.split(",")[1];
          const imageBytes = Buffer.from(base64Data, "base64");
          const image = el.image.includes("png")
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

          page.drawImage(image, {
            x,
            y,
            width: (el.widthPercent || 0.3) * width,
            height: (el.heightPercent || 0.15) * height,
          });
        }
      }
    }

    // Save signed PDF
    const signedDir = path.join(__dirname, "../uploads/signed");
    if (!fs.existsSync(signedDir)) {
      fs.mkdirSync(signedDir, { recursive: true });
    }

    const signedPath = path.join(signedDir, `${pdf._id}.pdf`);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(signedPath, pdfBytes);

    // ✅ AUDIT AFTER PDF IS CREATED
    await logAudit({
      pdfId: pdf._id,
      action: "PDF_DOWNLOADED",
      actor: req.user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      payload: pdfBytes, // ✅ NOW SAFE
    });

    res.download(signedPath, `${pdf.title}-signed.pdf`);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------------
   DELETE PDF ✅ NEW
-------------------------------------------------- */
export const deletePdf = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Check if user owns this PDF
    if (pdf.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this PDF" });
    }

    // Delete original PDF file
    if (pdf.filePath) {
      const uploadDir = path.join(__dirname, "../uploads/original");
      const filename = path.basename(pdf.filePath);
      const filePath = path.join(uploadDir, filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`✅ Deleted original file: ${filePath}`);
        } catch (fileErr) {
          console.error(`⚠️ Could not delete original file: ${filePath}`, fileErr.message);
        }
      }
    }

    // Delete signed PDF file (if exists)
    const signedDir = path.join(__dirname, "../uploads/signed");
    const signedPath = path.join(signedDir, `${pdf._id}.pdf`);

    if (fs.existsSync(signedPath)) {
      try {
        fs.unlinkSync(signedPath);
        console.log(`✅ Deleted signed file: ${signedPath}`);
      } catch (fileErr) {
        console.error(`⚠️ Could not delete signed file: ${signedPath}`, fileErr.message);
      }
    }

    // Log audit before deleting from database
    await logAudit({
      pdfId: pdf._id,
      action: "PDF_DELETED",
      actor: req.user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      payload: { title: pdf.title, filePath: pdf.filePath },
    });

    // Delete from database
    await Pdf.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "PDF deleted successfully",
      deletedId: req.params.id,
    });
  } catch (err) {
    console.error("Delete PDF error:", err);
    res.status(500).json({
      message: "Failed to delete PDF",
      error: err.message,
    });
  }
};