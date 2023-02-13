import './App.css';
import { ethers } from "ethers";
import { useState } from 'react';

function App() {

const [connected, setConnection] = useState(false);
const [name, setName] = useState("please sign in...");
const [amount, setAmount] = useState("")

const connect = async () => {
  let signer = null;
  let provider;
  if (window.ethereum == null) {
      console.log("MetaMask not installed");
      const provider = ethers.getDefaultProvider();
      console.log(provider)
  } else {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner();
      const message = "hello world!";
      const sig = await signer.signMessage(message);     
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const parsed = ethers.formatEther(balance);
        console.log(parsed);
      const verify = ethers.verifyMessage(message, sig);
        console.log(verify);
      setConnection(true);

      const { ethereum } = window;
      if(ethereum) {
        const ensProvider = new ethers.InfuraProvider('mainnet');
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const displayAddress = address?.substr(0, 6) + "...";
        const ens = await ensProvider.lookupAddress(address);
        if (ens !== null) {
          setName(ens)
  
        } else {
          setName(displayAddress)
  
        }
      } else {
        alert('no wallet detected!')
      }

  }
  console.log(provider);
  console.log(signer);
}

const disconnect = async () => {
  setConnection(false);
  setName("please sign in...")
}

const tip = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner();
  const address = "0xBC72198d65075Fdad2CA7B8db79EfF5B51c8B30D"
  const amountInWei = ethers.parseEther(amount);
  const tx = signer.sendTransaction({to: address, value: amountInWei});
  console.log(tx)
}

const handleChange = (event) => {
  setAmount(event.target.value)
}

  return (
    <div className="App">
      <header className="App-header">
        <h1>{name}</h1>

        <div className='signIn'>

        {!connected && (
          <button onClick={connect}>sign in</button>
        )}
        {connected && (
          <>
          <button onClick={disconnect}>sign out</button>
          </>
        )}

        </div>

        {connected && (
          <>
          <button onClick={tip}>tip</button>
          <input onChange={handleChange} placeholder='amount'>
          </input>
          </>
        )}
        
      </header>
    </div>
  );
}

export default App;
