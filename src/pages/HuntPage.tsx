import { useState, useEffect, useCallback } from "react";
import VirtualGrid from "../components/VirtualGrid";
import { Button } from "../components/ui/button";
import { 
  Lightbulb, 
  Send, 
  Loader2, 
  RefreshCcw, 
  AlertCircle,
  Coins
} from "lucide-react";
import { useCrowdQuest } from "../hooks/useCrowdQuest";
import { useToken } from "../hooks/useToken";
import { useWallet } from "../contexts/WalletContext";
import { useToast } from "../hooks/use-toast";
import { notifyTransaction } from "../utils/transactionHelpers";

const HuntPage = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  
  // Hook Integrations
  const { getActiveQuests, submitGuess } = useCrowdQuest();
  const { checkAllowance, approve } = useToken();

  // Blockchain Data State
  const [quests, setQuests] = useState<any[]>([]);
  const [selectedQuestIndex, setSelectedQuestIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gameplay State
  const [guessX, setGuessX] = useState("");
  const [guessY, setGuessY] = useState("");
  const [currentHintLevel, setCurrentHintLevel] = useState(0);

  const loadQuests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getActiveQuests();
      setQuests(data);
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Could not sync with Sepolia nodes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getActiveQuests, toast]);

  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  const handleGuess = async () => {
    if (!quests[selectedQuestIndex] || !address) return;
    if (guessX === "" || guessY === "") {
      toast({ title: "Target coordinates missing", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. PRE-FLIGHT: Check if contract is allowed to spend user's tokens for the guess
      const currentAllowance = await checkAllowance(address);
      if (parseFloat(currentAllowance) < 1) {
        toast({ title: "Allowance Required", description: "Approving CQT for gameplay..." });
        const appTx = await approve("10"); // Approve 10 CQT for multiple guesses
        notifyTransaction(appTx.hash);
        await appTx.wait();
      }

      // 2. THE GUESS: Submit to Smart Contract
      const questId = quests[selectedQuestIndex].id;
      const tx = await submitGuess(questId, Number(guessX), Number(guessY));
      
      // 3. FEEDBACK: Instant Etherscan Link
      notifyTransaction(tx.hash);
      
      await tx.wait();
      
      toast({ title: "Target Hit!", description: "Transaction confirmed on-chain." });
      setGuessX("");
      setGuessY("");
      loadQuests();
    } catch (error: any) {
      toast({ 
        title: "Guess Failed", 
        description: error.reason || "Check your CQT balance or gas.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-display animate-pulse">Syncing with Grid State...</p>
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="container py-12 text-center max-w-md">
        <div className="mb-6 rounded-full bg-accent/10 p-6 inline-block">
          <AlertCircle className="h-12 w-12 text-accent" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">No Active Quests</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          All treasures have been found or none have been created on this contract version yet.
        </p>
        <Button onClick={loadQuests} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Scan Again
        </Button>
      </div>
    );
  }

  const currentQuest = quests[selectedQuestIndex];

  return (
    <div className="container py-8">
      {/* Header with Live Stats */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live on Sepolia</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground italic">VIRTUAL_HUNT</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Targeting Quest <span className="text-accent font-mono">#{currentQuest.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border rounded-lg px-4 py-2 flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">{currentQuest.reward} CQT</span>
          </div>
          <Button onClick={loadQuests} variant="ghost" size="icon" className="h-9 w-9">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Interaction Layer */}
        <div className="rounded-2xl border bg-card/50 p-2 shadow-inner">
          <VirtualGrid 
            onCellSelect={(x, y) => {
              setGuessX(x.toString());
              setGuessY(y.toString());
            }} 
          />
        </div>

        <div className="space-y-6">
          {/* Progressive Hint System */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-display text-md font-bold italic underline decoration-primary/30">DECRYPTED_HINTS</h3>
            </div>
            <div className="space-y-3">
              {currentQuest.hints.slice(0, currentHintLevel + 1).map((hint: string, i: number) => (
                <div key={i} className="rounded-xl border bg-muted/30 p-4 border-l-4 border-l-primary animate-in fade-in slide-in-from-left-2">
                  <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-tighter">Transmission {i + 1}</p>
                  <p className="text-sm text-foreground leading-relaxed">{hint}</p>
                </div>
              ))}
              
              {currentHintLevel < currentQuest.hints.length - 1 && (
                <button
                  onClick={() => setCurrentHintLevel((c) => c + 1)}
                  className="w-full text-center py-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest border-t border-dashed mt-2"
                >
                  Decode next hint [+]
                </button>
              )}
            </div>
          </div>

          {/* Transaction Panel */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm border-t-4 border-t-primary">
            <h3 className="font-display text-md font-bold mb-4 uppercase italic">Execute Guess</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">X-Axis</label>
                <input
                  type="number"
                  value={guessX}
                  onChange={(e) => setGuessX(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Y-Axis</label>
                <input
                  type="number"
                  value={guessY}
                  onChange={(e) => setGuessY(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="000"
                />
              </div>
            </div>
            
            <Button 
              variant="hero" 
              className="w-full py-6 text-md font-bold uppercase tracking-widest" 
              onClick={handleGuess}
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Send className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? "Mining..." : "Transmit Guess"}
            </Button>
            
            {!isConnected && (
              <p className="mt-4 text-[10px] text-destructive text-center font-bold animate-pulse">
                WALLET CONNECTION REQUIRED
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuntPage;