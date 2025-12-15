import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getAdminStats,
  getAllUsers,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin Dashboard Stats
router.get("/stats", protect, adminOnly, getAdminStats);

// All Users
router.get("/users", protect, adminOnly, getAllUsers);

router.get(
  "/audit/:pdfId",
  protect,
  adminOnly,
  async (req, res) => {
    const logs = await AuditLog.find({ pdfId: req.params.pdfId })
      .populate("actor", "name email");

    res.json(logs);
  }
);


export default router;
