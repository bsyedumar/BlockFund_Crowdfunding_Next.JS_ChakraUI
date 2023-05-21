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

it("allows contributors to contribute to the campaign", async () => {
  const initialBalance = await ethers.provider.getBalance(campaign.address);

  // Make a contribution to the campaign
  await campaign.connect(contributor).contribute({ value: 200 });

  const newBalance = await ethers.provider.getBalance(campaign.address);

  expect(newBalance.sub(initialBalance)).to.equal(200);
});


it("allows the manager to create a spending request", async () => {
await campaign.connect(manager).createRequest("Test request", 500, contributor.address);
expect(await campaign.getRequestsCount()).to.equal(1);
});

it("allows approvers to approve a spending request", async () => {
await campaign.connect(manager).createRequest("Test request", 500, contributor.address);
await campaign.connect(contributor).approveRequest(0);
const request = await campaign.requests(0);
expect(request.approvalCount).to.equal(1);
});

it("allows the manager to finalize a spending request", async () => {
await campaign.connect(manager).createRequest("Test request", 500, contributor.address);
await campaign.connect(contributor).approveRequest(0);
await campaign.connect(manager).finalizeRequest(0);
const request = await campaign.requests(0);
expect(request.complete).to.equal(true);
});
});