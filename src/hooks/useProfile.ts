import { useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import { PROFILE_MANAGER_ADDRESS } from "../constants/contracts";

// The ABI must match the Structs in ProfileTypes.sol exactly
const PROFILE_MANAGER_ABI = [
  "function getProfile(address player) external view returns (tuple(address wallet, string username, bool exists, uint256 createdAt, tuple(uint256 totalTreasuresCreated, uint256 totalTreasuresFound, uint256 totalStaked, uint256 totalEarned, uint256 netEarnings, uint256 totalTurnsPlayed, uint256 totalGuessesMade, uint256 correctGuesses, uint256 lastActiveTimestamp) globalStats, tuple(uint256 treasuresCreated, uint256 treasuresFound, uint256 fastestFindSeconds, uint256 totalDistanceTraveled, uint256 qrScansCompleted) realWorldStats, tuple(uint256 treasuresCreated, uint256 treasuresFound, uint256 turnsPlayed, uint256 guessesMade, uint256 correctGuesses, uint256 accuracyBasisPoints, uint256 longestTurnStreak, uint256 currentTurnStreak) virtualStats, uint256[] earnedAchievements))",
  "function createProfile(string username) external",
  "function profileExists(address player) external view returns (bool)"
];

export const useProfile = () => {
  const { provider, signer } = useWallet();

  /**
   * Fetches the full profile and maps it to the flat object 
   * your ProfilePage.tsx expects.
   */
  const getStats = useCallback(async (address: string) => {
    if (!provider || !address) return null;

    try {
      const contract = new ethers.Contract(
        PROFILE_MANAGER_ADDRESS,
        PROFILE_MANAGER_ABI,
        provider
      );

      // Call the getter from Person 3's ProfileManager.sol
      const profile = await contract.getProfile(address);

      // Map the deep contract struct to your UI's flat stats state
      return {
        username: profile.username,
        totalEarned: ethers.formatUnits(profile.globalStats.totalEarned, 18),
        questsCompleted: Number(profile.globalStats.totalTreasuresFound),
        questsCreated: Number(profile.globalStats.totalTreasuresCreated),
        // Additional data available if you want to use it later:
        accuracy: profile.virtualStats.guessesMade > 0 
          ? `${(Number(profile.virtualStats.accuracyBasisPoints) / 100).toFixed(1)}%` 
          : "0%"
      };
    } catch (error: any) {
      // If the error contains 'Profile__NotFound', the user needs to register
      if (error.message.includes("Profile__NotFound") || error.data?.includes("0x")) {
        console.warn("User profile not found on-chain. Registration required.");
      } else {
        console.error("Error fetching profile:", error);
      }
      return null;
    }
  }, [provider]);

  /**
   * Allows the user to register their username on the blockchain.
   */
  const createProfile = useCallback(async (username: string) => {
    if (!signer) throw new Error("Wallet not connected");

    const contract = new ethers.Contract(
      PROFILE_MANAGER_ADDRESS,
      PROFILE_MANAGER_ABI,
      signer
    );

    const tx = await contract.createProfile(username);
    return await tx.wait();
  }, [signer]);

  return { getStats, createProfile };
};