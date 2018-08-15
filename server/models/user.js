let mongoose = require("mongoose");

let User = mongoose.model("User", {
  email: {
    minlength: 1,
    required: true,
    type: String,
    trim: true
  }
});

module.exports.User = User;
