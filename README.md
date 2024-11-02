# Freelance Project Escrow DApp with Arbitration

A decentralized application (DApp) designed to streamline freelance projects with secure escrow payments and fair dispute resolution. Utilizing Ethereum smart contracts, Kleros for arbitration, and IPFS for file storage, this DApp enables smooth, trustless interactions between clients and freelancers.

## Overview

This DApp serves as a decentralized platform for clients and freelancers to collaborate on projects with built-in escrow, milestone-based payments, and arbitration features. The application ensures:
- **Secure transactions** via Ethereum smart contracts.
- **Automated rating** updates for both parties after each transaction.
- **Fair dispute resolution** handled by Kleros.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)

## Features

1. **Client Project Posting**: Clients can create project requests with:
   - Project name and description
   - Payment amount
   - Milestones and payments for each milestone

2. **Freelancer File Submission**: Freelancers view available projects, select one to work on, and submit files at each milestone.

3. **Automated Payment and Rating System**: 
   - **Case 1**: If the client accepts the submitted files, payment is released automatically, and ratings are updated.
   - **Case 2**: If the client accepts with delayed milestones, the payment is reduced, and the freelancer's rating decreases slightly.
   - **Case 3**: If the client rejects the submission, the freelancer has the option to either revise the files or raise a dispute.
       - **Subcase 1**: Freelancer agrees to revise the work and resubmits.
       - **Subcase 2**: Freelancer raises a dispute; Kleros appoints an anonymous arbitrator to resolve the issue, determining the fund distribution.

4. **Dispute Resolution via Kleros**: When disputes arise, the Kleros arbitration system ensures fair decision-making.

5. **Rating System**: Ratings are calculated as a weighted average of all transaction outcomes, considering factors like transaction success or delay.

## Technology Stack

- **Ethereum (Sepolia test network)**: Smart contract deployment
- **Kleros**: Decentralized arbitration for disputes
- **IPFS**: Decentralized file storage
- **React**: Frontend for the user interface
- **Ethers.js**: Interact with the Ethereum network and contracts

## Prerequisites

To run this project, ensure you have the following installed:
- **Node.js** and **npm**: Download from [Node.js Official Website](https://nodejs.org/).
- **MetaMask**: Browser wallet for Ethereum interaction.
- **QuickNode Account**: Ethereum and IPFS provider, available at [QuickNode](https://www.quicknode.com/).

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/freelance-escrow-dapp.git
   cd freelance-escrow-dapp


## Compile and Deploy Smart Contracts

- Ensure you have an Ethereum Sepolia testnet account with sufficient test ETH for gas fees.
- Deploy the smart contracts to Sepolia or your desired Ethereum network.
- Record the contract address for future reference.

## Install MetaMask

1. Install MetaMask from the [MetaMask website](https://metamask.io/).
2. Add the Sepolia test network if it's not already configured.
3. Import your wallet with test ETH for transactions on the Sepolia network.


## Configuration

### Environment Variables

1. Create a `.env` file in the root directory of your project.
2. Add your configuration settings as shown below:

   ```plaintext
   REACT_APP_ETHEREUM_PROVIDER=<your_ethereum_provider_url>
   REACT_APP_IPFS_PROVIDER=<your_ipfs_provider_url>
   REACT_APP_KLEROS_CONTRACT_ADDRESS=<your_kleros_contract_address>

### Setting Up QuickNode

- Sign up at [QuickNode](https://www.quicknode.com/) to get an Ethereum and IPFS endpoint.
- Add these endpoints to your `.env` file.

### Configure Kleros

- Ensure your smart contract has access to the Kleros contract on the Sepolia test network.
- Use the `REACT_APP_KLEROS_CONTRACT_ADDRESS` environment variable to specify the Kleros contract address.



## Running the Application

### Start the Development Server

    npm start

### Open the DApp

- Open your browser and navigate to `http://localhost:3000`.
- Connect MetaMask to the Sepolia test network to interact with the DApp.



## Usage Guide

### Client Workflow

1. **Log in and Create a Project**:
   - After logging in, the client can create a project by providing details such as the project name, description, milestones, and payment structure.
   - Submit the project to list it on the platform, making it available for freelancers to view and accept.

2. **Review Freelancer Submissions**:
   - Track project progress as freelancers submit their work at each milestone.
   - Upon submission, the client has the option to:
     - **Accept the submission** for full or reduced payment (in cases of delayed milestones).
     - **Reject the submission** and provide feedback with comments for required modifications.
   - The system automatically adjusts ratings and updates payment records based on the client's acceptance or rejection.

### Freelancer Workflow

1. **Log in and Browse Available Projects**:
   - Once logged in, freelancers can browse through a list of projects posted by clients.
   - Select and accept a project to start working on it.

2. **Accept the Project** and begin working on the specified milestones.

3. **Submit Files** at each milestone:
   - Complete the work for each milestone and submit the required files to the client through the platform.
   - Wait for client feedback on the submitted work.

4. **Resolve Feedback**:
   - If the client requests modifications, the freelancer can:
     - Revise the work and resubmit until the client accepts.
     - Raise a dispute if they disagree with the client’s feedback, initiating Kleros arbitration for resolution.

### Dispute Resolution

1. If a freelancer raises a dispute, an anonymous arbitrator from Kleros is appointed to review the case.
2. Based on the arbitrator's decision:
   - If the client’s rejection is validated, funds remain in the contract.
   - If the freelancer's submission is upheld, funds are released to the freelancer.
3. **Automatic Rating Adjustment**:
   - Ratings for both the client and freelancer are updated based on the arbitration outcome, influencing each party’s reputation on the platform.

   
