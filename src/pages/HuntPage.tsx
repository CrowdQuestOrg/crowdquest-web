import { useState, useEffect, useCallback, useRef } from "react";
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

const HuntPage = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  
  const { getActiveQuests, submitVirtualGuess } = useCrowdQuest();
  const { checkAllowance, approve } = useToken();

  // --- STATE MANAGEMENT ---
  const [quests, setQuests] = useState<any[]>([]);
  const [selectedQuestIndex, setSelectedQuestIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // First load only
  const [isRefreshing, setIsRefreshing] = useState(false);       // Background sync
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [guessX, setGuessX] = useState("");
  const [guessY, setGuessY] = useState("");
  const [currentHintLevel, setCurrentHintLevel] = useState(0);

  // --- STABLE DATA FETCHING ---
  const loadQuests = useCallback(async (isSilent = false) => {
    if (isSilent) setIsRefreshing(true);
    else setIsInitialLoading(true);

    try {
      const data = await getActiveQuests();
      setQuests(data);
      
      // Prevent index-out-of-bounds if quests were removed/found
      if (data.length > 0 && selectedQuestIndex >= data.length) {
        setSelectedQuestIndex(0);
      }
    } catch (error) {
      console.error("Sync Error:", error);
      toast({
        title: "Grid_Sync_Failed",
        description: "Failed to pull latest sector data.",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, [getActiveQuests, selectedQuestIndex, toast]);

  useEffect(() => {
    loadQuests();
  }, []); // Run once on mount

  // --- ACTION HANDLERS ---
  const handleGuess = async () => {
    if (!quests[selectedQuestIndex] || !address) return;
    if (guessX === "" || guessY === "") {
      toast({ title: "Coordinates_Required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const currentAllowance = await checkAllowance(address);
      if (parseFloat(currentAllowance) < 1) {
        await approve("5"); 
      }

      const questId = quests[selectedQuestIndex].id;
      const tx = await submitVirtualGuess(
        questId, 
        Number(guessX), 
        Number(guessY)
      );
      
      toast({ title: "Signal_Transmitted", description: "Waiting for confirmation..." });
      await tx.wait();
      
      toast({ title: "Scan_Successful", description: "Grid updated." });
      setGuessX("");
      setGuessY("");
      loadQuests(true); // Background refresh after win/guess
    } catch (error: any) {
      const isCancel = error.code === 4001 || error.code === "ACTION_REJECTED";
      toast({ 
        title: isCancel ? "Action_Aborted" : "Guess_Failed", 
        description: isCancel ? "User rejected signature." : "Transaction reverted.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER LOGIC ---

  // 1. Initial Loading Screen (Only shows on first mount)
  if (isInitialLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="absolute inset-0 blur-md bg-primary/20 rounded-full animate-pulse" />
        </div>
        <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Establishing_Uplink...
        </p>
      </div>
    );
  }

  // 2. Empty State (Only if not loading and no quests found)
  if (quests.length === 0) {
    return (
      <div className="container py-20 text-center max-w-md animate-in fade-in zoom-in-95">
        <div className="mb-6 rounded-3xl bg-accent/5 border border-accent/10 p-8 inline-block">
          <AlertCircle className="h-12 w-12 text-accent/40" />
        </div>
        <h1 className="font-display text-2xl font-black italic uppercase tracking-tighter mb-2">Sector_Empty</h1>
        <p className="text-muted-foreground mb-8 text-xs uppercase tracking-widest leading-loose">
          No active signals detected in this coordinate range.
        </p>
        <Button onClick={() => loadQuests()} variant="outline" className="gap-2 rounded-2xl border-primary/20">
          <RefreshCcw className="h-4 w-4" /> RE-SCAN_GRID
        </Button>
      </div>
    );
  }

  const currentQuest = quests[selectedQuestIndex];
  const availableHints = currentQuest.hints || ["Decrypting_Signal..."];

  // 3. Main UI (Always visible during background refreshes)
  return (
    <div className={`container py-8 max-w-6xl transition-all duration-500 ${isRefreshing ? 'opacity-60 grayscale-[0.2]' : 'opacity-100'}`}>
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`h-2 w-2 rounded-full ${isRefreshing ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {isRefreshing ? 'Syncing_Grid...' : 'Grid_Active // Sepolia'}
            </span>
          </div>
          <h1 className="font-display text-3xl font-black text-foreground italic uppercase tracking-tighter">Virtual_Hunt</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            TARGET_ID: <span className="text-primary">#{currentQuest.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Bounty</p>
              <p className="text-lg font-black font-mono leading-none mt-1">{currentQuest.reward} <span className="text-xs">CQT</span></p>
            </div>
          </div>
          <Button 
            disabled={isRefreshing}
            onClick={() => loadQuests(true)} 
            variant="secondary" 
            size="icon" 
            className="h-12 w-12 rounded-2xl"
          >
            <RefreshCcw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Interaction Layer */}
        <div className="rounded-3xl border bg-card p-3 shadow-2xl overflow-hidden relative">
          <VirtualGrid 
            onCellSelect={(x, y) => {
              setGuessX(x.toString());
              setGuessY(y.toString());
            }} 
            selectedCellProp={guessX ? { x: Number(guessX), y: Number(guessY) } : null}
          />
        </div>

        <div className="space-y-6">
          {/* Hints Section */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-display text-md font-bold italic uppercase tracking-tight">Decrypted_Hints</h3>
            </div>
            <div className="space-y-3">
              {availableHints.slice(0, currentHintLevel + 1).map((hint: string, i: number) => (
                <div key={i} className="rounded-xl border bg-muted/20 p-4 border-l-4 border-l-primary animate-in fade-in slide-in-from-left-2">
                  <p className="text-[9px] font-black text-primary mb-1 uppercase tracking-widest">Layer_0{i + 1}</p>
                  <p className="text-sm text-foreground leading-relaxed font-medium">{hint}</p>
                </div>
              ))}
              
              {currentHintLevel < availableHints.length - 1 && (
                <button
                  onClick={() => setCurrentHintLevel((c) => c + 1)}
                  className="w-full text-center py-3 text-[10px] font-black text-primary hover:bg-primary/5 rounded-lg transition-all uppercase tracking-[0.2em] border border-dashed border-primary/30 mt-2"
                >
                  Unlock Next Hint Layer [+]
                </button>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm border-b-4 border-b-primary">
            <h3 className="font-display text-md font-black mb-4 uppercase italic tracking-tighter">Execute_Guess</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-widest">X_COORD</label>
                <input
                  type="number"
                  value={guessX}
                  onChange={(e) => setGuessX(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase ml-1 tracking-widest">Y_COORD</label>
                <input
                  type="number"
                  value={guessY}
                  onChange={(e) => setGuessY(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="0"
                />
              </div>
            </div>
            
            <Button 
              variant="hero" 
              className="w-full py-7 text-lg font-black uppercase italic tracking-widest rounded-xl shadow-lg" 
              onClick={handleGuess}
              disabled={isSubmitting || !isConnected || isRefreshing}
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
              ) : (
                <Send className="h-6 w-6 mr-2" />
              )}
              {isSubmitting ? "Processing..." : "Transmit_Guess"}
            </Button>
            
            {!isConnected && (
              <p className="mt-4 text-[10px] text-destructive text-center font-black animate-pulse uppercase tracking-widest">
                Critical: Wallet Offline
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuntPage;