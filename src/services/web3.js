import Web3 from 'web3';
import ProjectsContract from '../contracts/Projects.json'; 
import RequestManagerContract from '../contracts/RequestManager.json'
const PROJECTS_CONTRACT_ADDRESS = '0x90df1317237267f717E1B251442702BA1B655b6A';
const REQUEST_MANAGER_CONTRACT_ADDRESS = '0xB1AC5840645273819522df32f79c83A3A307443f'

export const connectWallet = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return { accounts, web3 };
    } catch (error) {
      console.error('User denied account access:', error);
      return null;
    }
  } else {
    console.error('MetaMask not found');
    return null;
  }
};

export const getAccounts = async () => {
  const { accounts } = await connectWallet();
  return accounts;
};

export const getBalance = async (account) => {
  const { web3 } = await connectWallet();
  if (web3) {
    const balance = await web3.eth.getBalance(account);
    return web3.utils.fromWei(balance, 'ether');
  }
  return null;
};

// Utility to get stored account and role from localStorage
export const getStoredCredentials = () => {
  const account = localStorage.getItem('selectedAccount');
  const role = localStorage.getItem('role');
  return { account, role };
};

// Initialize Projects contract instance
export const getProjectsContract = async () => {
  const { web3 } = await connectWallet();
  if (web3) {
    return new web3.eth.Contract(ProjectsContract.abi, PROJECTS_CONTRACT_ADDRESS);
  }
  return null;
};

// Initialize RequestManager contract instance
export const getRequestManagerContract = async () => {
  const { web3 } = await connectWallet();
  if (web3) {
    return new web3.eth.Contract(RequestManagerContract.abi, REQUEST_MANAGER_CONTRACT_ADDRESS);
  }
  return null;
};

// Function to add a project
export const addProject = async (name, description, reward, account) => {
  const contract = await getProjectsContract();
  if (contract) {
    try {
      // Convert reward to Wei and send the transaction
      const rewardInWei = Web3.utils.toWei(reward, 'ether');
      await contract.methods.addProject(name, description, rewardInWei).send({ from: account });
      return { success: true, message: 'Project added successfully.' };
    } catch (error) {
      console.error('Error adding project:', error);
      return { success: false, message: 'Failed to add project.' };
    }
  }
  return { success: false, message: 'Failed to connect to the contract.' };
};

