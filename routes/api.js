const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("pepe");
});

router.post("/", async (req, res, next) => {
  const user = new User({ username: "Pepe", password: "pepe" });
  const result = await user.save();
  res.status(201).json({ msg: `User ${result.username} created.` });
});

module.exports = router;
