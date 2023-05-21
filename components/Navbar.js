import { Box, Flex, Button, Stack, useColorModeValue, Container, Heading, Link } from "@chakra-ui/react";
import { useWeb3React } from '@web3-react/core'
import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { useState } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import Image from "next/image";

export function Navbar() {
  const { account, activate, deactivate, active } = useWeb3React();

  const [connecting, setConnecting] = useState(false);
  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 31337, 1337],
  });


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

  return (
    <>
      <Box>
        <Flex
          color={useColorModeValue("gray.600", "white")}
          py={{ base: 4 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.900")}
          align={"center"}
          pos="fixed"
          top="0"
          w={"full"}
          minH={"60px"}
          boxShadow={"sm"}
          zIndex="999"
          justify={"center"}
          backgroundColor={useColorModeValue("whiteAlpha.900", "gray.800")}
        >
          <Container as={Flex} maxW={"7xl"} align={"center"}>
            <Flex flex={{ base: 1 }} justify="start" ml={{ base: -2, md: 0 }}>
              <Heading
                textAlign="left"
                fontFamily={"heading"}
                color={useColorModeValue("teal.800", "white")}
                as="h2"
                size="lg"
              >
                <Box
                  as={"span"}
                  color={useColorModeValue("teal.400", "teal.300")}
                  position={"relative"}
                  zIndex={10}
                  _after={{
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    w: "full",
                    h: "30%",
                    bg: useColorModeValue("teal.100", "teal.900"),
                    zIndex: -1,
                  }}
                >
                  <Image src="/BLOCKFUND_LOGO2.png" width={200} height={80} />
                  <NextLink href="/">BlockFund</NextLink>
                </Box>
              </Heading>
            </Flex>
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={"flex-end"}
              direction={"row"}
              spacing={6}
              display={{ base: "none", md: "flex" }}
            >
              <Button
                fontSize={"md"}
                fontWeight={600}
                variant={"link"}
                display={{ base: "none", md: "inline-flex" }}
              >
                <NextLink href="/campaign/app">Create Campaign</NextLink>
              </Button>
              <Button
                fontSize={"md"}
                fontWeight={600}
                variant={"link"}
                display={{ base: "none", md: "inline-flex" }}
              >
                <NextLink href="/#howitworks"> How it Works</NextLink>
              </Button>
              {!active ? (
                <Button
                  display={{ base: "none", md: "inline-flex" }}
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"teal.400"}
                  _hover={{
                    bg: "teal.300",
                  }}
                  onClick={connectWallet}
                  isLoading={connecting}
                >
                  {connecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              ) : (
                <Button onClick={disconnectWallet} variant="outline">
                  Disconnect Wallet
                </Button>
              )}
              <DarkModeSwitch />
            </Stack>
            <Flex display={{ base: "flex", md: "none" }}>
              <DarkModeSwitch />
            </Flex>
          </Container>
        </Flex>
      </Box>
    </>
  );
}

function getLibrary(provider) {
  return new Web3Provider(provider);
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Navbar />
    </Web3ReactProvider>
  );
}