const router = require("express").Router();
const { login, register, getMe, changePassword } = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", protect, authorize("admin"), register); // only admin can create accounts
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);

module.exports = router;