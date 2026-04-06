import { useState } from "react";
import { 
  Camera, 
  QrCode, 
  KeyboardIcon, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight,
  RefreshCcw,
  Zap
} from "lucide-react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
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

  /**
   * SMART SCAN PARSER
   * Handles: 
   * 1. Official format: id:1,secret:abc
   * 2. Raw string: abc (defaults to ID 1)
   * 3. Reverts to manual mode for review
   */
  const handleScanUpdate = (err: any, result: any) => {
    if (result) {
      const data = result.getText();
      console.log("Captured Data:", data);

      try {
        // Option 1: Official Comma-Separated Format
        if (data.includes(",") && data.includes(":")) {
          const parts = data.split(",");
          const parsedId = parts[0].split(":")[1]?.trim();
          const parsedSecret = parts[1].split(":")[1]?.trim();

          setQuestId(parsedId || "1");
          setManualCode(parsedSecret || data);
        } 
        // Option 2: Just a raw secret (Auto-assign Quest 1)
        else {
          setQuestId("1");
          setManualCode(data);
        }

        setMode("manual"); 
        toast({ 
          title: "Optical Link Established", 
          description: "Data extracted. Review signatures below.",
          duration: 3000
        });
      } catch (e) {
        // Fallback for unexpected formats
        setQuestId("1");
        setManualCode(data);
        setMode("manual");
      }
    }
  };

  const handleClaim = async () => {
    if (!questId || !manualCode) {
      toast({ 
        title: "Missing Signatures", 
        description: "Protocol requires both Quest ID and Decryption Secret.",
        variant: "destructive" 
      });
      return;
    }

    setIsClaiming(true);
    setLastTxHash(null);
    
    try {
      // 1. BROADCAST: Trigger smart contract via Person 2's hook
      const tx = await claimRealTreasure(questId, manualCode);
      
      // 2. FEEDBACK: Instant notification via Person 1's helper
      notifyTransaction(tx.hash);
      setLastTxHash(tx.hash);
      
      // 3. WAIT: Final block confirmation
      await tx.wait();
      
      toast({ 
        title: "Protocol Success", 
        description: "Treasure verified. Reward distribution initialized.",
      });
      
      // Clear inputs
      setManualCode("");
      setQuestId("");
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Verification Failed", 
        description: error.reason || "Invalid secret or quest already claimed.", 
        variant: "destructive" 
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tighter text-foreground italic uppercase">Claim_Treasure</h1>
        <p className="mt-2 text-sm text-muted-foreground font-medium">Verify physical discovery via Optical Link or Manual Override.</p>
      </div>

      <div className="space-y-6">
        {/* Toggle Mode */}
        <div className="flex rounded-2xl border bg-card/50 p-1.5 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setMode("camera")}
            className={`flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-bold transition-all ${
              mode === "camera" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Camera className="mr-2 h-4 w-4" />
            Scanner
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-bold transition-all ${
              mode === "manual" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <KeyboardIcon className="mr-2 h-4 w-4" />
            Override
          </button>
        </div>

        {mode === "camera" ? (
          <div className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-primary/20 bg-black shadow-2xl">
            <BarcodeScannerComponent
              width="100%"
              height="100%"
              onUpdate={handleScanUpdate}
            />
            
            {/* Visual HUD */}
            <div className="absolute inset-0 pointer-events-none border-[30px] border-black/40">
                <div className="w-full h-full border border-primary/30 rounded-lg animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/10 rounded-full" />
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md border border-white/10">
                <Zap className="h-3 w-3 text-primary animate-pulse" />
                Awaiting Optical Signature
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 rounded-3xl border bg-card p-8 shadow-2xl border-t-8 border-t-primary">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Asset Protocol ID</label>
                <input
                  type="number"
                  value={questId}
                  onChange={(e) => setQuestId(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-4 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground/30"
                  placeholder="000"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Discovery Secret</label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full rounded-xl border bg-background px-4 py-4 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground/30"
                  placeholder="ENTER_SEQUENCE_..."
                />
              </div>

              <div className="pt-4">
                <Button 
                  variant="hero" 
                  className="w-full h-16 text-md font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20" 
                  onClick={handleClaim}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Minging_On_Chain...
                    </>
                  ) : (
                    <>
                      Verify & Claim
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <button 
                  onClick={() => { setQuestId(""); setManualCode(""); setMode("camera"); }}
                  className="mt-6 w-full text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="h-3 w-3" />
                  Restart Sensor
                </button>
              </div>

              {lastTxHash && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-500/5 p-4 text-[10px] font-black text-green-500 border border-green-500/20 animate-in slide-in-from-bottom-2">
                  <CheckCircle2 className="h-4 w-4" />
                  ID: {lastTxHash.slice(0, 12)}...
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${lastTxHash}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="ml-2 flex items-center underline hover:text-green-400 decoration-2 underline-offset-4"
                  >
                    EXPLORER <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-12 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-50">
        // Sepolia_Network_Verified //
      </p>
    </div>
  );
};

export default ScanPage;