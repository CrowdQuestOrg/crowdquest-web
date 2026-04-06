// src/components/LobbyStatus.tsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import type { GameLobby } from "../utils/lobby";
import { useGameLobby } from "../hooks/useGameLobby";
import { useCrowdQuest } from "../hooks/useCrowdQuest";
import { CheckCircle2, Copy, Share2, Loader2, X } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useWallet } from "../contexts/WalletContext";

interface LobbyStatusProps {
  lobby: GameLobby;
  onGameStart: () => void;
  onClose?: () => void;
}

export const LobbyStatus = ({ lobby, onGameStart, onClose }: LobbyStatusProps) => {
  const { startGame } = useGameLobby();
  const { createVirtualQuest, createRealWorldQuest } = useCrowdQuest();
  const { address } = useWallet();
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const allReady = lobby.players.every(p => p.hasSubmitted);
  const isCreator = lobby.creator === address;
  
  // Check if current user has submitted their config
  const currentPlayer = lobby.players.find(p => p.playerAddress === address);
  const hasUserSubmitted = currentPlayer?.hasSubmitted || false;
  
  const handleStartGame = async () => {
    setIsStarting(true);
    try {
      // Deploy all player treasures to blockchain
      for (const player of lobby.players) {
        if (player.selectedCell && player.hints.length > 0 && player.stakeAmount) {
          if (lobby.gameMode === "virtual") {
            await createVirtualQuest(
              player.stakeAmount,
              player.selectedCell.x,
              player.selectedCell.y,
              player.hints
            );
          } else {
            await createRealWorldQuest(player.stakeAmount, player.hints);
          }
        }
      }
      
      await startGame(lobby.gameId, async () => {});
      toast({ 
        title: "Game Started!", 
        description: "All treasures have been deployed to the blockchain" 
      });
      onGameStart();
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to start game", 
        variant: "destructive" 
      });
    } finally {
      setIsStarting(false);
    }
  };
  
  const copyInviteLink = () => {
    const link = `${window.location.origin}/lobby/${lobby.gameId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Copied!", description: "Invite link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Auto-refresh lobby status every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render by checking localStorage
      const lobbies = JSON.parse(localStorage.getItem("gameLobbies") || "[]");
      const updatedLobby = lobbies.find((l: GameLobby) => l.gameId === lobby.gameId);
      if (updatedLobby && updatedLobby.status === "active") {
        onGameStart();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [lobby.gameId, onGameStart]);
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-display text-2xl font-bold">Game Lobby</h2>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="space-y-4 mb-6">
          {/* Invite Link Section */}
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-sm font-mono mb-2 flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Invite Code:
            </p>
            <div className="flex gap-2">
              <code className="flex-1 bg-background rounded px-3 py-2 text-xs font-mono break-all">
                {window.location.origin}/lobby/{lobby.gameId.slice(-8)}
              </code>
              <Button size="sm" variant="outline" onClick={copyInviteLink}>
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Share this link with invited players so they can configure their treasures
            </p>
          </div>
          
          {/* Players List */}
          <div className="space-y-2">
            <p className="text-sm font-mono">
              Players ({lobby.players.filter(p => p.hasSubmitted).length}/{lobby.players.length}):
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {lobby.players.map((player) => (
                <div 
                  key={player.playerAddress} 
                  className={`flex justify-between items-center p-3 rounded-lg transition-all ${
                    player.hasSubmitted ? "bg-green-500/10 border border-green-500/20" : "bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${player.hasSubmitted ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
                    <span className="text-sm font-medium">
                      {player.playerUsername}
                      {player.playerAddress === lobby.creator && (
                        <span className="ml-2 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Creator
                        </span>
                      )}
                    </span>
                  </div>
                  {player.hasSubmitted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* User's Submission Status */}
          {!hasUserSubmitted && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ You haven't configured your treasure yet. Use the invite link to set up your hiding spot and hints.
              </p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        {isCreator ? (
          <Button
            onClick={handleStartGame}
            disabled={!allReady || isStarting}
            className="w-full"
            variant="hero"
          >
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying to Blockchain...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {allReady ? "Start Game" : `Waiting for ${lobby.players.filter(p => !p.hasSubmitted).length} player(s)`}
              </>
            )}
          </Button>
        ) : (
          <div className="text-center">
            {!hasUserSubmitted ? (
              <Button 
                onClick={() => window.open(`/lobby/${lobby.gameId}`, "_blank")}
                className="w-full"
                variant="default"
              >
                Configure Your Treasure
              </Button>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Waiting for creator to start the game...
              </div>
            )}
          </div>
        )}
        
        {/* Status Message */}
        {isCreator && !allReady && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            The game will start automatically when all players have configured their treasures
          </p>
        )}
      </div>
    </div>
  );
};