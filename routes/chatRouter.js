const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { verifyJWT } = require("../middleware/auth");

router.post("/", verifyJWT, chatController.accesChat);
router.get("/", verifyJWT, chatController.fetchChats);

module.exports = router;
