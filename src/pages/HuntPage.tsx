import { useState, useEffect, useCallback } from "react";
import { useCrowdQuest } from "../hooks/useCrowdQuest";
import { useWallet } from "../contexts/WalletContext";
import { Button } from "../components/ui/button";
import { Loader2, Users, Target, ShieldAlert, Zap } from "lucide-react";
import VirtualGrid from "../components/VirtualGrid";

const HuntPage = () => {
  const { address } = useWallet();
  const { getJoinedGames, submitVirtualGuess } = useCrowdQuest();
  
  const [myGames, setMyGames] = useState<any[]>([]);
  const [activeGameIdx, setActiveGameIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshLobby = useCallback(async () => {
    const games = await getJoinedGames();
    setMyGames(games);
    setLoading(false);
  }, [getJoinedGames]);

  useEffect(() => { refreshLobby(); }, [refreshLobby]);

  const currentGame = myGames[activeGameIdx];

  const handleTurnGuess = async (x: number, y: number) => {
    if (!currentGame.isMyTurn) return;
    setIsSubmitting(true);
    try {
      await submitVirtualGuess(currentGame.id, x, y);
      refreshLobby(); // Refresh to see next player
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-mono">INITIALIZING_COMM_LINK...</div>;

  return (
    <div className="container py-8 max-w-6xl grid lg:grid-cols-[300px_1fr] gap-8">
      
      {/* LEFT COLUMN: GAME LOBBY / JOINED GAMES */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" /> Active_Infiltrations
        </h2>
        <div className="space-y-2">
          {myGames.map((game, i) => (
            <button
              key={game.id}
              onClick={() => setActiveGameIdx(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeGameIdx === i ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card opacity-60"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-primary">#{game.id}</span>
                {game.isMyTurn && <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
              </div>
              <p className="text-sm font-bold mt-1">{game.reward} CQT Pool</p>
              <p className="text-[10px] uppercase mt-2 text-muted-foreground">
                Turn: {game.turnNumber}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: THE GAME BOARD */}
      {currentGame ? (
        <div className="space-y-6">
          <div className="bg-card border rounded-3xl p-8 relative overflow-hidden">
            
            {/* Status Overlay */}
            {!currentGame.isMyTurn && (
              <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
                <div className="bg-black/80 border border-white/10 p-6 rounded-2xl shadow-2xl">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="font-display text-lg italic font-black uppercase">Waiting_For_Infiltrator</p>
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    Current Turn: <span className="text-white">{currentGame.currentTester.slice(0,6)}...{currentGame.currentTester.slice(-4)}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h1 className="font-display text-2xl font-black italic uppercase italic">Sector_Grid_{currentGame.id}</h1>
              <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                {currentGame.isMyTurn ? "Your Action" : "Synchronizing"}
              </div>
            </div>

            <VirtualGrid 
              onCellSelect={(x, y) => currentGame.isMyTurn && handleTurnGuess(x, y)} 
            />
          </div>

          {/* TURN HISTORY / RECENT LOGS */}
          <div className="bg-black/20 rounded-2xl border p-6 font-mono text-[11px] space-y-2">
            <p className="text-muted-foreground border-b border-white/5 pb-2 mb-4 uppercase tracking-tighter font-bold">Infiltration_Logs</p>
            <div className="flex justify-between animate-in fade-in">
              <span className="text-primary">[SYSTEM]</span>
              <span>Infiltration Turn {currentGame.turnNumber} Started</span>
            </div>
            <div className="flex justify-between opacity-50">
              <span className="text-red-500">[FAILED]</span>
              <span>Player {currentGame.currentTester.slice(0,5)} missed target.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center border-2 border-dashed rounded-3xl h-[400px]">
          <div className="text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-mono text-sm">NO_ACTIVE_INVITATIONS_FOUND</p>
            <Button variant="link" onClick={refreshLobby} className="text-primary">RE-SCAN_NETWORK</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HuntPage;