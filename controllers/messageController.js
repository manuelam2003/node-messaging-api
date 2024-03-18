const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).json({ msg: "chatId or content is required" });
  }
  const newMessage = { sender: req.user._id, content: content, chat: chatId };
  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "fullName avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "fullName username email avatar",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

exports.allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "fullName avatar email username")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
