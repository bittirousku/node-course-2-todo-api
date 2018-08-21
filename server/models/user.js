const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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

// methods are instance methods
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
  // console.log("Trying to push access token to user object");
  // user.tokens.push({access, token});  // this works although it shouldn't?
  user.tokens = user.tokens.concat({access, token});  // This supposedly works better

  return user.save().then(() => {
    return token;
  });
};

// statics are model methods
UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, "secret");
  } catch (err) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // }
    // simpler way:
    return Promise.reject();
  }

  return User.findOne({
    "_id": decoded._id,
    "tokens.token": token,  // quotes are required when there is a dot in value
    "tokens.access": "auth"
  });
};

// Create mongoose middleware function to hash passwords
// have to use function syntax because we need "this" binding
// also have to pass "next"
UserSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {  // only hash the pw if it's not already hashed
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hashedPassword) => {
        user.password = hashedPassword;
        next();  // this has to be called in both if and else blocks!!!!
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model("User", UserSchema);

module.exports.User = User;
