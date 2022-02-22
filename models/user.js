const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  contact: {
    type: String,
    trim: true,
    require: true
  },
  profilePic: {
    type: String,
    default:
      'https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-male-user-icon.png'
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date
  },
  deviceId: {
    type: String,
    required: true
  },
  pushNotificationId: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  resetLink: {
    type: String,
    default: ''
  }
})

const User = mongoose.model('users', userSchema)
module.exports = User
