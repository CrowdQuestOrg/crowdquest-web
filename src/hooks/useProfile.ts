import { useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import { PROFILE_MANAGER_ADDRESS } from "../constants/contracts";

// Added getAddressByUsername to the ABI so the frontend can check availability
const PROFILE_MANAGER_ABI = [
  "function getProfile(address player) external view returns (tuple(address wallet, string username, bool exists, uint256 createdAt, tuple(uint256 totalTreasuresCreated, uint256 totalTreasuresFound, uint256 totalStaked, uint256 totalEarned, uint256 netEarnings, uint256 totalTurnsPlayed, uint256 totalGuessesMade, uint256 correctGuesses, uint256 lastActiveTimestamp) globalStats, tuple(uint256 treasuresCreated, uint256 treasuresFound, uint256 fastestFindSeconds, uint256 totalDistanceTraveled, uint256 qrScansCompleted) realWorldStats, tuple(uint256 treasuresCreated, uint256 treasuresFound, uint256 turnsPlayed, uint256 guessesMade, uint256 correctGuesses, uint256 accuracyBasisPoints, uint256 longestTurnStreak, uint256 currentTurnStreak) virtualStats, uint256[] earnedAchievements))",
  "function createProfile(string username) external",
  "function profileExists(address player) external view returns (bool)",
  "function getAddressByUsername(string username) external view returns (address)" // ADDED THIS
];

export const useProfile = () => {
  const { provider, signer } = useWallet();

  const getStats = useCallback(async (address: string) => {
    if (!provider || !address) return null;

    try {
      const contract = new ethers.Contract(
        PROFILE_MANAGER_ADDRESS,
        PROFILE_MANAGER_ABI,
        provider
      );

      const profile = await contract.getProfile(address);

      return {
        username: profile.username,
        // Using formatEther is safer here since your contract uses 10^18 (ether)
        totalEarned: ethers.formatEther(profile.globalStats.totalEarned),
        questsCompleted: Number(profile.globalStats.totalTreasuresFound),
        questsCreated: Number(profile.globalStats.totalTreasuresCreated),
        accuracy: Number(profile.virtualStats.guessesMade) > 0 
          ? `${(Number(profile.virtualStats.accuracyBasisPoints) / 100).toFixed(1)}%` 
          : "0%"
      };
    } catch (error: any) {
      // Catching the specific 'Profile__NotFound' error
      return null;
    }
  }, [provider]);

  /**
   * NEW: Check if a username is already taken before the user pays gas
   */
  const getAddressByUsername = useCallback(async (username: string) => {
    if (!provider) return null;
    try {
      const contract = new ethers.Contract(
        PROFILE_MANAGER_ADDRESS,
        PROFILE_MANAGER_ABI,
        provider
      );
      return await contract.getAddressByUsername(username);
    } catch (error) {
      return null; 
    }
  }, [provider]);

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

  // Make sure to export getAddressByUsername here!
  return { getStats, createProfile, getAddressByUsername };
};