// delance/src/components/Freelancer.js

import React, { useEffect, useState } from 'react';
import { connectWallet } from '../../services/web3'; // Import your connectWallet function

function Freelancer() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const account = localStorage.getItem('selectedAccount');
    if (account) {
      setSelectedAccount(account);
      fetchBalance(account);
    }
  }, []);

  const fetchBalance = async (account) => {
    const { web3 } = await connectWallet(); // Use your web3 function
    if (web3) {
      const balance = await web3.eth.getBalance(account); // Fetch account balance
      setBalance(web3.utils.fromWei(balance, 'ether')); // Convert from Wei to Ether
    }
  };

  return (
    <div>
      <h2>Freelancer Dashboard</h2>
      {selectedAccount && <p>Connected Account: {selectedAccount}</p>}
      {balance && <p>Account Balance: {balance} ETH</p>}
      {/* Add more freelancer-specific content here */}
    </div>
  );
}

export default Freelancer;
