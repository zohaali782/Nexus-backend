const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["draft", "pending_signature", "signed", "finalized"],
      default: "draft",
    },
    signature: {
      signedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      signatureImage: { type: String }, // stored as base64 or file path
      signedAt: { type: Date },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);
