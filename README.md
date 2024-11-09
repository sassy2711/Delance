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
- **Ganache Account**: App for test accounts and network.

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/freelance-escrow-dapp.git
   cd freelance-escrow-dapp

2. **Install MetaMask**:
- Install MetaMask from the [MetaMask website](https://metamask.io/).

3. **Connecting MetaMask with ganache**:
- Start ganache network.
- Choose new workspace, give whatever name.
- Click on add project, go to Delance/truffle_project, select the truffle-config.js file and then save the project(in ganache).
- Copy the private key of an account.
- Go to your metamask wallet.
- Click on add account.
- Click on import wallet.
- Paste the private key.
- The account is made.
- Again go on the metamask wallet, connect the account.
- Refresh at each step just in case.

4. **Compile and Deploy Smart Contracts**:
- Inside the project directory Delance, go to the truffle project directory.
  ```bash
   cd truffle_project
   truffle migrate
- Now the contracts should have been deployed on the ganache network(fee deducted from your account is an indicator).

5. **Copy the JSON files**:
- Go to Delance/truffle_project/build/contracts.
- Copy all the files.
- Go to Delance/src/contracts.
- Paste the files.

7. **Copy the contract addresses in the web3.js file**:
- In ganache, click on the contracts tab.
- Click on the "Projects" contract, copy the address of the contract.
- Go to web3.js, CTRL-F for PROJECTS_CONTRACT_ADDRESS. Paste the address for that variable.
- Again, in ganache, click on the contracts tab.
- Click on the "RequestManager" contract, copy the address of the contract.
- Go to web3.js, CTRL-F for REQUEST_MANAGER_CONTRACT_ADDRESS. Paste the address for that variable.
- The assignment would look like:
  Line number 5 of web3.js : const PROJECTS_CONTRACT_ADDRESS = '<Address1>';
  Line number 6 of web3.js : const REQUEST_MANAGER_CONTRACT_ADDRESS = '<Address2>';
- So, you have to paste the Projects address in place of <Address1> and the RequestManager address in place of <Address2>.


## Running the Application

### Start the Development Server

    npm start

### Open the DApp

- Open your browser and navigate to `http://localhost:3000`.


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

   
