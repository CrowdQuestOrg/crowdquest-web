import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import VirtualGrid from "../components/VirtualGrid";
import { 
  Coins, Grid3X3, MapPin, Plus, Link2, 
  UserPlus, Trash2, Send, Loader2, Lock, CheckCircle2 
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useWallet } from "../contexts/WalletContext";
import { useToken } from "../hooks/useToken";
import { useCrowdQuest } from "../hooks/useCrowdQuest";
import { useProfile } from "../hooks/useProfile";

type GameMode = "virtual" | "offline" | null;

const CreateGamePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  
  // Blockchain Hooks
  const { checkAllowance, approve } = useToken();
  const { createVirtualQuest, createRealWorldQuest } = useCrowdQuest();
  const { getAddressByUsername } = useProfile();

  // State Management
  const [mode, setMode] = useState<GameMode>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowance, setAllowance] = useState("0");
  const [isVerifyingUser, setIsVerifyingUser] = useState(false);

  // Quest Logic State
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [hints, setHints] = useState<string[]>(["", "", ""]);
  const [inviteUsername, setInviteUsername] = useState("");
  const [invitedPlayers, setInvitedPlayers] = useState<{name: string, addr: string}[]>([]);

  // 1. Sync Allowance - Triggered on wallet connect or stake change
  useEffect(() => {
    if (address && isConnected) {
      checkAllowance(address).then(setAllowance);
    }
  }, [address, isConnected, checkAllowance, stakeAmount]);

  // 2. Verified Player Addition (via ProfileManager)
  const handleAddPlayer = async () => {
    const name = inviteUsername.trim();
    if (!name) return;

    setIsVerifyingUser(true);
    try {
      const userAddr = await getAddressByUsername(name);
      
      // Check if address is valid and not the zero address
      if (userAddr && userAddr !== "0x0000000000000000000000000000000000000000") {
        if (!invitedPlayers.find(p => p.name === name)) {
          setInvitedPlayers([...invitedPlayers, { name, addr: userAddr }]);
          setInviteUsername("");
          toast({ title: `Explorer ${name} synchronized.` });
        }
      } else {
        toast({ 
          title: "Protocol Error", 
          description: "Callsign not found in the ProfileManager registry.",
          variant: "destructive" 
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifyingUser(false);
    }
  };

  // 3. Token Approval Logic
  const handleApprove = async () => {
    if (!stakeAmount || Number(stakeAmount) <= 0) return;
    setLoading(true);
    try {
      await approve(stakeAmount);
      const newAllowance = await checkAllowance(address!);
      setAllowance(newAllowance);
      toast({ title: "CQT Authorization Successful" });
    } catch (err: any) {
      const isCancel = err.code === 4001 || err.code === "ACTION_REJECTED";
      toast({ 
        title: isCancel ? "Action Aborted" : "Approval Failed", 
        variant: isCancel ? "default" : "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // 4. Final Deployment to Blockchain
  const handleCreate = async () => {
    
    if (!mode || !address) return;
    
    // DATA SANITIZATION: Prevents "Invalid array value" errors
    const cleanHints = hints
      .map(h => h.trim())
      .filter(h => h !== "");

    if (cleanHints.length < 3) {
      toast({ 
        title: "Validation Error", 
        description: "A minimum of 3 valid hint strings are required for encryption.", 
        variant: "destructive" 
      });
      return;
    
    }

    setLoading(true);
    try {
      if (mode === "virtual") {
        if (!selectedCell) throw new Error("Target coordinates must be locked on the grid.");
        
        await createVirtualQuest(
          stakeAmount, 
          selectedCell.x, 
          selectedCell.y, 
          cleanHints
        );
      } else {
        await createRealWorldQuest(stakeAmount, cleanHints);
      }
      
      toast({ title: "Quest Broadcasted", description: "The grid has been updated successfully." });
      navigate("/hunt");
    } catch (err: any) {
      console.error("Deployment Error:", err);
      const isCancel = err.code === 4001 || err.code === "ACTION_REJECTED";
      
      toast({ 
        title: isCancel ? "Broadcast Cancelled" : "Deployment Failed", 
        description: isCancel ? "User rejected the transaction signature." : (err.reason || err.message),
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const needsApproval = Number(allowance) < Number(stakeAmount || 0);

  return (
    <div className="container py-10 max-w-3xl space-y-12">
      <header>
        <h1 className="font-display text-3xl font-black italic uppercase tracking-tighter text-primary">
          Initialize_Quest
        </h1>
        <p className="text-muted-foreground font-mono text-xs uppercase mt-2">
          Network: <span className="text-foreground">Sepolia_Testnet_Grid</span>
        </p>
      </header>

      {/* STEP 1: MODE */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">1</span>
          Select_Deployment_Mode
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "virtual", icon: Grid3X3, label: "Virtual Grid", desc: "Digital coordinates" },
            { id: "offline", icon: MapPin, label: "Real World", desc: "QR/Physical location" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as GameMode)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all ${
                mode === m.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card hover:border-primary/50"
              }`}
            >
              <m.icon className={`h-8 w-8 ${mode === m.id ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-center">
                <p className="font-bold text-sm">{m.label}</p>
                <p className="text-[10px] text-muted-foreground uppercase mt-1">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {mode && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* STEP 2: STAKE */}
          <section className="space-y-4 bg-muted/30 p-6 rounded-2xl border border-dashed">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">2</span>
              Allocate_CQT_Stake
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="pl-12 h-14 font-mono text-lg bg-background"
                />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Authorized_Spend</p>
                <p className="font-mono text-sm">{allowance} CQT</p>
              </div>
            </div>
          </section>

          {/* STEP 3: COORDINATES (Virtual Only) */}
          {mode === "virtual" && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">3</span>
                Target_Coordinates
              </h2>
              <div className="rounded-3xl border bg-card p-4 overflow-hidden">
                <VirtualGrid onCellSelect={(x, y) => setSelectedCell({ x, y })} selectedCellProp={selectedCell} />
              </div>
            </section>
          )}

          {/* STEP 4: HINTS */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">4</span>
              Encryption_Hints
            </h2>
            <div className="space-y-3">
              {hints.map((hint, i) => (
                <div key={i} className="group flex gap-2">
                  <Input
                    placeholder={`Layer 0${i + 1} Hint...`}
                    value={hint}
                    onChange={(e) => {
                      const h = [...hints];
                      h[i] = e.target.value;
                      setHints(h);
                    }}
                    className="bg-card h-12"
                  />
                  {hints.length > 3 && (
                    <Button variant="ghost" size="icon" onClick={() => setHints(hints.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              {hints.length < 5 && (
                <Button variant="outline" size="sm" className="border-dashed" onClick={() => setHints([...hints, ""])}>
                  <Plus className="h-3 w-3 mr-2" /> Add Hint Layer
                </Button>
              )}
            </div>
          </section>

          {/* STEP 5: INVITES */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">5</span>
              Protocol_Invites
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Search Callsign..."
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                className="bg-card"
              />
              <Button disabled={isVerifyingUser || !inviteUsername} onClick={handleAddPlayer} variant="secondary">
                {isVerifyingUser ? <Loader2 className="animate-spin h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {invitedPlayers.map((p) => (
                <div key={p.addr} className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[11px] font-bold">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {p.name}
                  <button onClick={() => setInvitedPlayers(invitedPlayers.filter(x => x.addr !== p.addr))} className="ml-1 hover:text-destructive">×</button>
                </div>
              ))}
            </div>
          </section>

          {/* FINAL TRANSACTION BUTTONS */}
          <div className="pt-6 border-t space-y-4">
            {needsApproval ? (
              <Button 
                className="w-full h-16 text-lg font-black uppercase italic" 
                onClick={handleApprove}
                disabled={loading || !stakeAmount || Number(stakeAmount) <= 0}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Lock className="mr-2 h-5 w-5" />}
                Authorize_Contract_Spend
              </Button>
            ) : (
              <Button 
                variant="hero" 
                className="w-full h-16 text-lg font-black uppercase italic" 
                onClick={handleCreate}
                disabled={loading || !stakeAmount}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-5 w-5" />}
                Broadcast_To_Grid [+]
              </Button>
            )}
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Finalize to trigger blockchain state change
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGamePage;