// import { ethers } from "ethers";
// import { useWallet } from "../contexts/WalletContext";
// import { PROFILE_MANAGER_ADDRESS } from "../constants/contracts";
// import ProfileABI from "../abis/ProfileManager.json";

// export const useProfile = () => {
//   const { address } = useWallet();

//   const getContract = async () => {
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     return new ethers.Contract(PROFILE_MANAGER_ADDRESS, ProfileABI.abi, provider);
//   };

//   const getStats = async () => {
//     if (!address) return null;
//     const contract = await getContract();
//     // Replace 'getPlayerStats' with the actual function name in your Solidity
//     const stats = await contract.getPlayerStats(address); 
//     return {
//       score: stats.score.toString(),
//       foundCount: stats.foundCount.toString(),
//       createdCount: stats.createdCount.toString(),
//     };
//   };

//   return { getStats };
// };


import { ethers, getAddress } from "ethers";
import { PROFILE_MANAGER_ADDRESS } from "../constants/contracts";
import ProfileABI from "../abis/ProfileManager.json";

export const useProfile = () => {
  const getContract = async () => {
    if (!(window as any).ethereum) return null;
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(PROFILE_MANAGER_ADDRESS, ProfileABI.abi, signer);
  };

  const getStats = async (address: string) => {
    try {
      const contract = await getContract();
      if (!contract) return null;

      // FIX: Ensure the function name 'getPlayerStats' matches your Solidity contract exactly
      // If your contract uses 'players(address)', use contract.players(address)
      const stats = await contract.getPlayerStats(getAddress(address)); 
      
      return {
        username: stats.username,
        questsCreated: Number(stats.questsCreated),
        questsCompleted: Number(stats.questsCompleted),
        totalEarned: ethers.formatEther(stats.totalEarned),
      };
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      throw error;
    }
  };

  return { getStats };
};