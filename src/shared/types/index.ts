// src/shared/types/index.ts
export interface PlayerProfile {
  address: string;
  totalCreated: number;
  totalFound: number;
  totalEarned: number;
  totalStaked: number;
  netEarnings: number;
  rwCreated: number;
  rwFound: number;
  fastestFind: number | null;
  virtualCreated: number;
  virtualFound: number;
  turnsPlayed: number;
  guessesMade: number;
  accuracy: number;
  achievements: Achievement[];
  rank: number;
  rating: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedAt: Date;
  icon: string;
}

export interface VirtualTreasure {
  id: string;
  creator: string;
  stake: number;
  found: boolean;
  finder?: string;
  answerHash: string;
  hints: string[];
  currentTurn: number;
  x: number;
  y: number;
}

export interface RealWorldTreasure {
  id: string;
  creator: string;
  stake: number;
  found: boolean;
  finder?: string;
  createdAt: Date;
  qrCode: string;
}

export interface GameState {
  activeTreasures: VirtualTreasure[];
  currentTurn: number;
  players: string[];
  guesses: Map<string, { x: number; y: number }>;
  turnEndTime: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}