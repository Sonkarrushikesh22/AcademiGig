const Chat = require('../models/Chat');
const User = require('../models/User');

const sendMessage = async (req, res) => {};
const getMessages = async (req, res) => {};
const getUserChats = async (req, res) => {};

exports.getMessagesByThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const messages = await Chat.find({ threadId })
      .populate({ path: 'senderId', select: 'name', model: this.senderType })
      .populate({ path: 'receiverId', select: 'name', model: this.receiverType })
      .sort({ sentAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
