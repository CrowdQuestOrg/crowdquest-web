// src/store/walletStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';

interface WalletState {
  // State
  isConnected: boolean;
  isRegistered: boolean;
  address: string | null;
  balance: string;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  error: string | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  register: () => Promise<void>;
  checkRegistration: (address: string) => Promise<boolean>;
  switchNetwork: () => Promise<void>;
  clearError: () => void;
}

// Store user registrations in localStorage (temp until contract is ready)
const getRegisteredUsers = (): string[] => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

const addRegisteredUser = (address: string) => {
  const users = getRegisteredUsers();
  if (!users.includes(address)) {
    users.push(address);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      isRegistered: false,
      address: null,
      balance: '0',
      chainId: null,
      provider: null,
      signer: null,
      error: null,

      connect: async () => {
        try {
          // Check if MetaMask is installed
          if (!window.ethereum) {
            throw new Error('Please install MetaMask!');
          }

          // Request account access
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          const address = accounts[0];
          
          // Setup provider and signer
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          
          // Get balance
          const balance = await provider.getBalance(address);
          const balanceInEth = ethers.formatEther(balance);
          
          // Get chain ID
          const network = await provider.getNetwork();
          const chainId = Number(network.chainId);
          
          // Check if user is registered
          const isRegistered = getRegisteredUsers().includes(address);
          
          set({
            isConnected: true,
            isRegistered,
            address,
            balance: parseFloat(balanceInEth).toFixed(4),
            chainId,
            provider,
            signer,
            error: null,
          });
          
          // Setup event listeners
          window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
            if (newAccounts.length === 0) {
              get().disconnect();
            } else {
              get().connect();
            }
          });
          
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
          
        } catch (error: any) {
          console.error('Failed to connect wallet:', error);
          set({ error: error.message });
        }
      },

      disconnect: () => {
        set({
          isConnected: false,
          isRegistered: false,
          address: null,
          balance: '0',
          chainId: null,
          provider: null,
          signer: null,
          error: null,
        });
      },

      register: async () => {
        const { address, signer, isRegistered } = get();
        
        if (!address || !signer) {
          throw new Error('Wallet not connected');
        }
        
        if (isRegistered) {
          throw new Error('Wallet already registered');
        }
        
        try {
          // For now, just store in localStorage
          // Later this will be a smart contract call
          addRegisteredUser(address);
          
          // Simulate signing a registration message
          const message = `Welcome to CrowdQuest!\n\nRegister your wallet: ${address}\n\nTimestamp: ${Date.now()}`;
          const signature = await signer.signMessage(message);
          
          // Store signature for verification (temporary)
          localStorage.setItem(`sig_${address}`, signature);
          
          set({ isRegistered: true, error: null });
          
          return true;
        } catch (error: any) {
          console.error('Registration failed:', error);
          set({ error: error.message });
          throw error;
        }
      },

      checkRegistration: async (address: string) => {
        // Check if user is registered (from localStorage for now)
        const isRegistered = getRegisteredUsers().includes(address);
        set({ isRegistered });
        return isRegistered;
      },

      switchNetwork: async () => {
        try {
          // Switch to Polygon network (or your preferred network)
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // Polygon Mainnet
          });
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com'],
              }],
            });
          } else {
            throw switchError;
          }
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'crowdquest-wallet', // localStorage key
      partialize: (state) => ({ 
        isRegistered: state.isRegistered,
        address: state.address 
      }), // Only persist these fields
    }
  )
);