const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfileSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: String,
  location: String,
  phone: String,
  avatarUrl: String,
  about: String,
  skills: [String],
  experience: [
    {
      title: String,
      company: String,
      years: String,
      type: String,
    },
  ],
});

module.exports = mongoose.model('Profile', ProfileSchema);
