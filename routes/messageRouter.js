const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { verifyJWT } = require("../middleware/auth");

router.post("/", verifyJWT, messageController.sendMessage);
router.get("/:chatId", verifyJWT, messageController.allMessages);

module.exports = router;
