import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import { PROFILE_MANAGER_ADDRESS } from "../constants/contracts";
import ProfileABI from "../abis/ProfileManager.json";

export const useProfile = () => {
  const { address } = useWallet();

  const getContract = async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    return new ethers.Contract(PROFILE_MANAGER_ADDRESS, ProfileABI.abi, provider);
  };

  const getStats = async () => {
    if (!address) return null;
    const contract = await getContract();
    // Replace 'getPlayerStats' with the actual function name in your Solidity
    const stats = await contract.getPlayerStats(address); 
    return {
      score: stats.score.toString(),
      foundCount: stats.foundCount.toString(),
      createdCount: stats.createdCount.toString(),
    };
  };

  return { getStats };
};