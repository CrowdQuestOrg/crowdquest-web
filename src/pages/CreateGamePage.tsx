import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button;
import { Input } from "../components/ui//input";
import VirtualGrid from "../components/VirtualGrid";
import { Coins, Grid3X3, MapPin, Plus, Link2, UserPlus, Trash2, Send } from "lucide-react";
import { useToast } from "../hooks/use-toast";

type GameMode = "virtual" | "offline" | null;

const CreateGamePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<GameMode>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [hints, setHints] = useState<string[]>(["", "", ""]);
  const [inviteUsername, setInviteUsername] = useState("");
  const [invitedPlayers, setInvitedPlayers] = useState<string[]>([]);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const addHint = () => {
    if (hints.length < 5) setHints([...hints, ""]);
  };

  const removeHint = (index: number) => {
    if (hints.length > 3) setHints(hints.filter((_, i) => i !== index));
  };

  const updateHint = (index: number, value: string) => {
    const updated = [...hints];
    updated[index] = value;
    setHints(updated);
  };

  const addPlayer = () => {
    const trimmed = inviteUsername.trim();
    if (trimmed && !invitedPlayers.includes(trimmed)) {
      setInvitedPlayers([...invitedPlayers, trimmed]);
      setInviteUsername("");
    }
  };

  const removePlayer = (name: string) => {
    setInvitedPlayers(invitedPlayers.filter((p) => p !== name));
  };

  const generateInviteLink = () => {
    const id = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/join/${id}`;
    setInviteLink(link);
    navigator.clipboard.writeText(link);
    toast({ title: "Invite link copied!", description: link });
  };

  const handleCreate = () => {
    if (!mode) return;
    if (!stakeAmount || Number(stakeAmount) <= 0) {
      toast({ title: "Enter a valid stake amount", variant: "destructive" });
      return;
    }
    if (mode === "virtual" && !selectedCell) {
      toast({ title: "Select treasure location on grid", variant: "destructive" });
      return;
    }
    if (hints.filter((h) => h.trim()).length < 3) {
      toast({ title: "Provide at least 3 hints", variant: "destructive" });
      return;
    }

    toast({ title: "Game created successfully!" });
    if (mode === "virtual") {
      navigate("/hunt");
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Create Game</h1>
      <p className="text-sm text-muted-foreground mb-8">Set up a new treasure hunt for others to play</p>

      {/* Step 1 — Mode selection */}
      <div className="mb-8">
        <h2 className="font-display text-sm font-semibold text-foreground mb-3">1. Choose Game Mode</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("virtual")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-all ${
              mode === "virtual"
                ? "border-accent bg-accent/10 shadow-[var(--shadow-card)]"
                : "bg-card hover:border-accent/40"
            }`}
          >
            <Grid3X3 className={`h-8 w-8 ${mode === "virtual" ? "text-accent" : "text-muted-foreground"}`} />
            <span className="font-display text-sm font-semibold text-foreground">Play Virtually</span>
            <span className="text-xs text-muted-foreground text-center">Grid-based online treasure hunt</span>
          </button>
          <button
            onClick={() => setMode("offline")}
            className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-all ${
              mode === "offline"
                ? "border-accent bg-accent/10 shadow-[var(--shadow-card)]"
                : "bg-card hover:border-accent/40"
            }`}
          >
            <MapPin className={`h-8 w-8 ${mode === "offline" ? "text-accent" : "text-muted-foreground"}`} />
            <span className="font-display text-sm font-semibold text-foreground">Play Offline</span>
            <span className="text-xs text-muted-foreground text-center">Real-world QR code treasure</span>
          </button>
        </div>
      </div>

      {mode && (
        <>
          {/* Step 2 — Stake */}
          <div className="mb-8">
            <h2 className="font-display text-sm font-semibold text-foreground mb-3">2. Stake Amount</h2>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                placeholder="Enter CQ tokens to stake"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="max-w-xs"
              />
              <span className="text-sm text-muted-foreground">CQ</span>
            </div>
          </div>

          {/* Step 3 — Grid (virtual only) */}
          {mode === "virtual" && (
            <div className="mb-8">
              <h2 className="font-display text-sm font-semibold text-foreground mb-3">3. Select Treasure Location</h2>
              <VirtualGrid onCellSelect={(x, y) => setSelectedCell({ x, y })} selectedCellProp={selectedCell} />
              {selectedCell && (
                <p className="mt-2 text-sm text-accent-foreground">
                  Treasure at <span className="font-semibold">({selectedCell.x}, {selectedCell.y})</span>
                </p>
              )}
            </div>
          )}

          {/* Step 4 — Hints */}
          <div className="mb-8">
            <h2 className="font-display text-sm font-semibold text-foreground mb-3">
              {mode === "virtual" ? "4" : "3"}. Progressive Hints
            </h2>
            <div className="space-y-2">
              {hints.map((hint, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-14 shrink-0">Hint {i + 1}</span>
                  <Input
                    placeholder={`Enter hint ${i + 1}...`}
                    value={hint}
                    onChange={(e) => updateHint(i, e.target.value)}
                  />
                  {hints.length > 3 && (
                    <button onClick={() => removeHint(i)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {hints.length < 5 && (
                <Button variant="ghost" size="sm" className="gap-1" onClick={addHint}>
                  <Plus className="h-3 w-3" /> Add Hint
                </Button>
              )}
            </div>
          </div>

          {/* Step 5 — Invite */}
          <div className="mb-8">
            <h2 className="font-display text-sm font-semibold text-foreground mb-3">
              {mode === "virtual" ? "5" : "4"}. Invite Players
            </h2>
            <div className="space-y-3">
              {/* By username */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter username or wallet address"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                />
                <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={addPlayer}>
                  <UserPlus className="h-4 w-4" /> Add
                </Button>
              </div>
              {invitedPlayers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {invitedPlayers.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground"
                    >
                      {p}
                      <button onClick={() => removePlayer(p)} className="hover:text-destructive">×</button>
                    </span>
                  ))}
                </div>
              )}
              {/* Invite link */}
              <Button variant="outline" size="sm" className="gap-1" onClick={generateInviteLink}>
                <Link2 className="h-4 w-4" /> Generate Invite Link
              </Button>
              {inviteLink && (
                <p className="text-xs text-muted-foreground break-all bg-muted rounded-lg px-3 py-2">{inviteLink}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleCreate}>
            <Send className="h-4 w-4" />
            {mode === "virtual" ? "Create & Start Virtual Hunt" : "Create & Generate QR Code"}
          </Button>
        </>
      )}
    </div>
  );
};

export default CreateGamePage;
