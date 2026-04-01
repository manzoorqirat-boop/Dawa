const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const medicineRoutes = require("./routes/medicine.routes");
const supplierRoutes = require("./routes/supplier.routes");
const userRoutes = require("./routes/user.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests, please try again later." },
});

app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());
app.use("/api", limiter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve frontend
const distPath = path.join(__dirname, "../../../frontend/dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏥 Dawa API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});