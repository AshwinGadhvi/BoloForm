import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pdf",
    required: true,
  },

  action: {
    type: String,
    enum: [
      "PDF_UPLOADED",
      "ELEMENT_SAVED",
      "PDF_DOWNLOADED",
      "PDF_SIGNED",
      "PDF_DELETED"
    ],
    required: true,
  },

  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ipAddress: String,
  userAgent: String,

  documentHash: String,   // SHA-256 of PDF / elements
  previousHash: String,   // Chain
  currentHash: String,    // Final hash

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AuditLog", auditLogSchema);
