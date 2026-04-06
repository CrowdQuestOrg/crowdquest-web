import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { ethers } from "ethers";
import { CHAIN_ID } from "../constants/contracts";

const SEPOLIA_CHAIN_ID = `0x${CHAIN_ID.toString(16)}`; 
const SEPOLIA_RPC_URL = "https://rpc.sepolia.org"; 

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletState>({
  address: null,
  balance: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  isCorrectNetwork: false,
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  /**
   * Core Logic: Updates the global ethers state
   */
  const updateWalletInfo = useCallback(async (userAddress: string) => {
    const ethereum = window.ethereum;
    if (!ethereum) return;
    
    try {
      const browserProvider = new ethers.BrowserProvider(ethereum);
      const browserSigner = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();
      const balanceWei = await browserProvider.getBalance(userAddress);
      
      setProvider(browserProvider);
      setSigner(browserSigner);
      setChainId(`0x${network.chainId.toString(16)}`);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Failed to update wallet info:", error);
    }
  }, []);

  /**
   * Helper: Switches or Adds Sepolia Network
   */
  const switchNetwork = useCallback(async () => {
    const ethereum = window.ethereum;
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: SEPOLIA_CHAIN_ID,
            chainName: "Sepolia Test Network",
            rpcUrls: [SEPOLIA_RPC_URL],
            nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          }],
        });
      }
    }
  }, []);

  /**
   * Action: Manual Connect
   */
  const connect = useCallback(async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        await updateWalletInfo(userAddress);
        
        const currentChain = await ethereum.request({ method: "eth_chainId" });
        if (currentChain !== SEPOLIA_CHAIN_ID) {
          await switchNetwork();
        }
      }
    } catch (err: any) {
      console.error("Connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [updateWalletInfo, switchNetwork]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
  }, []);

  /**
   * CRITICAL: Eager Connection Check (Fixes Reload Issue)
   */
  useEffect(() => {
    const checkExistingConnection = async () => {
      const ethereum = window.ethereum;
      if (ethereum) {
        try {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            await updateWalletInfo(accounts[0]);
          }
        } catch (error) {
          console.error("Eager connection failed:", error);
        }
      }
    };
    checkExistingConnection();
  }, [updateWalletInfo]);

  /**
   * Listeners: Account and Chain changes
   */
  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        updateWalletInfo(accounts[0]);
      } else {
        disconnect();
      }
    };

    const handleChainChanged = () => window.location.reload();

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [updateWalletInfo, disconnect]);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        chainId,
        isConnected: !!address,
        isConnecting,
        isCorrectNetwork: chainId === SEPOLIA_CHAIN_ID,
        provider,
        signer,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};