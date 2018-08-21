const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

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

let data = {
  id: 10
};

let token = jwt.sign(data, "secret");
console.log("token:", token);

let decoded = jwt.verify(token, "secret");
console.log("decoded:", decoded);
