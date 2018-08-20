let env = process.env.NODE_ENV || "development";  // this is set to "production" in Heroku!
console.log(`Starting ${env} environment`);

if (env === "development") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === "test") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
} else {
  // credentials variables are manually set in Heroku
  process.env.MONGODB_URI = `mongodb://${process.env.dbUser}:${process.env.dbPassw}@ds225492.mlab.com:25492/udemy-node-course`;
}
