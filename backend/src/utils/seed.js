require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Supplier = require("../models/Supplier");
const Medicine = require("../models/Medicine");

const connectDB = require("../config/db");

const seed = async () => {
  await connectDB();

  console.log("🌱 Seeding database...");

  // Clear existing
  await User.deleteMany();
  await Supplier.deleteMany();
  await Medicine.deleteMany();

  // Users
  const users = await User.create([
    { name: "Admin User", email: "admin@dawa.com", password: "Admin@123", role: "admin" },
    { name: "Staff User", email: "staff@dawa.com", password: "Staff@123", role: "staff" },
  ]);
  console.log("✅ Users created");

  // Suppliers
  const suppliers = await Supplier.create([
    { name: "Sun Pharma", contact: "+91 98765 43210", email: "orders@sunpharma.com", address: "Mumbai, Maharashtra", createdBy: users[0]._id },
    { name: "Cipla Ltd", contact: "+91 87654 32109", email: "supply@cipla.com", address: "Pune, Maharashtra", createdBy: users[0]._id },
    { name: "Dr. Reddy's", contact: "+91 76543 21098", email: "orders@drreddys.com", address: "Hyderabad, Telangana", createdBy: users[0]._id },
    { name: "Zydus Cadila", contact: "+91 65432 10987", email: "supply@zydus.com", address: "Ahmedabad, Gujarat", createdBy: users[0]._id },
  ]);
  console.log("✅ Suppliers created");

  // Medicines
  await Medicine.create([
    { name: "Paracetamol 500mg", category: "Analgesic", stock: 240, minStock: 50, unit: "Tablets", expiryDate: new Date("2026-08-15"), supplier: suppliers[0]._id, price: 2.5, batchNo: "SP2024A", createdBy: users[0]._id },
    { name: "Amoxicillin 250mg", category: "Antibiotic", stock: 18, minStock: 30, unit: "Capsules", expiryDate: new Date("2025-12-01"), supplier: suppliers[1]._id, price: 8.0, batchNo: "CL2024B", createdBy: users[0]._id },
    { name: "Metformin 500mg", category: "Antidiabetic", stock: 5, minStock: 40, unit: "Tablets", expiryDate: new Date("2026-03-20"), supplier: suppliers[2]._id, price: 5.5, batchNo: "DR2024C", createdBy: users[0]._id },
    { name: "Atorvastatin 10mg", category: "Cardiac", stock: 120, minStock: 30, unit: "Tablets", expiryDate: new Date("2025-06-10"), supplier: suppliers[3]._id, price: 12.0, batchNo: "ZC2024D", createdBy: users[0]._id },
    { name: "Cetirizine 10mg", category: "Antihistamine", stock: 90, minStock: 25, unit: "Tablets", expiryDate: new Date("2027-01-30"), supplier: suppliers[0]._id, price: 3.0, batchNo: "SP2024E", createdBy: users[0]._id },
    { name: "Omeprazole 20mg", category: "Antacid", stock: 0, minStock: 20, unit: "Capsules", expiryDate: new Date("2026-05-10"), supplier: suppliers[1]._id, price: 6.5, batchNo: "CL2024F", createdBy: users[0]._id },
    { name: "Vitamin D3 1000IU", category: "Vitamin", stock: 200, minStock: 30, unit: "Tablets", expiryDate: new Date("2027-03-15"), supplier: suppliers[2]._id, price: 4.0, batchNo: "DR2024G", createdBy: users[0]._id },
  ]);
  console.log("✅ Medicines created");

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────");
  console.log("  Admin → admin@dawa.com / Admin@123");
  console.log("  Staff → staff@dawa.com / Staff@123");
  console.log("─────────────────────────────\n");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});