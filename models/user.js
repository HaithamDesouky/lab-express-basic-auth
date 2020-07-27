const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    unique: true
  },
  email: {
    type: String,
    require: true,
    minlength: 5
  },
  passwordHashAndSalt: {
    type: String,
    require: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
