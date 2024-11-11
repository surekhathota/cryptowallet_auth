import { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [walletStatus, setWalletStatus] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [ethBal, setEthBal] = useState(0);
  const [ethAccount, setEthAccount] = useState('');
  const [isManualDisconnect, setManualDisconnect] = useState(false);

  useEffect(() => {
    const provider = getCurrProvider();
    if (provider) {
      setWalletStatus('walletfound');
    } else {
      setWalletStatus('nowallet');
    }
  }, []); // Only run once when the component mounts

  const getCurrProvider = () => {
    if (window.ethereum) {
      return window.ethereum;
    } else if (window.web3) {
      return window.web3.currentProvider;
    } else {
      return null;
    }
  };

  const onConnect = async () => {
    try {
      const currentProvider = getCurrProvider();
      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);

        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];
        const balance = await web3.eth.getBalance(account);

        setEthAccount(account);
        setEthBal(web3.utils.fromWei(balance, 'ether')); // balance as number
        setIsConnected(true);
        setManualDisconnect(false);
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
    }
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setEthBal(0);
    setEthAccount('');
    setManualDisconnect(true);
    console.log('Disconnected manually');
  };

  return (
    <div className='app'>
      <div className="app-header">
        <h1>Crypto Wallet (Metamask) Authentication using React</h1>
      </div>
      <div className="app-wrapper">
        {walletStatus === 'nowallet' && (
          <div className='app-details'>
            <h2>Metamask not found. Please install MetaMask</h2>
          </div>
        )}

        {walletStatus === 'walletfound' && !isConnected && !isManualDisconnect && (
          <div>
            <button className='app-button_login' onClick={onConnect}>Login</button>
          </div>
        )}

        {walletStatus === 'walletfound' && !isConnected && isManualDisconnect && (
          <div>
            <div className='app-details'>
              <h2>You are manually disconnected from Metamask</h2>
              <button className='app-button_login' onClick={onConnect}>Login</button>
            </div>
          </div>
        )}

        {isConnected && (
          <div>
            <div className='app-details'>
              <h2>You are connected to MetaMask</h2>
              <div className='app-account'>
                <span>Account: {ethAccount}</span>
              </div>
              <div className='app-balance'>
                <span>Balance: {ethBal} ETH</span>
              </div>
              <div>
                <button className='app-button_logout' onClick={onDisconnect}>Disconnect</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;