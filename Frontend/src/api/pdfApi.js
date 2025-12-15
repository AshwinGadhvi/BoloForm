import api from "./axios";

/* =========================
   PDF APIs
========================= */

// 📤 Upload PDF
export const uploadPdf = (formData) =>
  api.post("/pdf/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 📄 Get all PDFs of logged-in user
export const getUserPdfs = () =>
  api.get("/pdf");

// 📄 Get single PDF by ID (for editor)
export const getPdfById = (id) =>
  api.get(`/pdf/${id}`);

// 💾 SAVE PDF ELEMENTS (EDITOR STATE)
export const savePdfElements = (pdfId, elements) =>
  api.post(`/pdf/${pdfId}/save`, {
    elements,
  });

export const downloadPdf = (pdfId) =>
  api.get(`/pdf/${pdfId}/download`, {
    responseType: "blob",
  });

// Add this function to your pdfApi.js
export const deletePdf = (pdfId) =>
  api.delete(`/pdf/${pdfId}`);