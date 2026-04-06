import { ethers, Contract } from "ethers"; // Import Contract
import { useWallet } from "../contexts/WalletContext";
import { CROWD_QUEST_ADDRESS } from "../constants/contracts";
import CrowdQuestABI from "../abis/CrowdQuest.json";

export const useCrowdQuest = () => {
  const { address } = useWallet();

  const getContract = async () => {
    if (!(window as any).ethereum) return null;
    
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    
    // Type-cast here to 'any' to bypass the BaseContract restriction
    return new ethers.Contract(
      CROWD_QUEST_ADDRESS, 
      CrowdQuestABI.abi, 
      signer
    ) as any; 
  };

  const createQuest = async (name: string, reward: number) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      // Now TS won't complain because we cast the contract to 'any'
      const tx = await contract.createQuest(
        name, 
        ethers.parseEther(reward.toString())
      );
      
      console.log("Transaction sent:", tx.hash);
      return await tx.wait();
    } catch (error) {
      console.error("Execution reverted:", error);
      throw error;
    }
  };

  return { createQuest };
};