import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { ethers } from "ethers";

// 1. Define the Sepolia Network Constants
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
const SEPOLIA_RPC_URL = "https://rpc.sepolia.org"; // Or use your Alchemy URL

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
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

  // Helper to fetch balance and network info
  const updateWalletInfo = useCallback(async (userAddress: string) => {
    if (!(window as any).ethereum) return;
    
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const network = await provider.getNetwork();
    const balanceWei = await provider.getBalance(userAddress);
    
    setChainId("0x" + network.chainId.toString(16));
    setBalance(ethers.formatEther(balanceWei));
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!(window as any).ethereum) return;
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err: any) {
      // If the network isn't added to MetaMask, add it
      if (err.code === 4902) {
        await (window as any).ethereum.request({
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

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        await updateWalletInfo(userAddress);
        
        // Ensure user is on Sepolia immediately after connecting
        const currentChain = await (window as any).ethereum.request({ method: "eth_chainId" });
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
  }, []);

  // Listen for Account or Network changes
  useEffect(() => {
    if (!(window as any).ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        updateWalletInfo(accounts[0]);
      } else {
        disconnect();
      }
    };

    const handleChainChanged = () => window.location.reload();

    (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
    (window as any).ethereum.on("chainChanged", handleChainChanged);

    return () => {
      (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
      (window as any).ethereum.removeListener("chainChanged", handleChainChanged);
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
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};