export const fetchAllProjects = async () => {
  try {
    const contract = await getProjectsContract();
    if (!contract) {
      console.error("Contract not found. Ensure you are connected to the correct network.");
      return [];
    }

    // Call viewProjects function
    const projectData = await contract.methods.viewProjects().call();

    // Deconstruct arrays from projectData
    const ids = projectData[0];
    const names = projectData[1];
    const descriptions = projectData[2];
    const rewards = projectData[3];
    const statuses = projectData[4];
    const employers = projectData[5];

    // Map the arrays to create an array of project objects
    const projects = ids.map((id, index) => ({
      id: id.toString(), // Convert BigInt to string if needed
      title: names[index],
      description: descriptions[index],
      reward: rewards[index].toString(), // Convert BigInt to string if needed
      status: statuses[index].toString(), // Assuming status is an enum, adjust as needed
      employer: employers[index],
    }));

    return projects;

  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
};

// src/services/web3.js
// src/services/web3.js
export const fetchUserProjects = async (selectedAccount) => {
  //console.log(selectedAccount);
  //console.log(1);
  try {
    const contract = await getProjectsContract();
    if (!contract) {
      console.error("Contract not found. Ensure you are connected to the correct network.");
      return [];
    }

    // Call viewProjects function to get all projects
    const projectData = await contract.methods.viewProjects().call();

    // Deconstruct arrays from projectData
    const ids = projectData[0];
    const names = projectData[1];
    const descriptions = projectData[2];
    const rewards = projectData[3];
    const statuses = projectData[4];
    const employers = projectData[5];

    // Map the arrays to create an array of project objects and filter by employer
    const projects = ids.map((id, index) => ({
      id: id.toString(), // Convert BigInt to string if needed
      title: names[index],
      description: descriptions[index],
      reward: rewards[index].toString(), // Convert BigInt to string if needed
      status: statuses[index].toString(), // Assuming status is an enum, adjust as needed
      employer: employers[index],
    })).filter(project => project.employer && project.employer.toLowerCase() === selectedAccount.toLowerCase());

    return projects;

  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
};

export async function addMilestone(projectId, name, description, daycount, percentage, selectedAccount) {
  try {
    const contract = await getProjectsContract(); // Await the contract instance
    
    if (!contract) {
      console.error("Contract instance not initialized");
      return;
    }

    // Debugging logs to verify parameters and account
    console.log("Parameters: ", { projectId, name, description, daycount, percentage, selectedAccount });
    console.log("Contract Address: ", contract.options.address);

    // Call contract method with `send` to trigger the transaction
    const transaction = await contract.methods.addMilestone(projectId, name, description, daycount, percentage)
      .send({ from: selectedAccount });
    
    console.log("Transaction successful:", transaction);
  } catch (error) {
    console.error("Error adding milestone:", error);
  }
}

export const getMilestones = async (projectId) => {
  try {
    const contract = await getProjectsContract();
    // Call the contract function
    const result = await contract.methods.getMilestones(projectId).call();

    // Destructure the returned object to match the Solidity return values
    const ids = result[0];
    const projectIds = result[1];
    const names = result[2];
    const descriptions = result[3];
    const daycounts = result[4];
    const percentages = result[5];
    const completions = result[6];
    const proofFileHashes = result[7];

    // Map the milestones into an array of objects
    return ids.map((id, index) => ({
      id : id.toString(),
      projectId: projectIds[index],
      name: names[index],
      description: descriptions[index],
      daycount: daycounts[index].toString(),
      percentage: percentages[index].toString(),
      completed: completions[index],
      proofFileHash: proofFileHashes[index],
    }));
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

// src/services/web3.js

export const setFreelancerRating = async (freelancerAddress, rating) => {
  try {
    const contract = await getProjectsContract();
    if (!contract) {
      console.error("Contract not found. Ensure you are connected to the correct network.");
      return { success: false, message: 'Contract not found.' };
    }

    // Call the contract method to set the freelancer rating
    await contract.methods.setFreelancerRating(freelancerAddress, rating).send({ from: freelancerAddress });
    
    console.log("Freelancer rating set successfully.");
    return { success: true, message: 'Freelancer rating set successfully.' };
  } catch (error) {
    console.error("Error setting freelancer rating:", error);
    return { success: false, message: 'Failed to set freelancer rating.' };
  }
};

// src/services/web3.js

export const getFreelancerRating = async (freelancerAddress) => {
  try {
    const contract = await getProjectsContract();
    if (!contract) {
      console.error("Contract not found. Ensure you are connected to the correct network.");
      return { success: false, message: 'Contract not found.' };
    }

    // Call the contract method to get the freelancer rating
    const rating = await contract.methods.getFreelancerRating(freelancerAddress).call();

    console.log(`Freelancer rating: ${rating}`);
    return { success: true, rating: rating };
  } catch (error) {
    console.error("Error getting freelancer rating:", error);
    return { success: false, message: 'Failed to get freelancer rating.' };
  }
};

export const sendRequest = async (projectId, freelancerRating, freelancerAddress) => {
  try {
    const requestManagerContract = await getRequestManagerContract();
    if (!requestManagerContract) {
      console.error("RequestManager contract not found. Ensure you are connected to the correct network.");
      return { success: false, message: 'Contract not found.' };
    }

    // Convert parameters to BigInt
    const formattedProjectId = Web3.utils.toBigInt(projectId);  // Convert projectId to BigInt
    const formattedRating = Web3.utils.toBigInt(freelancerRating);  // Convert freelancerRating to BigInt

    console.log("Sending request with:", {
      projectId: formattedProjectId.toString(),
      freelancerRating: formattedRating.toString(),
      from: freelancerAddress,
    });

    // Call the contract method to send the request
    await requestManagerContract.methods
      .sendRequest(formattedProjectId, formattedRating)
      .send({ from: freelancerAddress });

    console.log("Request sent successfully.");
    return { success: true, message: 'Request sent successfully.' };
  } catch (error) {
    console.error("Error sending request:", error);
    return { success: false, message: 'Failed to send request.' };
  }
};

export const fetchRequestsByProjectId = async (projectId) => { 
  console.log("Project ID:", projectId);
  try {
    console.log("Step 1: Getting contract instance...");
    const contract = await getRequestManagerContract(); // Get the instance of the RequestManager contract
    console.log("Step 2: Calling viewAllRequests...");

    // Call the contract function
    const result = await contract.methods.viewAllRequests().call();
    console.log("Step 3: Response received:", result);

    // Destructure the returned arrays to match the Solidity return values
    const requestIds = result[0];
    const projectIds = result[1];
    const freelancers = result[2];
    const freelancerRatings = result[3];
    const statuses = result[4];
    const escrowContracts = result[5];
    console.log("4");
    // Map the requests into an array of objects and filter by projectId
    const statusEnum = ["Pending", "Approved", "Rejected"];
    const filteredRequests = requestIds.map((id, index) => ({
      requestId: id.toString(),
      projectId: projectIds[index].toString(),
      freelancer: freelancers[index],
      freelancerRating: freelancerRatings[index].toString(),
      status: statusEnum[statuses[index]], // Assuming you want to keep the enum or convert it to a string
      escrowContract: escrowContracts[index], // This can be an address or object based on your requirements
    })).filter(request => request.projectId === projectId.toString()); // Filter by projectId
    
    return filteredRequests; // Return the filtered array of requests
  } catch (error) {
    console.error("Error fetching requests by project ID:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};



