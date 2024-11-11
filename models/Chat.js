// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    // This groups messages in a conversation between a specific user and employer
  },
  senderType: {
    type: String,
    enum: ['User', 'Employer'],
    required: true,
    // This field will indicate whether the sender is a user or employer
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderType', // Dynamically references either the User or Employer model
  },
  receiverType: {
    type: String,
    enum: ['User', 'Employer'],
    required: true,
    // Indicates whether the receiver is a user or employer
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverType', // Dynamically references either the User or Employer model
  },
  message: {
    type: String,
    required: true,
  },
  attachments: [
    {
      type: String, // Could be a URL or file path for attachments like images or files
    }
  ],
  isRead: {
    type: Boolean,
    default: false,
    // Indicates whether the message has been read by the receiver
  },
  sentAt: {
    type: Date,
    default: Date.now,
    // Timestamp for when the message was sent
  }
});

// Method to retrieve messages by thread, optionally populating sender and receiver data
chatSchema.statics.getMessagesByThread = async function(threadId) {
  return this.find({ threadId })
    .populate({ path: 'senderId', select: 'name', model: this.senderType })
    .populate({ path: 'receiverId', select: 'name', model: this.receiverType })
    .sort({ sentAt: 1 });
};

module.exports = mongoose.model('Chat', chatSchema);
