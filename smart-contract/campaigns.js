import { ethers, JsonRpcProvider } from "ethers";
import Campaign from "../artifacts/contracts/Campaigns.sol/Campaign.json";
import CampaignFactory from "../artifacts/contracts/Campaigns.sol/CampaignFactory.json";

const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

export async function getOpenCampaigns(_networkId) {
  try {
    const factoryInstance = new ethers.Contract(factoryAddress, CampaignFactory.abi, provider);
    const campaignAddresses = await factoryInstance.getDeployedCampaigns();

    const campaigns = await Promise.all(
      campaignAddresses.map(async (address) => {
        const campaignContract = new ethers.Contract(address, Campaign.abi, provider);
        const summary = await campaignContract.getSummary();

        // Convert non-serializable values to strings
        const serializableSummary = {
          ...summary,
          "0": summary["0"].toString(),
          "1": summary["1"].toString(),
          "2": summary["2"].toString(),
          "3": summary["3"].toString(),
          "6": summary["6"].toString(),
          "8": summary["8"].toString(),
          "9": summary["9"],
          address,
        };

        return serializableSummary;
      })
    );

    console.log('campaigns:', campaigns);

    return campaigns; // Add this line
  } catch (error) {
    console.error("Error getting open campaigns: ", error);
    return [];
  }
}

export async function filterOpenCampaigns(campaigns) {
  const openCampaigns = campaigns.filter(
    (campaign) => campaign[4] && campaign[5] && campaign[8] > 0
  );
  return openCampaigns;
}

export async function createCampaign(
  targetToAchieve,
  name,
  description,
  imageURL,
  minimumContribution,
  signer
) {
  try {
    const factoryInstance = new ethers.Contract(factoryAddress, CampaignFactory.abi, signer);

    // Add an await keyword here to ensure the transaction is completed before moving on
    const newCampaign = await factoryInstance.createCampaign(minimumContribution, name, description, imageURL, targetToAchieve);

    // Log the transaction hash for debugging purposes
    console.log("Transaction hash:", newCampaign.hash);

    // Wait for the transaction to be mined
    await newCampaign.wait();

    // Get the updated list of deployed campaigns
    const deployedCampaigns = await factoryInstance.getDeployedCampaigns();
    console.log("Deployed campaigns:", deployedCampaigns);

    return newCampaign;
  } catch (error) {
    console.error("Error creating campaign: ", error);
    return null;
  }
}
