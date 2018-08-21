const {User} = require("../models/user.js");

// middleware to make routes private:
let authenticate = (request, response, next) => {
  let token = request.header("x-auth");

  User.findByToken(token).then((user) => {
    if (!user) {
      // reject will automatically exit the then block
      // which will be caught in the following catch and 401 is sent.
      return Promise.reject();
    }

    request.user = user;
    request.token = token;
    next(); // have to call next so the code execution continues after this middleware
  }).catch((err) => {
    response.status(401).send();
  });
};


module.exports = {authenticate};
