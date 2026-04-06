import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useWallet } from "../contexts/WalletContext";
import { UserPlus, Loader2, Terminal, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  
  const { createProfile, getAddressByUsername } = useProfile();
  const { address, isConnected } = useWallet();
  const navigate = useNavigate();

  // --- AVAILABILITY CHECK (Debounced) ---
  useEffect(() => {
    if (username.length < 3) {
      setAvailabilityError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        // We call the contract getter to see if an address owns this name
        const owner = await getAddressByUsername(username);
        if (owner && owner !== "0x0000000000000000000000000000000000000000") {
          setAvailabilityError("Callsign already claimed by another Explorer.");
        } else {
          setAvailabilityError(null);
        }
      } catch (err) {
        // If the contract reverts on 'Not Found', that's actually good!
        setAvailabilityError(null);
      } finally {
        setIsChecking(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [username, getAddressByUsername]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !address || availabilityError) return;

    setIsPending(true);
    try {
      await createProfile(username);
      navigate("/profile");
    } catch (err: any) {
      console.error("Registration failed", err);
      // Handle the "User already exists" or "Username taken" edge cases
      if (err.message?.includes("Profile__AlreadyExists")) {
        navigate("/profile");
      }
    } finally {
      setIsPending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-yellow-500" />
        <h2 className="text-xl font-bold uppercase font-display italic">Authentication_Required</h2>
        <p className="text-muted-foreground text-sm">Please connect your wallet to register your legacy.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-xl py-20">
      <div className="relative overflow-hidden rounded-3xl border bg-card p-10 shadow-2xl">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Enter_Callsign
                </label>
                {username.length >= 3 && !isChecking && (
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${availabilityError ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                    {availabilityError ? 'Unavailable' : 'Available'}
                  </span>
                )}
              </div>
              
              <div className="relative">
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, '_'))} // Auto-replace spaces with underscores
                  placeholder="Ex: Neon_Vagabond"
                  className={`w-full rounded-xl border bg-background px-4 py-4 font-mono text-sm ring-offset-background transition-all focus:outline-none focus:ring-2 ${
                    availabilityError ? 'border-destructive focus:ring-destructive/50' : 'focus:ring-primary/50'
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : username.length >= 3 ? (
                    availabilityError ? <AlertCircle className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : null}
                </div>
              </div>
              
              {availabilityError && (
                <p className="text-[10px] text-destructive font-bold uppercase ml-1">
                  {availabilityError}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full py-7 text-lg font-black uppercase italic tracking-wider"
              disabled={isPending || isChecking || !username || !!availabilityError || username.length < 3}
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

          <div className="rounded-xl bg-muted/30 p-4 border border-dashed">
             <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              Protocol: This callsign will be permanently linked to <br/>
              <span className="text-primary font-mono mt-1 block">{address?.slice(0, 12)}...{address?.slice(-10)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;