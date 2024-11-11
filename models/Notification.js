// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientType: {
    type: String,
    enum: ['User', 'Employer'],
    required: true,
    // Indicates whether the notification is for a user or an employer
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientType', // Dynamically references either the User or Employer model
  },
  type: {
    type: String,
    enum: ['Message', 'JobApplication', 'JobPosting', 'General'],
    required: true,
    // Describes the type of notification, useful for filtering or categorizing notifications
  },
  message: {
    type: String,
    required: true,
    // The notification content
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // References related document, such as a Job or Message, based on `type`
    refPath: 'type',
  },
  isRead: {
    type: Boolean,
    default: false,
    // Marks whether the notification has been read
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Timestamp of when the notification was created
  }
});

// Static method to retrieve notifications for a specific recipient, sorted by creation time
notificationSchema.statics.getNotificationsForRecipient = async function(recipientType, recipientId) {
  return this.find({ recipientType, recipientId }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Notification', notificationSchema);
