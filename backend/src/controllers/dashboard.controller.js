const Medicine = require("../models/Medicine");
const Supplier = require("../models/Supplier");

// @GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const in90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      totalMedicines,
      totalSuppliers,
      outOfStock,
      lowStock,
      expiringSoon,
      expired,
      expiring30,
    ] = await Promise.all([
      Medicine.countDocuments(),
      Supplier.countDocuments(),
      Medicine.countDocuments({ stock: 0 }),
      Medicine.countDocuments({ $expr: { $and: [{ $gt: ["$stock", 0] }, { $lt: ["$stock", "$minStock"] }] } }),
      Medicine.countDocuments({ expiryDate: { $gte: today, $lte: in90Days } }),
      Medicine.countDocuments({ expiryDate: { $lt: today } }),
      Medicine.countDocuments({ expiryDate: { $gte: today, $lte: in30Days } }),
    ]);

    // Alerts: out of stock + low stock + expiring in 30 days + expired
    const [outMeds, lowMeds, expiringMeds, expiredMeds] = await Promise.all([
      Medicine.find({ stock: 0 }).select("name unit").limit(20),
      Medicine.find({ $expr: { $and: [{ $gt: ["$stock", 0] }, { $lt: ["$stock", "$minStock"] }] } })
        .select("name stock unit minStock").limit(20),
      Medicine.find({ expiryDate: { $gte: today, $lte: in30Days } })
        .select("name expiryDate").limit(20),
      Medicine.find({ expiryDate: { $lt: today } })
        .select("name expiryDate").limit(20),
    ]);

    const alerts = [
      ...outMeds.map(m => ({ type: "out", icon: "🚫", message: `${m.name} is out of stock`, medicineId: m._id })),
      ...lowMeds.map(m => ({ type: "low", icon: "⚠️", message: `${m.name} — only ${m.stock} ${m.unit} left`, medicineId: m._id })),
      ...expiredMeds.map(m => ({ type: "expired", icon: "💊", message: `${m.name} has expired`, medicineId: m._id })),
      ...expiringMeds.map(m => {
        const days = Math.ceil((new Date(m.expiryDate) - today) / (1000 * 60 * 60 * 24));
        return { type: "expiring", icon: "⏳", message: `${m.name} expires in ${days} days`, medicineId: m._id };
      }),
    ];

    res.json({
      success: true,
      data: {
        stats: { totalMedicines, totalSuppliers, outOfStock, lowStock, expiringSoon, expired },
        alerts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};