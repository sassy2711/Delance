# **Delance: A decentralised freelancing platform**

We have tried to make a **blockchain-based decentralised web application (DApp)** that allows freelancers and recruiters (clients) to connect on projects with built-in escrow. The recruiter (client) can put their project ideas and set the guidelines for the same. The freelancer can browse through the available projects on the platform and apply for the ones they are interested in. The freelancer will have to upload their files as a proof of work for each milestone that is set by the client.

## Unique Selling Point: 
The existing platforms don't have an **automated rating system**. Our platform automates the rating system so as to **prevent ratings being abused by malicious actors**.
There also does not exist a comprehensive solution which automates the entire workflow and integrates it with **decentralized arbitration** as we have done. 
The files are also uploaded on **IPFS** making them available as an **immutable proof** for the arbitrators. We have also **automated the payment of funds** after acceptance of proof of work for each milestone via **escrow contracts**.

## Workflow:

- Our website begins with asking the user to login/sign up as a client or freelancer.
  
### Client Side:
- The client dashboard displays details about the client's **Etherium (MetaMask)** account. The client can either add or view projects. For adding a project, the client must fix the reward amount.
- Client can then split up the work of each project into different milestones. Each milestone specifies the percentage of reward to be transacted upon completion of that milestone by the freelancer.
- The client can also view all the pending requests that the freelancers might have sent and can either decline or accept. The request contains important details like the freelancers address and rating.
- If accepted, a new **escrow account** is created, and the total reward is transferred from the client's account to the escrow account. All the future milestone payments are done from this escrow account.

### Freelancer Side:
- The freelancer can view all the projects that are available. Each project contains the necessary details, along with the option of applying for the project and viewing the milestones. Once accepted, the freelancer can start uploading the necessary files as proof for each milestone. Each file is stored on **IPFS** through a **dedicated gateway** (QuickNode Service), and a **CID (Content Identifier)** is generated for the same.
  
- The client views the proof files submitted by the freelancer for a particular milestone. If the client accepts the submission, the rating of the freelancer will get incremented, and the reward allotted for this milestone will be credited to the freelancer's account. If the client rejects the submission, the freelancer can either accept the rejection and work on it again (rating of freelancer decreases) or call for an **arbitration service (through Kleros)**.

The web application works smoothly on localhost (utilizing Ganache Etherum accounts). The contracts have also been deployed on Sepolia public testnet, through an Etherum RPC Endpoint. 


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
   https://github.com/sassy2711/Delance.git
   cd Delance

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
- Go to Delance/src/services/web3.js, CTRL-F for PROJECTS_CONTRACT_ADDRESS. Paste the address for that variable.
- Again, in ganache, click on the contracts tab.
- Click on the "RequestManager" contract, copy the address of the contract.
- Go to web3.js, CTRL-F for REQUEST_MANAGER_CONTRACT_ADDRESS. Paste the address for that variable.
- The code would look like:
 - Line number 5 of web3.js : const PROJECTS_CONTRACT_ADDRESS = 'Address1';
 - Line number 6 of web3.js : const REQUEST_MANAGER_CONTRACT_ADDRESS = 'Address2';
- So, you have to paste the Projects address in place of Address1 and the RequestManager address in place of Address2.


## Running the Application

### Start the Development Server

    npm start

### Open the DApp

- Open your browser and navigate to `http://localhost:3000`.

### Dispute Resolution

1. If a freelancer raises a dispute, an anonymous arbitrator from Kleros is appointed to review the case.
2. Based on the arbitrator's decision:
   - If the client’s rejection is validated, funds remain in the contract.
   - If the freelancer's submission is upheld, funds are released to the freelancer.
3. **Automatic Rating Adjustment**:
   - Ratings for both the client and freelancer are updated based on the arbitration outcome, influencing each party’s reputation on the platform.

   
