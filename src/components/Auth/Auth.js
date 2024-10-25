import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts);
        setSelectedAccount(accounts[0]);
      } catch (error) {
        console.error('MetaMask connection failed:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this dApp.');
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
    connectMetaMask();
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


// delance/src/components/Auth/Auth.js

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { connectWallet } from '../../services/web3'; // Importing the connectWallet function
// import './Auth.css';

// function Auth() {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState('');
//   const [role, setRole] = useState('');
//   const navigate = useNavigate();

//   // Initialize MetaMask connection using the service
//   const connectMetaMask = async () => {
//     const walletData = await connectWallet(); // Call the connectWallet function
//     if (walletData) {
//       setAccounts([walletData.account]); // Set accounts with the first account
//       setSelectedAccount(walletData.account);
//     }
//   };

//   const handleLogin = () => {
//     if (!selectedAccount || !role) {
//       alert('Please select an account and role to continue');
//       return;
//     }
//     localStorage.setItem('selectedAccount', selectedAccount);
//     localStorage.setItem('role', role);

//     if (role === 'client') {
//       navigate('/client');
//     } else if (role === 'freelancer') {
//       navigate('/freelancer');
//     }
//   };

//   useEffect(() => {
//     connectMetaMask(); // Call the connection function on component mount
//   }, []);

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Login with MetaMask</h2>

//         <div className="auth-field">
//           <label>Choose Account:</label>
//           <select
//             className="auth-select"
//             value={selectedAccount}
//             onChange={(e) => setSelectedAccount(e.target.value)}
//           >
//             {accounts.map((account) => (
//               <option key={account} value={account}>
//                 {account}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="auth-field">
//           <label>Role:</label>
//           <select
//             className="auth-select"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="">Select Role</option>
//             <option value="client">Client</option>
//             <option value="freelancer">Freelancer</option>
//           </select>
//         </div>

//         <button className="auth-button" onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// }

// export default Auth;

