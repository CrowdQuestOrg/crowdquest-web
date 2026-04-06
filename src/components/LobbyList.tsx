// src/components/LobbyList.tsx
import { useEffect } from "react";
import { Button } from "./ui/button";
import { useGameLobby } from "../hooks/useGameLobby";
import { Users, Clock } from "lucide-react";

interface LobbyListProps {
  onJoinLobby: (lobbyId: string) => void;
}

export const LobbyList = ({ onJoinLobby }: LobbyListProps) => {
  const { getInvitedLobbies, invitedLobbies } = useGameLobby();
  
  useEffect(() => {
    getInvitedLobbies();
    const interval = setInterval(() => getInvitedLobbies(), 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [getInvitedLobbies]);
  
  if (invitedLobbies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No pending game invitations</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h3 className="font-bold">Pending Invitations</h3>
      {invitedLobbies.map((lobby) => (
        <div key={lobby.gameId} className="border rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="font-mono text-sm">Game #{lobby.gameId.slice(-6)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              Created by {lobby.creator.slice(0, 6)}...
            </p>
          </div>
          <Button onClick={() => onJoinLobby(lobby.gameId)}>Configure</Button>
        </div>
      ))}
    </div>
  );
};