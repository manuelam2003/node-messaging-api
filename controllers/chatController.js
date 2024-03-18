const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/user");

exports.accesChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ msg: "UserId is required" });

  let isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "fullName username email avatar",
  });

  if (isChat.length > 0) return res.status(200).json(isChat[0]);
  else {
    const chatData = {
      chatName: "sender",
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).json(fullChat);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password -updatedAt -createdAt -__v")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "fullName username email avatar",
        });

        res.status(200).json(results);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
