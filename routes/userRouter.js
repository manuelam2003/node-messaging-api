const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyJWT } = require("../middleware/auth");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/logout", verifyJWT, userController.logoutUser);

router.get("/all", verifyJWT, userController.allUsers);

router.get("/", verifyJWT, userController.currUser);

module.exports = router;
