// import Web3 from "web3";

// // Check if MetaMask is installed and connect
// export const connectWallet = async () => {
//   if (window.ethereum) {
//     const web3 = new Web3(window.ethereum);
//     try {
//       // Request account access if needed
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       return { accounts, web3 }; // Return all accounts and web3 instance
//     } catch (error) {
//       console.error("User denied account access:", error);
//       return null;
//     }
//   } else {
//     console.error("MetaMask not found");
//     return null;
//   }
// };

// // Fetch all connected accounts
// export const getAccounts = async () => {
//   const { accounts } = await connectWallet();
//   return accounts; // Return the array of accounts
// };

// // Fetch balance of a specific account
// export const getBalance = async (account) => {
//   const { web3 } = await connectWallet();
//   if (web3) {
//     const balance = await web3.eth.getBalance(account);
//     return web3.utils.fromWei(balance, 'ether'); // Convert from Wei to Ether
//   }
//   return null;
// };


import Web3 from 'web3';

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
