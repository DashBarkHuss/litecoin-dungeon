const litecore = require("litecore-lib");

// Generate a new private key
const privateKey = new litecore.PrivateKey();

// Generate a new address from the private key
const address = privateKey.toAddress();

console.log("New Litecoin Address:", address.toString());
console.log("Private Key (WIF):", privateKey.toWIF());
