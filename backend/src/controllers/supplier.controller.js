const Supplier = require("../models/Supplier");
const Medicine = require("../models/Medicine");

// @GET /api/suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    // Attach medicine count per supplier
    const withCounts = await Promise.all(
      suppliers.map(async (s) => {
        const count = await Medicine.countDocuments({ supplier: s._id });
        return { ...s.toJSON(), medicineCount: count };
      })
    );
    res.json({ success: true, count: withCounts.length, data: withCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/suppliers/:id
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found." });
    const medicines = await Medicine.find({ supplier: supplier._id }).select("name stock expiryDate");
    res.json({ success: true, data: { ...supplier.toJSON(), medicines } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/suppliers  (admin only)
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: "Supplier name already exists." });
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/suppliers/:id  (admin only)
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found." });
    res.json({ success: true, data: supplier });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: "Supplier name already exists." });
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/suppliers/:id  (admin only)
exports.deleteSupplier = async (req, res) => {
  try {
    const medicineCount = await Medicine.countDocuments({ supplier: req.params.id });
    if (medicineCount > 0)
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${medicineCount} medicine(s) are linked to this supplier.`,
      });

    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found." });
    res.json({ success: true, message: "Supplier deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};