import { ethers, JsonRpcProvider } from "ethers";
import CampaignFactory from "../artifacts/contracts/Campaigns.sol/CampaignFactory.json";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const factory = new ethers.Contract(factoryAddress, CampaignFactory.abi, provider);

export default factory;
