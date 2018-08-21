const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

let UserSchema = new mongoose.Schema({
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

// Override method toJSON to limit what gets back to user
UserSchema.methods.toJSON = function () {
  let user = this;
  // convert mongoose object to javascrip object
  // because mongoose objects are immutable:
  let userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

// Create some kind of method to generate a token? why?
// Arrow functions don't bind "this" keyword, we have to use
// regular function here:
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = "auth";
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access: access
  }, "secret").toString();
  console.log("Trying to push access token to user object");
  // user.tokens.push({access, token});  // this works although it shouldn't?
  user.tokens = user.tokens.concat({access, token});  // This supposedly works better

  return user.save().then(() => {
    return token;
  });
};


var User = mongoose.model("User", UserSchema);

module.exports.User = User;
