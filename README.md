# BlockFund: Trustless Peer-to-Peer Blockchain Crowdfunding Platform

Blockfund is a decentralized web application that leverages the power of blockchain technology to establish a trustless, peer-to-peer crowdfunding platform. It is built using Next.js, Chakra UI, and React, enabling secure and transparent transactions worldwide.

## Key Features

- **Decentralized Crowdfunding**: Allows direct, peer-to-peer funding.
- **Blockchain-Powered**: Ensures secure and transparent transactions.
- **User-Friendly Interface**: Offers a sleek, intuitive, and responsive UI.
- **Startups, Donations, & Investments**: Provides versatility for different financial journeys.

## Technologies Used

- **Next.js**: Used for server-side rendering and generating static web pages.
- **React**: Used for building user interfaces.
- **Chakra UI**: Used for a simple, modular, and accessible component library.
- **Blockchain**: Used for trustless, secure, and transparent transactions.


![blockfund_campaign_page](https://github.com/bsyedumar/BlockFund_Crowdfunding_Next.JS_ChakraUI/assets/54539776/71e9c90b-7406-4898-97f1-994304899c91)

## Installation and Usage

Before proceeding, ensure you have Node.js and npm installed on your machine.

# Clone the repository to your local machine
git clone https://github.com/bsyedumar/BlockFund_Crowdfunding_Next.JS_ChakraUI.git

# Navigate into the project directory
cd BlockFund_Crowdfunding_Next.JS_ChakraUI

# Install the project dependencies
npm install

# To start the development server
npm run dev

After running these commands, visit http://localhost:3000 in your web browser to access the app.

## Hardhat Configuration
Before deploying your contract, you will need to configure Hardhat. Hardhat is a development environment used to compile, deploy, test, and debug Ethereum software.


# Contract Deployment
With your Hardhat environment configured, you can now deploy your smart contract. Here's how you can do it:

# Compile your contracts
npx hardhat compile

# Run a Hardhat network in a new terminal
npx hardhat node

# Deploy your contract in another terminal
npx hardhat run scripts/deploy.js --network localhost
Note that scripts/deploy.js should be replaced with the path to your deployment script.

After running these commands, your smart contract will be deployed on your local Hardhat network.

Enjoy BlockFund and happy coding!
