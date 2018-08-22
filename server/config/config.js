let env = process.env.NODE_ENV || "development";  // this is set to "production" in Heroku!
let config;
console.log(`Starting ${env} environment`);

if (env === "development" || env === "test") {
  config = require("./config.json");  // NOTE: this JSON should not be commited in real applications
  let envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
// MONGODB_URI and JWT_SECRET should be set manually in Heroku
// heroku config:set SOME_VARIABLE=Somevalue
