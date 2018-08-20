// use mongoose to interact with mongodb
let mongoose = require("mongoose");

const db = {
  localhost: "mongodb://localhost:27017/TodoApp",
  mlab: `mongodb://${process.env.dbUser}:${process.env.dbPassw}@ds225492.mlab.com:25492/udemy-node-course`
};

const mongoUrl = db.localhost || db.mlab;
mongoose.Promise = global.Promise;  // mongoose supports promises
mongoose.connect(mongoUrl, { useNewUrlParser: true });


module.exports.mongoose = mongoose;
