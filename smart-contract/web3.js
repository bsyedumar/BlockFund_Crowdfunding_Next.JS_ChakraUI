const Web3 = require("web3");

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // we are in the browser and MetaMask is installed
  web3 = new Web3(window.ethereum);
} else {
  // we are on the server *OR* MetaMask is not running
  // creating our own provider
  const provider = new Web3.providers.HttpProvider(
    "http://127.0.0.1:8545"
  );

  web3 = new Web3(provider);
}

export default web3;
