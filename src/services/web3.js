import Web3 from 'web3';
import ProjectsContract from '../contracts/Projects.json'; // Assuming ABI is saved as Projects.json

const PROJECTS_CONTRACT_ADDRESS = '0xA146CE52eD7884E2FaD3aAf054dC1a8Bd4BC9c06';

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
  console.log(selectedAccount);
  console.log(1);
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



export const fetchAndPrintProjects = async () => {
  console.log("fetchAndPrintProjects called"); // Add this to check
  try {
    // Get the contract instance
    const contract = await getProjectsContract();

    if (!contract) {
      console.error("Contract not found. Ensure you are connected to the correct network.");
      return;
    }

    // Call the viewProjects function
    const projectsData = await contract.methods.viewProjects().call();
    console.log("Raw viewProjects response:", projectsData);
    // const [ids, names, descriptions, rewards, statuses, employers] = await contract.methods.viewProjects().call();

    // // Print the returned arrays
    // console.log("Project IDs:", ids);
    // console.log("Project Names:", names);
    // console.log("Project Descriptions:", descriptions);
    // console.log("Project Rewards:", rewards);
    // console.log("Project Statuses:", statuses);
    // console.log("Project Employers:", employers);

  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
