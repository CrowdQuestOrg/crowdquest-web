import { useState } from "react";
import { 
  Camera, 
  QrCode, 
  KeyboardIcon, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useCrowdQuest } from "../hooks/useCrowdQuest";
import { useToast } from "../hooks/use-toast";
import { notifyTransaction } from "../utils/transactionHelpers";

const ScanPage = () => {
  const { toast } = useToast();
  const { claimRealTreasure } = useCrowdQuest();
  
  // UI State
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [questId, setQuestId] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const handleClaim = async () => {
    if (!questId || !manualCode) {
      toast({ 
        title: "Incomplete Data", 
        description: "Quest ID and Secret Key are required for decryption.",
        variant: "destructive" 
      });
      return;
    }

    setIsClaiming(true);
    setLastTxHash(null);
    
    try {
      // 1. EXECUTE: Call the contract
      const tx = await claimRealTreasure(questId, manualCode);
      
      // 2. NOTIFY: Immediate feedback via Person 1's helper
      notifyTransaction(tx.hash);
      setLastTxHash(tx.hash);
      
      // 3. CONFIRM: Wait for block inclusion
      await tx.wait();
      
      toast({ 
        title: "Protocol Success", 
        description: "Treasure verified. CQT tokens released to your vault.",
      });
      
      // Clear inputs on success
      setManualCode("");
      setQuestId("");
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Verification Failed", 
        description: error.reason || "Invalid secret or protocol error.", 
        variant: "destructive" 
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground italic uppercase">Claim_Treasure</h1>
        <p className="mt-2 text-sm text-muted-foreground">Submit valid proof-of-discovery to unlock on-chain rewards.</p>
      </div>

      <div className="space-y-6">
        {/* Navigation / Mode Toggle */}
        <div className="flex rounded-2xl border bg-card/50 p-1.5 shadow-sm">
          <button
            onClick={() => setMode("camera")}
            className={`flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-bold transition-all ${
              mode === "camera" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Camera className="mr-2 h-4 w-4" />
            Scanner
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-bold transition-all ${
              mode === "manual" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <KeyboardIcon className="mr-2 h-4 w-4" />
            Override
          </button>
        </div>

        {mode === "camera" ? (
          <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-muted-foreground/20 bg-card transition-all hover:border-primary/50">
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-20 w-20">
                <QrCode className="h-full w-full text-muted-foreground/20" />
                <div className="absolute inset-0 animate-pulse border-2 border-primary/40 rounded-lg" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Awaiting Optical Input</p>
              <Button variant="outline" className="mt-6 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10" disabled>
                Initialize Lens (Hour 4)
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 rounded-3xl border bg-card p-8 shadow-xl border-t-4 border-t-primary">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Asset ID</label>
                <input
                  type="number"
                  value={questId}
                  onChange={(e) => setQuestId(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3.5 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="001"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Decryption Secret</label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-3.5 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Paste found sequence..."
                />
              </div>

              <div className="pt-2">
                <Button 
                  variant="hero" 
                  className="w-full h-14 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20" 
                  onClick={handleClaim}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying_Proof...
                    </>
                  ) : (
                    <>
                      Verify & Claim
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {lastTxHash && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-500/10 p-3 text-[10px] font-bold text-green-500 border border-green-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  LAST_TX: {lastTxHash.slice(0, 10)}...
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${lastTxHash}`} 
                    target="_blank" 
                    className="ml-2 flex items-center underline hover:text-green-400"
                  >
                    VIEW <ExternalLink className="ml-1 h-2 w-2" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
        Secured by Sepolia Ethereum Layer 1 Protocol
      </p>
    </div>
  );
};

export default ScanPage;