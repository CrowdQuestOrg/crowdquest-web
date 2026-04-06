// // import { ethers } from "ethers";
// // import { useWallet } from "../contexts/WalletContext";
// // import { CROWD_QUEST_ADDRESS } from "../constants/contracts";
// // import CrowdQuestABI from "../abis/CrowdQuest.json";
// // import TurnMangerABI from "../abis/TurnManager.json";
// // import { useGameLobby } from "../hooks/useGameLobby";
// // import { LobbyStatus } from "../components/LobbyStatus";

// import { ethers } from "ethers";
// import { useWallet } from "../contexts/WalletContext";
// import { CROWD_QUEST_ADDRESS } from "../constants/contracts";
// import CrowdQuestABI from "../abis/CrowdQuest.json";
// import TurnMangerABI from "../abis/TurnManager.json";

// export const useCrowdQuest = () => {
//   const { address } = useWallet();

// export const useCrowdQuest = () => {
//   const { address } = useWallet();

//   const getContract = async () => {
//     if (!(window as any).ethereum) return null;
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     const signer = await provider.getSigner();
//     return new ethers.Contract(CROWD_QUEST_ADDRESS, CrowdQuestABI.abi, signer);
//   };

//   /**
//    * CREATE VIRTUAL QUEST
//    * Matches Solidity: createVirtualTreasure(uint256 stake, bytes32 hash, string[] hints, uint256[] turns)
//    */
//   const createVirtualQuest = async (stake: string, x: number, y: number, hints: string[]) => {
//     const contract = await getContract();
//     if (!contract) throw new Error("Contract not initialized");

//     // 1. Hash the X, Y coordinates to create the hidden 'answer'
//     const answerHash = ethers.solidityPackedKeccak256(
//       ["uint256", "uint256"],
//       [BigInt(x), BigInt(y)]
//     );

//     // 2. Prepare release turns (e.g., release a hint every 10 turns)
//     const releaseTurns = hints.map((_, index) => BigInt((index + 1) * 10));

//     // 3. Clean hints array
//     const cleanHints = hints.filter(h => h.trim() !== "");

//     try {
//       const tx = await contract.createVirtualTreasure(
//         ethers.parseEther(stake),
//         answerHash,
//         cleanHints,
//         releaseTurns
//       );
//       return await tx.wait();
//     } catch (error: any) {
//       console.error("Virtual deployment failed:", error);
//       throw error;
//     }
//   };

//   /**
//    * CREATE REAL WORLD QUEST
//    * Matches Solidity: createRealTreasure(uint256 stake, bytes32 hash, string uri)
//    */
//   const createRealWorldQuest = async (stake: string, hints: string[]) => {
//     const contract = await getContract();
//     if (!contract) throw new Error("Contract not initialized");

//     // Since Real World uses a secret string instead of coordinates
//     const secret = hints[0] || "default_secret";
//     const hash = ethers.keccak256(ethers.toUtf8Bytes(secret));

//     try {
//       const tx = await contract.createRealTreasure(
//         ethers.parseEther(stake),
//         hash,
//         "ipfs://placeholder" // Placeholder for the URI required by your .sol
//       );
//       return await tx.wait();
//     } catch (error) {
//       console.error("Real world deployment failed:", error);
//       throw error;
//     }
//   };

//   /**
//    * FETCH ACTIVE QUESTS
//    */
//   const getActiveQuests = async () => {
//     const contract = await getContract();
//     if (!contract) return [];

//     try {
//       const activeQuests = [];
//       const startId = 10000;
      
//       for (let i = startId; i < startId + 15; i++) {
//         try {
//           const q = await contract.virtualTreasures(i);
//           if (q.creator !== ethers.ZeroAddress && !q.found) {
//             activeQuests.push({
//               id: i.toString(),
//               creator: q.creator,
//               reward: ethers.formatEther(q.stake),
//               found: q.found,
//             });
//           }
//         } catch (e) {
//           break; 
//         }
//       }
//       return activeQuests;
//     } catch (err) {
//       console.error("Failed to fetch quests:", err);
//       return [];
//     }
//   };

//   /**
//    * SUBMIT VIRTUAL GUESS
//    * Redirects to the TurnManager contract as required by your architecture
//    */
//   const submitVirtualGuess = async (questId: string, x: number, y: number) => {
//     const contract = await getContract();
//     if (!contract) throw new Error("Wallet not connected");

//     const turnManagerAddress = await contract.turnManager();
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     const signer = await provider.getSigner();
//     const turnManager = new ethers.Contract(turnManagerAddress, TurnMangerABI.abi, signer);

//     try {
//       const tx = await turnManager.submitGuess(BigInt(questId), BigInt(x), BigInt(y));
//       return await tx.wait();
//     } catch (error) {
//       console.error("Virtual guess failed:", error);
//       throw error;
//     }
//   };

//   const claimRealTreasure = async (id: string, secret: string) => {
//     const contract = await getContract();
//     if (!contract) throw new Error("Contract not found");
//     const tx = await contract.claimRealTreasure(BigInt(id), secret);
//     return await tx.wait();
//   };
//   // Add these to your useCrowdQuest.ts return object

//   const getJoinedGames = async () => {
//     const contract = await getContract();
//     if (!contract || !address) return [];

//     const turnManagerAddr = await contract.turnManager();
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     const turnManager = new ethers.Contract(turnManagerAddr, TurnMangerABI.abi, provider);

