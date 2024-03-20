const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/register", userController.post_register);

router.post("/login", userController.post_login);

module.exports = router;
