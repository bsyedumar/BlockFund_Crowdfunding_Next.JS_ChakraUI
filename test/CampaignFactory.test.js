const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampaignFactory", function () {
  let CampaignFactory, Campaign, campaignFactory, campaign, manager, contributor;

  beforeEach(async () => {
    // Deploy the CampaignFactory contract
    CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    campaignFactory = await CampaignFactory.deploy();
    await campaignFactory.deployed();

    // Deploy the Campaign contract using CampaignFactory
    const minimumContribution = 100;
    const campaignName = "Test Campaign";
    const campaignDescription = "A test campaign";
    const campaignImage = "https://example.com/image.jpg";
    const campaignTarget = 10000;
    manager = await ethers.getSigner(0);
    contributor = await ethers.getSigner(1);

    await campaignFactory
      .connect(manager)
      .createCampaign(minimumContribution, campaignName, campaignDescription, campaignImage, campaignTarget);

    const campaigns = await campaignFactory.getDeployedCampaigns();
    Campaign = await ethers.getContractFactory("Campaign");
    campaign = await Campaign.attach(campaigns[0]);
  });

  it("deploys a factory and a campaign", () => {
    expect(campaignFactory.address).to.exist;
    expect(campaign.address).to.exist;
  });

  // Add more test cases for the CampaignFactory and Campaign contracts
});
