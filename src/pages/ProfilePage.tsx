import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
import { Trophy, Coins, MapPin, Grid3X3, Target, Zap, Star, Plus } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";

const badges = [
  { name: "First Treasure", icon: Star, earned: true },
  { name: "Speed Demon", icon: Zap, earned: true },
  { name: "One & Done", icon: Target, earned: false },
  { name: "Treasure Hunter", icon: Trophy, earned: false },
  { name: "Master Hider", icon: MapPin, earned: false },
  { name: "Grid Explorer", icon: Grid3X3, earned: false },
];

const ProfilePage = () => {
  const { address, isConnected } = useWallet();
  const displayAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x1a2b...9f3e";

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-bold">
            CQ
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">{displayAddr}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-foreground">Explorer</span>
              <span className="text-xs text-muted-foreground">Score: 2,450</span>
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={Coins} label="Total Earned" value="1,240 CQ" sub="+340 this week" />
        <StatCard icon={MapPin} label="Treasures Found" value="12" sub="8 virtual, 4 real-world" />
        <StatCard icon={Grid3X3} label="Created" value="3" sub="2 active" />
        <StatCard icon={Target} label="Accuracy" value="67%" sub="12/18 guesses" />
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Achievements</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
                badge.earned
                  ? "bg-accent/10 border-accent/30 shadow-[var(--shadow-card)]"
                  : "bg-card opacity-40"
              }`}
            >
              <badge.icon className={`h-8 w-8 ${badge.earned ? "text-accent" : "text-muted-foreground"}`} />
              <span className="mt-2 text-xs font-medium text-foreground">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {[
            { action: "Found", treasure: "Forest Cache #42", reward: "+180 CQ", time: "2h ago" },
            { action: "Created", treasure: "City Grid #7", reward: "-500 CQ staked", time: "1d ago" },
            { action: "Found", treasure: "Virtual #128", reward: "+95 CQ", time: "3d ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.action}: {item.treasure}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className={`text-sm font-semibold ${item.reward.startsWith("+") ? "text-primary" : "text-muted-foreground"}`}>
                {item.reward}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
