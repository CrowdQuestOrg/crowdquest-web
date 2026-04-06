// src/pages/LobbySetupPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LobbySetup } from "../components/LobbySetup";
import { useGameLobby } from "../hooks/useGameLobby";
import { Loader2 } from "lucide-react";

export const LobbySetupPage = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const { getInvitedLobbies, invitedLobbies } = useGameLobby();
  const [loading, setLoading] = useState(true);
  const [gameMode, setGameMode] = useState<"virtual" | "offline">("virtual");
  
  useEffect(() => {
    const lobbies = getInvitedLobbies();
    const lobby = lobbies.find(l => l.gameId === lobbyId);
    if (!lobby) {
      navigate("/hunt");
    } else {
      setGameMode(lobby.gameMode || "virtual");
    }
    setLoading(false);
  }, [lobbyId, getInvitedLobbies, navigate]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Configure Your Treasure</h1>
      <LobbySetup 
        lobbyId={lobbyId!} 
        gameMode={gameMode}
        onComplete={() => navigate("/hunt")}
      />
    </div>
  );
};