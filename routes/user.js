const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.get_users);
router.get("/:id", userController.get_user);
router.post("/register", userController.post_register);
router.post("/login", userController.post_login);
router.post("/forgot-password", userController.post_forgot_password);
router.put("/reset-password/:token", userController.put_reset_password);

module.exports = router;
