import { ethers } from "ethers";
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
    return new ethers.Contract(CROWD_QUEST_ADDRESS, CrowdQuestABI.abi, signer);
  };

  /**
   * CREATE VIRTUAL QUEST
   * Matches Solidity: createVirtualTreasure(uint256 stake, bytes32 hash, string[] hints, uint256[] turns)
   */
  const createVirtualQuest = async (stake: string, x: number, y: number, hints: string[]) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");

    // 1. Hash the X, Y coordinates to create the hidden 'answer'
    const answerHash = ethers.solidityPackedKeccak256(
      ["uint256", "uint256"],
      [BigInt(x), BigInt(y)]
    );

    // 2. Prepare release turns (e.g., release a hint every 10 turns)
    const releaseTurns = hints.map((_, index) => BigInt((index + 1) * 10));

    // 3. Clean hints array
    const cleanHints = hints.filter(h => h.trim() !== "");

    try {
      const tx = await contract.createVirtualTreasure(
        ethers.parseEther(stake),
        answerHash,
        cleanHints,
        releaseTurns
      );
      return await tx.wait();
    } catch (error: any) {
      console.error("Virtual deployment failed:", error);
      throw error;
    }
  };

  /**
   * CREATE REAL WORLD QUEST
   * Matches Solidity: createRealTreasure(uint256 stake, bytes32 hash, string uri)
   */
  const createRealWorldQuest = async (stake: string, hints: string[]) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not initialized");

    // Since Real World uses a secret string instead of coordinates
    const secret = hints[0] || "default_secret";
    const hash = ethers.keccak256(ethers.toUtf8Bytes(secret));

    try {
      const tx = await contract.createRealTreasure(
        ethers.parseEther(stake),
        hash,
        "ipfs://placeholder" // Placeholder for the URI required by your .sol
      );
      return await tx.wait();
    } catch (error) {
      console.error("Real world deployment failed:", error);
      throw error;
    }
  };

  /**
   * FETCH ACTIVE QUESTS
   */
  const getActiveQuests = async () => {
    const contract = await getContract();
    if (!contract) return [];

    try {
      const activeQuests = [];
      const startId = 10000;
      
      for (let i = startId; i < startId + 15; i++) {
        try {
          const q = await contract.virtualTreasures(i);
          if (q.creator !== ethers.ZeroAddress && !q.found) {
            activeQuests.push({
              id: i.toString(),
              creator: q.creator,
              reward: ethers.formatEther(q.stake),
              found: q.found,
            });
          }
        } catch (e) {
          break; 
        }
      }
      return activeQuests;
    } catch (err) {
      console.error("Failed to fetch quests:", err);
      return [];
    }
  };

  /**
   * SUBMIT VIRTUAL GUESS
   * Redirects to the TurnManager contract as required by your architecture
   */
  const submitVirtualGuess = async (questId: string, x: number, y: number) => {
    const contract = await getContract();
    if (!contract) throw new Error("Wallet not connected");

    const turnManagerAddress = await contract.turnManager();
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const turnManager = new ethers.Contract(turnManagerAddress, TurnMangerABI.abi, signer);

    try {
      const tx = await turnManager.submitGuess(BigInt(questId), BigInt(x), BigInt(y));
      return await tx.wait();
    } catch (error) {
      console.error("Virtual guess failed:", error);
      throw error;
    }
  };

  const claimRealTreasure = async (id: string, secret: string) => {
    const contract = await getContract();
    if (!contract) throw new Error("Contract not found");
    const tx = await contract.claimRealTreasure(BigInt(id), secret);
    return await tx.wait();
  };

  return { 
    getActiveQuests, 
    claimRealTreasure,
    createVirtualQuest,
    createRealWorldQuest,
    submitVirtualGuess
  };
};