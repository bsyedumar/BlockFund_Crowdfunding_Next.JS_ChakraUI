const Web3 = require("web3");
import campaign from "../artifacts/contracts/Campaigns.sol/Campaign.json";

const Campaign = (address) => {
  const provider = new Web3.providers.HttpProvider("http://localhost:8545");
  const web3 = new Web3(provider);

  if (!web3.utils.isAddress(address)) {
    console.error("Invalid address:", address);
    return null;
  }
  return new web3.eth.Contract(campaign.abi, address);
};

export default Campaign;
