import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useWallet } from "../contexts/WalletContext";
import { UserPlus, Loader2, Terminal, ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/button";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { createProfile } = useProfile();
  const { address, isConnected } = useWallet();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !address) return;

    setIsPending(true);
    try {
      // Calls Person 3's ProfileManager.sol
      await createProfile(username);
      // Redirect to profile once the tx is mined
      navigate("/profile");
    } catch (err) {
      console.error("Registration failed", err);
    } finally {
      setIsPending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-yellow-500" />
        <h2 className="text-xl font-bold uppercase">Authentication_Required</h2>
        <p className="text-muted-foreground text-sm">Please connect your wallet to register your legacy.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-xl py-20">
      <div className="relative overflow-hidden rounded-3xl border bg-card p-10 shadow-2xl">
        {/* Aesthetic Background Element */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-black italic uppercase tracking-tight">
              Initialize_Identity
            </h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Enter_Callsign
              </label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Neon_Vagabond"
                className="w-full rounded-xl border bg-background px-4 py-4 font-mono text-sm ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-7 text-lg font-black uppercase italic tracking-wider"
              disabled={isPending || !username}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Broadcasting_to_Chain...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Join_The_Grid [+]
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
            Note: This action requires a gas fee on the Sepolia Network to secure your name on-chain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;