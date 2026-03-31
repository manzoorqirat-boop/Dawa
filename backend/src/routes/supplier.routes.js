const router = require("express").Router();
const {
  getSuppliers, getSupplier, createSupplier,
  updateSupplier, deleteSupplier,
} = require("../controllers/supplier.controller");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.route("/")
  .get(getSuppliers)                                  // admin + staff
  .post(authorize("admin"), createSupplier);          // admin only

router.route("/:id")
  .get(getSupplier)                                   // admin + staff
  .put(authorize("admin"), updateSupplier)            // admin only
  .delete(authorize("admin"), deleteSupplier);        // admin only

module.exports = router;