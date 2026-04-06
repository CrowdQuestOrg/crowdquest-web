// src/components/LobbySetup.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import VirtualGrid from "./VirtualGrid";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useGameLobby } from "../hooks/useGameLobby";
import { useToast } from "../hooks/use-toast";

interface LobbySetupProps {
  lobbyId: string;
  gameMode: "virtual" | "offline";
  onComplete: () => void;
}

export const LobbySetup = ({ lobbyId, gameMode, onComplete }: LobbySetupProps) => {
  const { submitPlayerConfig, activeLobby } = useGameLobby();
  const { toast } = useToast();
  
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [hints, setHints] = useState<string[]>(["", "", ""]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentPlayer = activeLobby?.players.find(p => p.playerAddress === activeLobby.creator);
  const isCreator = currentPlayer?.playerAddress === activeLobby?.creator;
  
  const handleSubmit = async () => {
    if (gameMode === "virtual" && !selectedCell) {
      toast({ title: "Error", description: "Please select a hiding spot on the grid", variant: "destructive" });
      return;
    }
    
    const cleanHints = hints.filter(h => h.trim() !== "");
    if (cleanHints.length < 3) {
      toast({ title: "Error", description: "Please provide at least 3 hints", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitPlayerConfig(lobbyId, {
        selectedCell: selectedCell || undefined,
        hints: cleanHints,
        stakeAmount: isCreator ? stakeAmount : undefined,
      });
      
      toast({ title: "Configuration Submitted", description: "Waiting for other players..." });
      onComplete();
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit configuration", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border p-6">
        <h3 className="font-bold mb-4">Configure Your Hidden Treasure</h3>
        
        {isCreator && (
          <div className="mb-4">
            <label className="text-sm font-mono mb-2 block">Stake Amount (CQT)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="font-mono"
            />
          </div>
        )}
        
        {gameMode === "virtual" && (
          <div className="mb-4">
            <label className="text-sm font-mono mb-2 block">Select Hiding Spot</label>
            <div className="border rounded-lg p-4">
              <VirtualGrid 
                onCellSelect={(x, y) => setSelectedCell({ x, y })} 
                selectedCellProp={selectedCell}
                showTreasures={false}
              />
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="text-sm font-mono mb-2 block">Progressive Hints (3-5 hints)</label>
          <div className="space-y-2">
            {hints.map((hint, i) => (
              <Input
                key={i}
                placeholder={`Hint ${i + 1}`}
                value={hint}
                onChange={(e) => {
                  const newHints = [...hints];
                  newHints[i] = e.target.value;
                  setHints(newHints);
                }}
              />
            ))}
            {hints.length < 5 && (
              <Button variant="outline" size="sm" onClick={() => setHints([...hints, ""])}>
                + Add Hint
              </Button>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
          Submit Configuration
        </Button>
      </div>
      
      {/* Show other players' status */}
      <div className="bg-muted/30 rounded-2xl p-4">
        <h4 className="text-sm font-mono mb-3">Players Ready:</h4>
        <div className="space-y-2">
          {activeLobby?.players.map((player) => (
            <div key={player.playerAddress} className="flex justify-between items-center text-sm">
              <span>{player.playerUsername}</span>
              {player.hasSubmitted ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};