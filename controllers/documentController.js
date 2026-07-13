const Document = require("../models/Document");

// UPLOAD a new document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const document = await Document.create({
      uploadedBy: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    res
      .status(201)
      .json({ message: "Document uploaded successfully", document });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET all documents uploaded by logged-in user
const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET single document by id
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "uploadedBy",
      "name email",
    );
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ document });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADD e-signature to a document
const signDocument = async (req, res) => {
  try {
    const { signatureImage } = req.body; // base64 image string from frontend

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.signature = {
      signedBy: req.user.id,
      signatureImage,
      signedAt: new Date(),
    };
    document.status = "signed";

    await document.save();

    res.status(200).json({ message: "Document signed successfully", document });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  signDocument,
};
