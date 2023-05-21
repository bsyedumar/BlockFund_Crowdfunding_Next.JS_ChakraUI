import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Flex, Heading, Button, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import web3 from "../smart-contract/web3";
import { ethers } from "ethers";
import CampaignFactory from "../smart-contract/factory";
import Campaign from "../smart-contract/campaign";
import Head from "next/head";

async function getAccount() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await window.ethereum.enable();
  const signer = provider.getSigner();
  const account = await signer.getAddress();
  const accounts = await web3.eth.getAccounts();
  const userEthAddress = accounts[0];
  console.log('Current account:', userEthAddress);
  return account;

};

const approveOrRejectCampaign = async (campaignAddress, status, router) => {
  try {
    const campaignInstance = await Campaign(campaignAddress);
    await campaignInstance.methods.setApproval(status).send({
      from: await getAccount(),
    });
    toast({
      title: "Campaign Approved/Rejected!",
      description: `The campaign has been ${status ? "approved" : "rejected"}.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    // Redirect to index page with success message
    router.push({
      pathname: "/",
      query: { success: true },
    });
  } catch (error) {
    console.error("Error in approveOrRejectCampaign:", error);
    toast({
      title: "Error!",
      description: "Failed to approve/reject the campaign.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

function CampaignCard({ campaignAddress }) {
  const [contractInstance, setContractInstance] = useState(null);
  const [campaign, setCampaign] = useState({});
  const [approvalStatus, setApprovalStatus] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const loadCampaign = async () => {
      const campaignInstance = Campaign(campaignAddress);
      setContractInstance(campaignInstance);
      const campaignSummary = await campaignInstance.methods.getSummary().call();
      const timestamp = new Date(parseInt(campaignSummary[10]) * 1000);
      setCampaign({
        address: campaignAddress,
        minimumContribution: campaignSummary[0],
        balance: campaignSummary[1],
        requestsCount: campaignSummary[2],
        approversCount: campaignSummary[3],
        manager: campaignSummary[4],
        name: campaignSummary[5],
        description: campaignSummary[6],
        imageUrl: campaignSummary[7],
        targetToAchieve: campaignSummary[8],
        approved: campaignSummary[9],
        timestamp: timestamp.toLocaleDateString(),
      });
      console.log('Manager Ethereum address:', campaignSummary[4]);
    };


    loadCampaign();
  }, [campaignAddress]);

  const handleApprove = async () => {
    await approveOrRejectCampaign(campaignAddress, true, router);
  };

  const handleReject = async () => {
    await approveOrRejectCampaign(campaignAddress, false, router);
  };

  return (
    <div>
      <Head>
        <title>Admin Panel</title>
        <meta name="description" content="Transparent Crowdfunding in Blockchain" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        <Box key={campaignAddress} borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} mb={6}>
          <Image src={campaign.imageUrl} alt={campaign.name} width="50px" mb={4} />
          <Heading as="h3" size="md" mb={2}>{campaign.name}</Heading>
          <Text mb={2}>Minimum Contribution: {campaign.minimumContribution ? ethers.utils.formatEther(campaign.minimumContribution) : "Loading..."} ETH</Text>
          <Text mb={2}>Balance: {campaign.balance ? ethers.utils.formatEther(campaign.balance) : "Loading..."} ETH</Text>
          <Text mb={2}>Requests Count: {campaign.requestsCount !== undefined ? campaign.requestsCount : "Loading..."}</Text>
          <Text mb={2}>Approvers Count: {campaign.approversCount !== undefined ? campaign.approversCount : "Loading..."}</Text>
          <Text mb={2}>Manager: {campaign.manager ? campaign.manager : "Loading..."}</Text>
          <Text mb={2}>Description: {campaign.description ? campaign.description : "Loading..."}</Text>
          <Text mb={2}>Target To Achieve: {campaign.targetToAchieve ? ethers.utils.formatEther(campaign.targetToAchieve) : "Loading..."} ETH</Text>
          <Text mb={2}>Timestamp: {campaign.timestamp ? campaign.timestamp : "Loading..."}</Text>
          {approvalStatus !== null ? (
            approvalStatus === 'approved' ? (
              <Text>Campaign approved!</Text>
            ) : (
              <Text>Campaign rejected!</Text>
            )
          ) : (
            <>
              <Button onClick={() => handleApprove()}>Approve</Button>
              <Button onClick={() => handleReject()}>Reject</Button>
            </>
          )}
          <Link href={`/admin/${encodeURIComponent(campaign.address)}/requests`} passHref>
            <Button as="a" target="_blank">Manage Requests</Button>
          </Link>
        </Box>
      </main>
    </div>
  );
}
export default function AdminPanel() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const loadCampaigns = async () => {
      const deployedCampaigns = await CampaignFactory.getDeployedCampaigns();
      console.log('deployedCampaigns:', deployedCampaigns);
      setCampaigns(deployedCampaigns.map(address => ({ address })));
    };
    loadCampaigns();
  }, []);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      marginTop={"20vh"}
    >
      <Box>
        <Heading as="h2" size="xl" mb={4} colorScheme="teal">
          Admin Panel
        </Heading>
        <Flex wrap="wrap">
          {campaigns.map(campaign => <CampaignCard key={campaign.address} campaignAddress={campaign.address} />)}
        </Flex>
      </Box>
    </Flex>
  );
}