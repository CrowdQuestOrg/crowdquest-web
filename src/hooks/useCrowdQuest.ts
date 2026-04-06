import { ethers, Contract } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import { CROWD_QUEST_ADDRESS } from "../constants/contracts";
import CrowdQuestABI from "../abis/CrowdQuest.json";
import TurnMangerABI from "../abis/TurnManager.json";

export const useCrowdQuest = () => {
  const { address } = useWallet();

  const getContract = async () => {
    if (!(window as any).ethereum) return null;
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CROWD_QUEST_ADDRESS, CrowdQuestABI.abi, signer) as any; 
  };

  // --- PERSON 3 TASK (Keep this so the app doesn't break) ---
  const createQuest = async (name: string, reward: number) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const tx = await contract.createQuest(name, ethers.parseEther(reward.toString()));
      return await tx.wait();
    } catch (error) {
      console.error("Execution reverted:", error);
      throw error;
    }
  };

  const getActiveQuests = async () => {
    const contract = await getContract();
    if (!contract) return [];

    try {
      const activeQuests = [];
      // Your contract starts virtual IDs at 10,000
      const startId = 10000;
      
      // We check the next 20 IDs to see if they've been created yet
      for (let i = startId; i < startId + 20; i++) {
        try {
          const q = await contract.virtualTreasures(i);
          
          // In Solidity, a non-existent mapping entry returns 0x0... address
          // We only want treasures that are NOT found yet
          if (q.creator !== "0x0000000000000000000000000000000000000000" && !q.found) {
            
            // IMPORTANT: Mappings don't return arrays automatically in Ethers v6
            // If your contract doesn't have a 'getHints' function, we might need a workaround
            // For now, let's assume we fetch the basic info:
            activeQuests.push({
              id: i.toString(),
              creator: q.creator,
              reward: ethers.formatEther(q.stake),
              found: q.found,
              // Note: hints might return empty here because it's a dynamic array in a struct
            });
          }
        } catch (e) {
          // If an ID doesn't exist, the call might revert; we just stop looping
          break;
        }
      }
      return activeQuests;
    } catch (err) {
      console.error("Failed to fetch quests:", err);
      return [];
    }
  };

  const submitVirtualGuess = async (questId: string, x: number, y: number) => {
    const contract = await getContract();
    if (!contract) throw new Error("Wallet not connected");

    // 1. Get the TurnManager address from the main contract
    const turnManagerAddress = await contract.turnManager();
    
    // 2. We need the TurnManager ABI (Ask Person 1 for this!)
    // For now, we assume a standard 'submitGuess' function exists there
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    
    // You'll need to import TurnManagerABI at the top of your file
    const turnManager = new ethers.Contract(turnManagerAddress, TurnMangerABI.abi, signer);

    try {
      // This is the actual blockchain call
      const tx = await turnManager.submitGuess(questId, x, y);
      return await tx.wait();
    } catch (error) {
      console.error("Virtual guess failed:", error);
      throw error;
    }
  };

  const claimRealTreasure = async (id: string, secret: string) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not found");

    try {
      const tx = await contract.claimRealTreasure(id, secret);
      return await tx.wait();
    } catch (error) {
      console.error("Claim failed:", error);
      throw error;
    }
  };

  const submitGuess = async (questId: string, x: number, y: number) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const tx = await contract.submitGuess(questId, x, y);
      return await tx.wait();
    } catch (error) {
      console.error("Guess failed:", error);
      throw error;
    }
  };

  // CRITICAL: Everything you want to use in your Pages MUST be in this object
  return { 
    createQuest, 
    getActiveQuests, 
    submitGuess,
    claimRealTreasure,
  };
};