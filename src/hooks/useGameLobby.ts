// src/hooks/useGameLobby.ts
import { useState, useCallback } from "react";
import { useWallet } from "../contexts/WalletContext";
import { useProfile } from "./useProfile";
import type { PlayerGameConfig, GameLobby } from "../utils/lobby";

export const useGameLobby = () => {
  const { address } = useWallet();
  const { getAddressByUsername } = useProfile();
  
  const [activeLobby, setActiveLobby] = useState<GameLobby | null>(null);
  const [invitedLobbies, setInvitedLobbies] = useState<GameLobby[]>([]);

  // Create a new lobby
  const createLobby = useCallback(async (
    gameMode: "virtual" | "offline",
    stakeAmount: string,
    invitedUsernames: string[]
  ) => {
    const invitedAddresses = await Promise.all(
      invitedUsernames.map(async (username) => {
        const addr = await getAddressByUsername(username);
        return { address: addr, username: username };
      })
    );

    const lobby: GameLobby = {
      gameId: `${Date.now()}_${address}`,
      creator: address!,
      gameMode: gameMode,
      players: [
        // Creator's config (will be set separately)
        {
          playerAddress: address!,
          playerUsername: "Creator",
          hasSubmitted: false,
          hints: [], // Initialize empty hints array
        },
        // Invited players
        ...invitedAddresses.map(invited => ({
          playerAddress: invited.address,
          playerUsername: invited.username,
          hasSubmitted: false,
          hints: [], // Initialize empty hints array
        }))
      ],
      status: "waiting",
      createdAt: Date.now(),
    };

    // Store in localStorage for persistence
    const existingLobbies = JSON.parse(localStorage.getItem("gameLobbies") || "[]");
    existingLobbies.push(lobby);
    localStorage.setItem("gameLobbies", JSON.stringify(existingLobbies));
    
    setActiveLobby(lobby);
    return lobby;
  }, [address, getAddressByUsername]);

  // Get lobbies where current user is invited
  const getInvitedLobbies = useCallback(() => {
    const allLobbies: GameLobby[] = JSON.parse(localStorage.getItem("gameLobbies") || "[]");
    const userLobbies = allLobbies.filter(lobby => 
      lobby.players.some(p => p.playerAddress === address) &&
      lobby.status === "waiting"
    );
    setInvitedLobbies(userLobbies);
    return userLobbies;
  }, [address]);

  // Submit player's game configuration
  const submitPlayerConfig = useCallback(async (
    lobbyId: string,
    config: Partial<PlayerGameConfig>
  ) => {
    const allLobbies: GameLobby[] = JSON.parse(localStorage.getItem("gameLobbies") || "[]");
    const lobbyIndex = allLobbies.findIndex(l => l.gameId === lobbyId);
    
    if (lobbyIndex === -1) return false;
    
    const lobby = allLobbies[lobbyIndex];
    const playerIndex = lobby.players.findIndex(p => p.playerAddress === address);
    
    if (playerIndex === -1) return false;
    
    // Update player config
    lobby.players[playerIndex] = {
      ...lobby.players[playerIndex],
      ...config,
      hasSubmitted: true
    };
    
    // Check if all players have submitted
    const allSubmitted = lobby.players.every(p => p.hasSubmitted);
    
    if (allSubmitted) {
      lobby.status = "ready";
    }
    
    allLobbies[lobbyIndex] = lobby;
    localStorage.setItem("gameLobbies", JSON.stringify(allLobbies));
    
    if (activeLobby?.gameId === lobbyId) {
      setActiveLobby(lobby);
    }
    
    return true;
  }, [address, activeLobby]);

  // Start the game
  const startGame = useCallback(async (
    lobbyId: string,
    _deployGameFn: (config: any) => Promise<any>
  ) => {
    const allLobbies: GameLobby[] = JSON.parse(localStorage.getItem("gameLobbies") || "[]");
    const lobby = allLobbies.find(l => l.gameId === lobbyId);
    
    if (!lobby || lobby.status !== "ready") {
      throw new Error("Game not ready to start");
    }
    
    // Mark as active
    lobby.status = "active";
    const updatedLobbies = allLobbies.map(l => 
      l.gameId === lobbyId ? lobby : l
    );
    localStorage.setItem("gameLobbies", JSON.stringify(updatedLobbies));
    
    return lobby;
  }, []);

  return {
    activeLobby,
    invitedLobbies,
    createLobby,
    getInvitedLobbies,
    submitPlayerConfig,
    startGame,
  };
};