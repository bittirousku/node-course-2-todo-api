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

// "methods" are instance methods
// Override method toJSON to limit what gets back to user
UserSchema.methods.toJSON = function () {
  let user = this;
  // convert mongoose object to javascrip object
  // because mongoose objects are immutable:
  let userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

// Arrow functions don't bind "this" keyword, we have to use
// regular function here:
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = "auth";
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access: access
  }, process.env.JWT_SECRET).toString();
  // console.log("Trying to push access token to user object");
  // user.tokens.push({access, token});  // this works although it shouldn't?
  user.tokens = user.tokens.concat({access, token});  // This supposedly works better

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (tokenToDelete) {
  let user = this;
  // update the user document by pulling (removing) the matching token
  // from the token array:
  return user.updateOne({
    $pull: {
      tokens: {
        token: tokenToDelete
      }
    }
  });
};


// "statics" are model methods
UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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


/**
 * Find a user in the database by email
 * and check the the password hash matches the
 * given password.
 * @param  {String} email     [description]
 * @param  {String} password  [description]
 * @return {Promise}          [description]
 */
UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      let givenPassword = password;
      let knownHash = user.password;
      bcrypt.compare(givenPassword, knownHash, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
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
