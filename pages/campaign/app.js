import web3 from "../../smart-contract/web3";
import { ethers } from "ethers";
import provider from "../../smart-contract/provider";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useAsync } from "react-use";
import { Router, useRouter } from "next/router";
import { useWallet,  UseWalletProvider} from "use-wallet";
import { useForm } from "react-hook-form";

import {
useWeb3React,
} from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightAddon,
  InputGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getETHPrice, getETHPriceInUSD } from "../../lib/getETHPrice";

import factory from "../../smart-contract/factory";
import Ably from 'ably';

export default function NewCampaign() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [minContriInUSD, setMinContriInUSD] = useState();
  const [targetInUSD, setTargetInUSD] = useState();
  const [ETHPrice, setETHPrice] = useState(0);
  const injected = new InjectedConnector({ supportedChainIds: [5] });

const { account, activate, deactivate, active } = useWeb3React();

const [connecting, setConnecting] = useState(false);

const connectWallet = async () => {
  setConnecting(true);
  try {
    await activate(injected);
  } catch (ex) {
    console.error(ex);
  }
  setConnecting(false);
};

const disconnectWallet = () => {
  deactivate();
};
  useAsync(async () => {
    try {
      const result = await getETHPrice();
      setETHPrice(result);
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function onSubmit(data) {
    console.log(
      data.minimumContribution,
      data.campaignName,
      data.description,
      data.imageUrl,
      data.target
    );
    
    try {
      const signer = provider.getSigner();
      const accounts = await signer.getAddress();
  
      const tx = await factory
        .connect(signer)
        .createCampaign(
          ethers.utils.parseEther(data.minimumContribution.toString()),
          data.campaignName,
          data.description,
          data.imageUrl,
          ethers.utils.parseEther(data.target.toString())
        );
        
        await tx.wait();
        
        // Initialize the Ably client
        const ably = new Ably.Realtime('lvB1wQ.qxCBmw:8_0vyuiztOAuPe3VSLNIe_X3CBNJpAbLmfkI2zei8Ok');
    
        // Publish a message to Ably
    ably.channels.get('channel1').publish('msg', {
      message: `A new campaign "${data.campaignName}" has been created!`,
    });

    router.push("/");
  } catch (err) {
        setError(err.message);
        console.log(err);
      }
    }

  return (
    <>
        <div>
        <Head>
        <title>New Campaign</title>
        <meta name="description" content="Create New Campaign" />
        <link rel="icon" href="/logo.svg" />
      </Head>
          <main>
        <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
          <Text fontSize={"lg"} color={"teal.400"}>
            <ArrowBackIcon mr={2} />
            <NextLink href="/"> Back to Home</NextLink>
          </Text>
          <Stack>
            <Heading fontSize={"4xl"}>Create a New Campaign 📢</Heading>
          </Stack>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl id="minimumContribution">
              <FormLabel>Minimum Contribution Amount</FormLabel>
              <InputGroup>
                {" "}
                <Input
                  type="number"
                  step="any"
                  {...register("minimumContribution", { required: true })}
                  placeholder="Enter Minimum Campaign Contribution Amount"
                  isDisabled={isSubmitting}
                  onChange={(e) => {
                    setMinContriInUSD(Math.abs(e.target.value));
                  }}
                />{" "}
                <InputRightAddon children="ETH" />
              </InputGroup>
              {minContriInUSD ? (
                <FormHelperText>
                  ~$ {getETHPriceInUSD(ETHPrice, minContriInUSD)}
                </FormHelperText>
              ) : null}
            </FormControl>
            <FormControl id="campaignName">
              <FormLabel>Campaign Name</FormLabel>
              <Input
                {...register("campaignName", { required: true })}
                placeholder="Enter Campaign Name"
                isDisabled={isSubmitting}
              />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Campaign Description</FormLabel>
              <Textarea
                {...register("description", { required: true })}
                placeholder="Enter Campaign Description"
                isDisabled={isSubmitting}
              />
            </FormControl>
            <FormControl id="imageUrl">
              <FormLabel>Campaign Image URL</FormLabel>
              <Input
                {...register("imageUrl", { required: true })}
                placeholder="Enter Image URL"
                isDisabled={isSubmitting}
                alt= "image"
              />
            </FormControl>
            <FormControl id="target">
              <FormLabel>Target Amount</FormLabel>
              <InputGroup>
              {" "}
              <Input
              type="number"
              step="any"
              {...register("target", { required: true })}
              placeholder="Enter Campaign Target Amount"
              isDisabled={isSubmitting}
              onChange={(e) => {
              setTargetInUSD(Math.abs(e.target.value));
              }}
              />
              <InputRightAddon children="ETH" />
              </InputGroup>

              {targetInUSD ? (
                <FormHelperText>
                  ~$ {getETHPriceInUSD(ETHPrice, targetInUSD)}
                </FormHelperText>
              ) : null}
            </FormControl>
            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              isLoading={isSubmitting}
              type="submit"
              bg={"teal.400"}
              color={"white"}
              _hover={{
                bg: "teal.600",
              }}
            >
              Create Campaign
            </Button>
          </Stack>
        </form>
      </Box>
      </Stack>
      </main>
    </div>

    </>
)}
