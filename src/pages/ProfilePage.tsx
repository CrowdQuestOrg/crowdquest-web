import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
import { Trophy, Coins, MapPin, Grid3X3, Target, Zap, Star, Plus, Loader2, UserPlus, Terminal } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";
import { useProfile } from "../hooks/useProfile";

const badges = [
  { name: "First Treasure", icon: Star, minEarned: 10 },
  { name: "Speed Demon", icon: Zap, minEarned: 100 },
  { name: "Treasure Hunter", icon: Trophy, minEarned: 500 },
  { name: "Master Hider", icon: MapPin, minEarned: 1000 },
];

const ProfilePage = () => {
  const { address, isConnected, balance: ethBalance } = useWallet();
  const { getStats, createProfile } = useProfile();
  
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [stats, setStats] = useState<any>(null);

  const displayAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet";

  useEffect(() => {
    const fetchStats = async () => {
      if (isConnected && address) {
        setLoading(true);
        try {
          const data = await getStats(address);
          if (data) {
            setStats({
              username: data.username,
              totalEarned: data.totalEarned,
              questsCompleted: data.questsCompleted,
              questsCreated: data.questsCreated,
              accuracy: data.accuracy || "0%"
            });
          } else {
            setStats(null); // Explicitly null means needs registration
          }
        } catch (error) {
          console.error("Error fetching profile stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, [isConnected, address, getStats]);

  const handleRegister = async () => {
    if (!usernameInput) return;
    setIsRegistering(true);
    try {
      await createProfile(usernameInput);
      window.location.reload(); 
    } catch (err) {
      console.error("Registration failed", err);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 italic uppercase font-display">Authentication_Required</h2>
        <p className="text-muted-foreground mb-8">You need to be connected to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- REGISTRATION UI (If profile doesn't exist) ---
  if (!stats) {
    return (
      <div className="container max-w-lg py-20">
        <div className="rounded-3xl border bg-card p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl font-bold italic uppercase">Initialize_Explorer</h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your address is not registered on-chain. Create a callsign to start tracking your legacy.
          </p>
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Enter Callsign..."
              className="w-full rounded-xl border bg-background px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-primary outline-none"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <Button 
              variant="hero" 
              className="w-full py-6 font-bold uppercase tracking-widest"
              disabled={isRegistering || !usernameInput}
              onClick={handleRegister}
            >
              {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Create Profile [+]
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- ORIGINAL UI (If profile exists) ---
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-bold shadow-lg">
            {stats.username ? stats.username.slice(0, 2).toUpperCase() : "CQ"}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              {stats.username || displayAddr}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-foreground">Explorer</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {`Total Earned: ${stats.totalEarned} CQT`}
              </span>
            </div>
          </div>
        </div>
        <Link to="/create">
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Game
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          icon={Coins} 
          label="Total Earned" 
          value={`${stats.totalEarned} CQT`} 
          sub={`Wallet: ${parseFloat(ethBalance || "0").toFixed(4)} ETH`} 
        />
        <StatCard 
          icon={MapPin} 
          label="Quests Found" 
          value={stats.questsCompleted.toString()} 
          sub="On-chain verified" 
        />
        <StatCard 
          icon={Grid3X3} 
          label="Quests Created" 
          value={stats.questsCreated.toString()} 
          sub="Your deployments" 
        />
        <StatCard 
          icon={Target} 
          label="Accuracy" 
          value={stats.accuracy} 
          sub="Success rate" 
        />
      </div>

      {/* Badges Section */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Achievements</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {badges.map((badge) => {
            const isEarned = Number(stats.totalEarned) >= badge.minEarned;
            return (
              <div
                key={badge.name}
                className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
                  isEarned ? "bg-accent/10 border-accent/30 shadow-md scale-105" : "bg-card opacity-40 grayscale"
                }`}
              >
                <badge.icon className={`h-8 w-8 ${isEarned ? "text-accent" : "text-muted-foreground"}`} />
                <span className="mt-2 text-xs font-medium text-foreground">{badge.name}</span>
                {!isEarned && <span className="text-[10px] text-muted-foreground mt-1">{badge.minEarned} CQT</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Section */}
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Active Explorer Status</p>
              <p className="text-xs text-muted-foreground">Address: {displayAddr}</p>
            </div>
            <span className="text-sm font-semibold text-primary">Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;