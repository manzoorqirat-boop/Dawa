const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Analgesic", "Antibiotic", "Antidiabetic", "Cardiac", "Antihistamine", "Antacid", "Vitamin", "Antifungal", "Other"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    minStock: {
      type: Number,
      default: 10,
      min: [0, "Minimum stock cannot be negative"],
    },
    unit: {
      type: String,
      default: "Tablets",
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "Supplier is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    batchNo: {
      type: String,
      required: [true, "Batch number is required"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Virtual: days to expiry
medicineSchema.virtual("daysToExpiry").get(function () {
  const today = new Date();
  return Math.ceil((this.expiryDate - today) / (1000 * 60 * 60 * 24));
});

// Virtual: stock status
medicineSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "out";
  if (this.stock < this.minStock) return "low";
  return "ok";
});

medicineSchema.set("toJSON", { virtuals: true });
medicineSchema.set("toObject", { virtuals: true });

// Text index for search
medicineSchema.index({ name: "text", batchNo: "text" });

module.exports = mongoose.model("Medicine", medicineSchema);