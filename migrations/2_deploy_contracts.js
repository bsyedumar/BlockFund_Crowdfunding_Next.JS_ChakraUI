const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");

module.exports = async function (deployer) {
   // Deploy Campaign contract
   await deployer.deploy(Campaign);
   const campaign = await Campaign.deployed();

     // Deploy CampaignFactory contract and link to Campaign contract
  await deployer.deploy(CampaignFactory, campaign.address);
  const campaignFactory = await CampaignFactory.deployed();


  // Set your desired initial Campaign parameters
  const minimum = 100;
  const name = "Initial Campaign";
  const description = "This is the first campaign created during deployment";
  const image = "https://example.com/initial-campaign-image.jpg";
  const target = 10000;

  // Create an initial Campaign using CampaignFactory
  await campaignFactory.createCampaign(minimum, name, description, image, target);

  // Retrieve the deployed Campaign's address
  const deployedCampaigns = await campaignFactory.getDeployedCampaigns();
  const initialCampaignAddress = deployedCampaigns[0];

  // Log the initial Campaign address
  console.log("Initial Campaign deployed at:", initialCampaignAddress);
};
