// delance/src/components/Freelancer.js
import React, { useEffect, useState } from 'react';
import { connectWallet } from '../../services/web3'; // Import connectWallet function
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Freelancer() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [balance, setBalance] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const account = localStorage.getItem('selectedAccount');
    if (account) {
      setSelectedAccount(account);
      fetchBalance(account);
    }
  }, []);

  const fetchBalance = async (account) => {
    const { web3 } = await connectWallet();
    if (web3) {
      const balance = await web3.eth.getBalance(account);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }
  };

  // Function to navigate to the FreelancerProjectsPage
  const handleViewProjects = () => {
    navigate('/freelancer/projects', { state: { selectedAccount } });
  };

  // Function to navigate to the YourProjects page
  const handleYourProjects = () => {
    navigate('/freelancer/your-projects', { state: { selectedAccount } });
  };

  return (
    <div>
      <h2>Freelancer Dashboard</h2>
      {selectedAccount && <p>Connected Account: {selectedAccount}</p>}
      {balance && <p>Account Balance: {balance} ETH</p>}
      <button onClick={handleViewProjects}>View Projects</button>
      <button onClick={handleYourProjects}>Your Projects</button> {/* New button */}
    </div>
  );
}

export default Freelancer;
