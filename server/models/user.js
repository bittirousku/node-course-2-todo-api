const mongoose = require("mongoose");
const validator = require("validator");

let User = mongoose.model("User", {
  email: {
    minlength: 1,
    required: true,
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      }
    },
    message: "{VALUE} is not a valid email"
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }]
});

module.exports.User = User;
