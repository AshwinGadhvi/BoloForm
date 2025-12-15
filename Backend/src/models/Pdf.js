import mongoose from "mongoose";

/* ---------------- ELEMENT SUB-SCHEMA ---------------- */
const ElementSchema = new mongoose.Schema({
  id: Number,
  page: Number,
  type: {
    type: String, // text | date | signature | checkbox | image
    required: true,
  },

  xPercent: Number,
  yPercent: Number,
  widthPercent: Number,
  heightPercent: Number,

  value: String,     // text / date value
  color: String,     // text color
  image: String,     // base64 (signature / image)
  checked: Boolean,  // checkbox
});

/* ---------------- PDF SCHEMA ---------------- */
const pdfSchema = new mongoose.Schema(
  {
    title: String,

    filePath: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐ NEW FIELD (IMPORTANT)
    elements: {
      type: [ElementSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pdf", pdfSchema);
