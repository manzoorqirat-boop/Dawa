const router = require("express").Router();
const {
  getMedicines, getMedicine, createMedicine,
  updateMedicine, deleteMedicine, updateStock,
} = require("../controllers/medicine.controller");
const { protect, authorize } = require("../middleware/auth");

router.use(protect); // all medicine routes require login

router.route("/")
  .get(getMedicines)                           // admin + staff
  .post(createMedicine);                       // admin + staff

router.route("/:id")
  .get(getMedicine)                            // admin + staff
  .put(updateMedicine)                         // admin + staff
  .delete(authorize("admin"), deleteMedicine); // admin only

router.put("/:id/stock", updateStock);         // admin + staff

module.exports = router;