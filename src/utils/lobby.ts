// src/types/lobby.ts
export interface PlayerGameConfig {
  playerAddress: string;
  playerUsername: string;
  hasSubmitted: boolean;
  selectedCell?: { x: number; y: number };
  hints: string[];
  stakeAmount?: string;
}

export interface GameLobby {
  gameId: string;
  creator: string;
  players: PlayerGameConfig[];
  status: "waiting" | "ready" | "active";
  createdAt: number;
  gameMode: "virtual" | "offline"; // Add this field
}