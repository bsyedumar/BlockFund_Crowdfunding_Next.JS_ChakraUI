import NewCampaign from './campaign/app';

import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
  } from "@web3-react/core";
import { ethers } from "ethers";

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>

      <NewCampaign />
    </Web3ReactProvider>
  );
}
function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
  }
  

