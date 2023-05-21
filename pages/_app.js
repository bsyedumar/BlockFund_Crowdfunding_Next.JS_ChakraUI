import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "@fontsource/space-grotesk";
import { UseWalletProvider } from "use-wallet";


const theme = extendTheme({
  fonts: {
    heading: "Space Grotesk",
    body: "Space Grotesk",
  },
});

const injected = new InjectedConnector({
  supportedChainIds: [31337,1337],
});

function getLibrary(provider) {
  if (!provider) return new Web3.providers.HttpProvider("http://localhost:8545");
  return new Web3(provider);
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
     <UseWalletProvider
      chainId={1337} // Change this to the appropriate chain ID you are using
    >
      <Component {...pageProps} />
    </UseWalletProvider>
    <Footer />
    </ChakraProvider>
  );
}

export default MyApp;
