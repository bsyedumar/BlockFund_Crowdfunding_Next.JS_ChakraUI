import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Campaign from "../../../smart-contract/campaign";
import { ethers } from "ethers";

const getAccount = async () => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  return account;
};

export default function CampaignRequests({ campaignData }) {
  const router = useRouter();
  const [campaignInstance, setCampaignInstance] = useState(null);
  const [campaign, setCampaign] = useState({});
  const [requests, setRequests] = useState([]);
  const { campaignAddress } = router.query;

  useEffect(() => {
    const loadCampaign = async () => {
      if (campaignData) {
        const campaignInstance = Campaign(campaignData.address);
        setCampaignInstance(campaignInstance);

        const campaignSummary = await campaignInstance.methods.getSummary().call();
        const requestsCount = await campaignInstance.methods.getRequestsCount().call();
        const loadedRequests = await Promise.all(
          Array(parseInt(requestsCount))
            .fill()
            .map((element, index) => campaignInstance.methods.requests(index).call())
        );

        setCampaign({
          ...campaignSummary,
          address: campaignData.address,
        });

        setRequests(loadedRequests);
      }
    };

    loadCampaign();
  }, [campaignData]);

  const handleApproveRequest = async (index) => {
    const account = await getAccount();
    await campaignInstance.methods.approveRequest(index).send({ from: account });
  };
  
  const handleFinalizeRequest = async (index) => {
    const account = await getAccount();
    await campaignInstance.methods.finalizeRequest(index).send({ from: account });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      marginTop={"60px"}
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Campaign Requests
          </Heading>
          <NextLink href={`/admin`}>
            <Button>Back to Admin Panel</Button>
          </NextLink>
        </Box>
        <Table>
          <Thead>
            <Tr>
              <Th>Campaign Name</Th>
              <Th>Creator</Th>
              <Th>Time</Th>
              <Th>Actions</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request, index) => (
              <RequestRow
                key={index}
                request={request}
                index={index}
                approversCount={campaign.approversCount}
                onApprove={handleApproveRequest}
                onFinalize={handleFinalizeRequest}
                campaign={campaign}
              />
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Flex>
  );
}
function RequestRow({
  request,
  index,
  approversCount,
  onApprove,
  onFinalize,
  campaign,
}) {
  const { name, manager } = campaign;
  const { description, value, recipient, approvalsCount, complete } = request;

  const handleApprove = () => {
    onApprove(index);
  };

  const handleFinalize = () => {
    onFinalize(index);
  };

  const isApproved = approvalsCount > approversCount / 2;

  return (
    <Tr key={index}>
      <Td>{name}</Td>
      <Td>{manager}</Td>
      <Td>{description}</Td>
      <Td>{ethers.utils.formatEther(value)}</Td>
      <Td>{recipient}</Td>
      <Td>{`${approvalsCount}/${approversCount}`}</Td>
      <Td>
        {!complete && (
          <Button onClick={handleApprove} colorScheme="green" isDisabled={isApproved}>
            Approve
          </Button>
        )}
      </Td>
      <Td>
        {!complete && (
          <Button onClick={handleFinalize} colorScheme="red" isDisabled={!isApproved}>
            Finalize
          </Button>
        )}
      </Td>
      <Td>{complete ? "Approved" : "Pending"}</Td>
    </Tr>
  );
}
