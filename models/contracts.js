const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  contractNumber: {
    type: Number,
    required: true,
    min: 0,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  object: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending", "expired"],
  },
});

module.exports = mongoose.model("Contract", contractSchema);
