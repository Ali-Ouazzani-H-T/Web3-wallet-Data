import {useState, useEffect} from 'react';
import {Provider, Web3Provider} from "@ethersproject/providers"
import {formatEther} from "@ethersproject/units"
import {InjectedConnector} from "@web3-react/injected-connector"
import {Web3ReactProvider, useWeb3React} from "@web3-react/core"


export default function Home(){

  return(
  <Web3ReactProvider getLibrary={(Provider: any) => new Web3Provider(Provider) }>
    <App/>
  </Web3ReactProvider>
  );
};

function App() {
  const { 
    active, account,
     activate, chainId, library} = useWeb3React();
  const balance = useBalance();
  const blockNumber = useBlockNumber();

  return (
      <div className='core'>
        <div className='relative flex items-center justify-between h-16 text-gray-100'>
          {
            active ? (
              <>
                <div className='Net'><h2>Current server :</h2> {chainId === 1 ? 'Mainnet' : "TestNet"}({blockNumber})</div>
                <div className='acc'>
                  <h2>Adresse :</h2> {account.substr(0,8)}...{account.substr(-8,8)}
                </div>
                <div className='balance'><h2>Balance :</h2> {balance}</div>
                <button
                  className='btn-'
                  onClick={async () => {
                    const message = `Logging in at ${new Date().toISOString()}`;
                    const signature = await library.getSigner(account)
                    .signMessage(message)
                    .catch(error => console.error(error));
                    console.log({ message, account, signature});
                  }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
              <div className='first-page'>
              <h1>Hello welcome to my First Dapp </h1>
              <h1>Connect your wallet</h1>
              <button
                className='btn'
                onClick={() => {
                  activate(new InjectedConnector({}));
                }}
              >
                Connect
              </button>
              </div>
              </>
            )
          }
        </div>
      </div>
  );
}

function useBalance(){
  const {account, library} = useWeb3React();
  const [balance, setBalance] = useState();

  useEffect(() => {
    if(account)
    {
      library.getBalance(account).then((val) => setBalance(val))
    }
  } , [account, library]);
  return balance ? `${formatEther(balance)} ETH` : null ; 
}

function useBlockNumber()
{
  const {library} = useWeb3React();
  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    if(library)
    {
      const updateBlockNumber = (val) => setBlockNumber(val);
      library.on('block', updateBlockNumber)

      return () => {
        library.removeEventListener('block', updateBlockNumber);
      };
    }
  }, [library])
  return blockNumber;
}


