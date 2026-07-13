const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  signDocument,
} = require("../controllers/documentController");

router.post("/upload", protect, upload.single("file"), uploadDocument);
router.get("/", protect, getMyDocuments);
router.get("/:id", protect, getDocumentById);
router.patch("/:id/sign", protect, signDocument);

module.exports = router;
