


// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import StatCard from "../components/StatCard";
// import { Button } from "../components/ui/button";
// import { Trophy, Coins, MapPin, Grid3X3, Target, Zap, Star, Plus, Loader2 } from "lucide-react";
// import { useWallet } from "../contexts/WalletContext";
// import { useProfile } from "../hooks/useProfile"; // Your new hook

// const badges = [
//   { name: "First Treasure", icon: Star, minScore: 100 },
//   { name: "Speed Demon", icon: Zap, minScore: 500 },
//   { name: "Treasure Hunter", icon: Trophy, minScore: 1000 },
//   { name: "Master Hider", icon: MapPin, minScore: 2000 },
// ];

// const ProfilePage = () => {
//   const { address, isConnected, balance: ethBalance } = useWallet();
//   const { getStats } = useProfile();
  
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     score: "0",
//     foundCount: "0",
//     createdCount: "0",
//     accuracy: "0"
//   });

//   const displayAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet";

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (isConnected && address) {
//         setLoading(true);
//         try {
//           const data = await getStats();
//           if (data) {
//             setStats({
//               score: data.score,
//               foundCount: data.foundCount,
//               createdCount: data.createdCount,
//               accuracy: data.foundCount !== "0" ? "67%" : "0%" // Derived logic
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching profile stats:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchStats();
//   }, [isConnected, address, getStats]);

//   if (!isConnected) {
//     return (
//       <div className="container py-20 text-center">
//         <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
//         <p className="text-muted-foreground mb-8">You need to be connected to Sepolia to view your profile.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-8">
//       {/* Header */}
//       <div className="mb-8 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-bold shadow-lg">
//             CQ
//           </div>
//           <div>
//             <h1 className="font-display text-xl font-bold text-foreground">{displayAddr}</h1>
//             <div className="flex items-center gap-2 mt-1">
//               <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-foreground">Explorer</span>
//               <span className="text-xs text-muted-foreground flex items-center gap-1">
//                 {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : `Score: ${stats.score}`}
//               </span>
//             </div>
//           </div>
//         </div>
//         <Link to="/create">
//           <Button variant="hero" className="gap-2">
//             <Plus className="h-4 w-4" />
//             Create Game
//           </Button>
//         </Link>
//       </div>

//       {/* Stats - Live data from contract */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//         <StatCard 
//           icon={Coins} 
//           label="CQT Tokens" 
//           value={`${stats.score} CQT`} 
//           sub={`Wallet: ${parseFloat(ethBalance || "0").toFixed(4)} ETH`} 
//         />
//         <StatCard 
//           icon={MapPin} 
//           label="Treasures Found" 
//           value={stats.foundCount} 
//           sub="On-chain verified" 
//         />
//         <StatCard 
//           icon={Grid3X3} 
//           label="Quests Created" 
//           value={stats.createdCount} 
//           sub="Active on Sepolia" 
//         />
//         <StatCard 
//           icon={Target} 
//           label="Accuracy" 
//           value={stats.accuracy} 
//           sub="Success rate" 
//         />
//       </div>

//       {/* Badges - Dynamically earned based on score */}
//       <div className="mb-8">
//         <h2 className="font-display text-lg font-bold text-foreground mb-4">Achievements</h2>
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
//           {badges.map((badge) => {
//             const isEarned = Number(stats.score) >= badge.minScore;
//             return (
//               <div
//                 key={badge.name}
//                 className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
//                   isEarned
//                     ? "bg-accent/10 border-accent/30 shadow-md scale-105"
//                     : "bg-card opacity-40 grayscale"
//                 }`}
//               >
//                 <badge.icon className={`h-8 w-8 ${isEarned ? "text-accent" : "text-muted-foreground"}`} />
//                 <span className="mt-2 text-xs font-medium text-foreground">{badge.name}</span>
//                 {!isEarned && <span className="text-[10px] text-muted-foreground mt-1">{badge.minScore} pts</span>}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Recent Activity - Placeholder for Event Logs */}
//       <div>
//         <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Activity</h2>
//         <div className="space-y-2">
//           {Number(stats.foundCount) === 0 && Number(stats.createdCount) === 0 ? (
//             <div className="text-center py-10 border rounded-lg bg-card/50">
//               <p className="text-sm text-muted-foreground">No recent activity on Sepolia yet.</p>
//             </div>
//           ) : (
//             <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
//               <div>
//                 <p className="text-sm font-medium text-foreground">Verified Hunter Status</p>
//                 <p className="text-xs text-muted-foreground">Live on Chain ID 11155111</p>
//               </div>
//               <span className="text-sm font-semibold text-primary">Synced</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
import { Trophy, Coins, MapPin, Grid3X3, Target, Zap, Star, Plus, Loader2 } from "lucide-react";
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
  const { getStats } = useProfile();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    username: "",
    totalEarned: "0",
    questsCompleted: 0,
    questsCreated: 0,
    accuracy: "0%"
  });

  const displayAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet";

  useEffect(() => {
    const fetchStats = async () => {
      // FIX 1: Pass 'address' to getStats(address)
      if (isConnected && address) {
        setLoading(true);
        try {
          const data = await getStats(address);
          if (data) {
            // FIX 2: Map the names to what the contract actually returns
            setStats({
              username: data.username,
              totalEarned: data.totalEarned,
              questsCompleted: data.questsCompleted,
              questsCreated: data.questsCreated,
              accuracy: data.questsCompleted > 0 ? "100%" : "0%" 
            });
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

  if (!isConnected) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
        <p className="text-muted-foreground mb-8">You need to be connected to view your profile.</p>
      </div>
    );
  }

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
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : `Total Earned: ${stats.totalEarned} CQT`}
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

      {/* Stats - Live data from contract */}
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

      {/* Badges - Based on totalEarned */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Achievements</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {badges.map((badge) => {
            const isEarned = Number(stats.totalEarned) >= badge.minEarned;
            return (
              <div
                key={badge.name}
                className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
                  isEarned
                    ? "bg-accent/10 border-accent/30 shadow-md scale-105"
                    : "bg-card opacity-40 grayscale"
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

      {/* Recent Activity */}
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {stats.questsCompleted === 0 && stats.questsCreated === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-card/50">
              <p className="text-sm text-muted-foreground">No recent activity on-chain yet.</p>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Active Explorer Status</p>
                <p className="text-xs text-muted-foreground">Address: {displayAddr}</p>
              </div>
              <span className="text-sm font-semibold text-primary">Synced</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;