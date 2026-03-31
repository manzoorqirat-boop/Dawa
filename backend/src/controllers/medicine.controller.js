const Medicine = require("../models/Medicine");

// @GET /api/medicines
exports.getMedicines = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { batchNo: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") filter.category = category;

    let medicines = await Medicine.find(filter)
      .populate("supplier", "name contact email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean({ virtuals: true });

    // Filter by stock/expiry status after populating virtuals
    if (status === "low") medicines = medicines.filter(m => m.stockStatus === "low");
    if (status === "out") medicines = medicines.filter(m => m.stockStatus === "out");
    if (status === "expiring") medicines = medicines.filter(m => m.daysToExpiry >= 0 && m.daysToExpiry <= 90);
    if (status === "expired") medicines = medicines.filter(m => m.daysToExpiry < 0);

    const total = await Medicine.countDocuments(filter);
    res.json({ success: true, count: medicines.length, total, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/medicines/:id
exports.getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate("supplier", "name contact email address");
    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found." });
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/medicines  (admin + staff)
exports.createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({ ...req.body, createdBy: req.user._id });
    await medicine.populate("supplier", "name contact email");
    res.status(201).json({ success: true, data: medicine });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/medicines/:id  (admin + staff)
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("supplier", "name contact email");
    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found." });
    res.json({ success: true, data: medicine });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/medicines/:id  (admin only)
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found." });
    res.json({ success: true, message: "Medicine deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/medicines/:id/stock  (admin + staff — quick stock update)
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || stock < 0)
      return res.status(400).json({ success: false, message: "Valid stock value required." });

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    ).populate("supplier", "name");

    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found." });
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};