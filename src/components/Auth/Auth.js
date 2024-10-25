import React, { useState, useEffect } from 'react';
import { connectWallet, getAccounts } from '../../services/web3'; // Import from web3 service
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    const { accounts } = await connectWallet(); // Use the connectWallet function
    if (accounts) {
      setAccounts(accounts);
      setSelectedAccount(accounts[0]); // Set the first account as selected
    }
  };

  const handleLogin = () => {
    if (!selectedAccount || !role) {
      alert('Please select an account and role to continue');
      return;
    }
    localStorage.setItem('selectedAccount', selectedAccount);
    localStorage.setItem('role', role);

    if (role === 'client') {
      navigate('/client');
    } else if (role === 'freelancer') {
      navigate('/freelancer');
    }
  };

  useEffect(() => {
    fetchAccounts(); // Fetch accounts on mount
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login with MetaMask</h2>

        <div className="auth-field">
          <label>Choose Account:</label>
          <select
            className="auth-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>

        <div className="auth-field">
          <label>Role:</label>
          <select
            className="auth-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        <button className="auth-button" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Auth;

