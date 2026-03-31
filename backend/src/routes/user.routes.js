const router = require("express").Router();
const {
  getUsers, createUser, updateUser, deleteUser, resetPassword,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin")); // all user routes: admin only

router.route("/").get(getUsers).post(createUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.put("/:id/reset-password", resetPassword);

module.exports = router;