//     try {
//       const joinedQuests = [];
//       // Scan range (In a real app, you'd use Events/Indexing here)
//       for (let i = 10000; i < 10010; i++) {
//         const isParticipant = await turnManager.isPlayerInGame(i, address);
//         if (isParticipant) {
//           const q = await contract.virtualTreasures(i);
//           const currentTurnPlayer = await turnManager.getCurrentPlayer(i);
//           const turnNum = await turnManager.getCurrentTurnNumber(i);

//           joinedQuests.push({
//             id: i.toString(),
//             reward: ethers.formatEther(q.stake),
//             isMyTurn: currentTurnPlayer.toLowerCase() === address.toLowerCase(),
//             currentTester: currentTurnPlayer,
//             turnNumber: turnNum.toString(),
//             hints: q.hints
//           });
//         }
//       }
//       return joinedQuests;
//     } catch (e) {
//       console.error("Lobby fetch failed", e);
//       return [];
//     }
//   };
//     // Add these to your useCrowdQuest return object
//   const getMyTurnGames = async () => {
//     const contract = await getContract();
//     if (!contract || !address) return [];

//     try {
//       // 1. Get TurnManager Instance
//       const turnManagerAddr = await contract.turnManager();
//       const provider = new ethers.BrowserProvider((window as any).ethereum);
//       const turnManager = new ethers.Contract(turnManagerAddr, TurnMangerABI.abi, provider);

//       const activeGames = [];
//       // Note: In production, you'd use a Subgraph or Events. 
//       // For now, we scan the last 10 IDs starting from 10000
//       for (let i = 10000; i < 10010; i++) {
//         try {
//           // Check if the current user is in the player list for this quest
//           const isPlayer = await turnManager.isPlayerInGame(i, address);
          
//           if (isPlayer) {
//             const quest = await contract.virtualTreasures(i);
//             const currentPlayer = await turnManager.getCurrentPlayer(i);
//             const turnNumber = await turnManager.getCurrentTurnNumber(i);

//             activeGames.push({
//               id: i.toString(),
//               stake: ethers.formatEther(quest.stake),
//               currentPlayer: currentPlayer,
//               isMyTurn: currentPlayer.toLowerCase() === address.toLowerCase(),
//               turnNumber: turnNumber.toString(),
//               hints: quest.hints,
//               isFound: quest.found
//             });
//           }
//         } catch (e) { continue; }
//       }
//       return activeGames;
//     } catch (err) {
//       console.error("Lobby sync failed:", err);
//       return [];
//     }
//   };

//   return { 
//     getMyTurnGames,
//     getJoinedGames,
//     getActiveQuests, 
//     claimRealTreasure,
//     createVirtualQuest,
//     createRealWorldQuest,
//     submitVirtualGuess
//   };
// };
// }



// src/hooks/useCrowdQuest.ts
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

  const getJoinedGames = async () => {
    const contract = await getContract();
    if (!contract || !address) return [];

    const turnManagerAddr = await contract.turnManager();
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const turnManager = new ethers.Contract(turnManagerAddr, TurnMangerABI.abi, provider);

    try {
      const joinedQuests = [];
      // Scan range (In a real app, you'd use Events/Indexing here)
      for (let i = 10000; i < 10010; i++) {
        const isParticipant = await turnManager.isPlayerInGame(i, address);
        if (isParticipant) {
          const q = await contract.virtualTreasures(i);
          const currentTurnPlayer = await turnManager.getCurrentPlayer(i);
          const turnNum = await turnManager.getCurrentTurnNumber(i);

          joinedQuests.push({
            id: i.toString(),
            reward: ethers.formatEther(q.stake),
            isMyTurn: currentTurnPlayer.toLowerCase() === address.toLowerCase(),
            currentTester: currentTurnPlayer,
            turnNumber: turnNum.toString(),
            hints: q.hints
          });
        }
      }
      return joinedQuests;
    } catch (e) {
      console.error("Lobby fetch failed", e);
      return [];
    }
  };

  const getMyTurnGames = async () => {
    const contract = await getContract();
    if (!contract || !address) return [];

    try {
      const turnManagerAddr = await contract.turnManager();
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const turnManager = new ethers.Contract(turnManagerAddr, TurnMangerABI.abi, provider);

      const activeGames = [];
      for (let i = 10000; i < 10010; i++) {
        try {
          const isPlayer = await turnManager.isPlayerInGame(i, address);
          
          if (isPlayer) {
            const quest = await contract.virtualTreasures(i);
            const currentPlayer = await turnManager.getCurrentPlayer(i);
            const turnNumber = await turnManager.getCurrentTurnNumber(i);

            activeGames.push({
              id: i.toString(),
              stake: ethers.formatEther(quest.stake),
              currentPlayer: currentPlayer,
              isMyTurn: currentPlayer.toLowerCase() === address.toLowerCase(),
              turnNumber: turnNumber.toString(),
              hints: quest.hints,
              isFound: quest.found
            });
          }
        } catch (e) { continue; }
      }
      return activeGames;
    } catch (err) {
      console.error("Lobby sync failed:", err);
      return [];
    }
  };

  return { 
    getMyTurnGames,
    getJoinedGames,
    getActiveQuests, 
    claimRealTreasure,
    createVirtualQuest,
    createRealWorldQuest,
    submitVirtualGuess
  };
};