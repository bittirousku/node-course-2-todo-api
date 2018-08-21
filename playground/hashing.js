const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// test hashing with crypto-js
// let message = "I am user naumber 4";
//
// let hashedMessage = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`hashedMessage: ${hashedMessage}`);
//
// let data = {
//   id: 4
// };
//
// let token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + "secret").toString()
// };
//
//
// let resultHash = SHA256(JSON.stringify(token.data) + "secret").toString();
//
// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("Data was changed. Don't trust!");
// }

// do the same with jwt library
// let data = {
//   id: 10
// };
//
// let token = jwt.sign(data, "secret");
// console.log("token:", token);
//
// let decoded = jwt.verify(token, "secret");
// console.log("decoded:", decoded);

// Test bcrypt salting:
let password = "123abc?";

// bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     console.log("hash:", hash);
//   });
// });

var hashedPassword = "$2a$10$TX7qk8aZkgAWu4V/X3DUb.6H.AVEsmnfcTkeCidcxrwhknI.o.dZm";

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
});
