// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Map, 
  Scan, 
  User, 
  Plus, 
  Home,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Flame,
  Shield,
  Zap,
  Crown,
  Star,
  Gift,
  ChevronRight,
  Users
} from 'lucide-react';

// Custom Components using Tailwind classes
const Card = ({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`game-card ${hover ? 'game-card-hover' : ''} ${className}`}>
    {children}
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false,
  fullWidth = false,
  className = "",
  ...props 
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary: "game-button-primary",
    secondary: "game-button-secondary",
    outline: "game-button-outline",
    danger: "game-button-danger"
  };
  
  const sizes: Record<string, string> = {
    sm: "game-button-sm",
    md: "game-button-md",
    lg: "game-button-lg"
  };
  
  return (
    <button 
      className={`game-button ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <div className="loading-spinner w-4 h-4 inline-block mr-2" />}
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'gold';
  icon?: React.ReactNode;
  className?: string;
}

const Badge = ({ children, variant = "info", icon, className = "" }: BadgeProps) => {
  const variants: Record<string, string> = {
    success: "badge-success",
    warning: "badge-warning",
    info: "badge-info",
    gold: "badge-gold"
  };
  
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

// Mock wallet hook for demonstration
const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  
  const connect = async () => {
    // Mock connection
    setIsConnected(true);
    setAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0b359");
    setBalance("1250.50");
  };
  
  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance("0");
  };
  
  return { isConnected, address, balance, connect, disconnect };
};

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  const { isConnected, balance, connect, disconnect } = useWallet();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/virtual', icon: Map, label: 'Virtual' },
    { path: '/scan', icon: Scan, label: 'Scan' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-background-card/95 backdrop-blur-md border-b border-primary sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <Compass className="w-8 h-8 text-accent group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-bold text-gradient">
                CrowdQuest
              </span>
            </Link>
            
            <div className="flex space-x-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 ${
                    isActive(path)
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-secondary hover:text-text-primary hover:bg-primary/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Balance</p>
                    <p className="text-sm font-semibold text-accent">{balance} CQT</p>
                  </div>
                  <Button onClick={disconnect} variant="outline" size="sm">
                    Exit
                  </Button>
                </div>
              ) : (
                <Button onClick={connect} size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-card/95 backdrop-blur-md border-t border-primary z-50">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive(path)
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

// Layout Component
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark to-background">
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-8 pb-24 md:pb-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

// Home Page
const HomePage = () => {
  const { isConnected, balance } = useWallet();
  
  const features = [
    { icon: Map, title: 'Virtual Treasure Hunt', description: 'Explore the 128x128 grid and find hidden treasures with progressive hints', color: 'accent', link: '/virtual' },
    { icon: Scan, title: 'Real-World QR Hunt', description: 'Scan QR codes in physical locations to discover real treasures', color: 'primary', link: '/scan' },
    { icon: Trophy, title: 'Compete & Earn', description: 'Race against time and other players to claim rewards', color: 'secondary', link: '/profile' },
  ];
  
  const stats = [
    { label: 'Active Treasures', value: '247', icon: Map, trend: '+12%' },
    { label: 'Total Players', value: '1,234', icon: Users, trend: '+8%' },
    { label: 'Total Rewards', value: '12,345 CQT', icon: TrendingUp, trend: '+23%' },
  ];
  
  const activeTreasures = [
    { id: 1, stake: 500, creator: "0x742d...b359", timeLeft: "2h 30m", difficulty: "Hard" as const },
    { id: 2, stake: 250, creator: "0x1234...5678", timeLeft: "5h 15m", difficulty: "Medium" as const },
    { id: 3, stake: 1000, creator: "0x9876...4321", timeLeft: "1d 3h", difficulty: "Extreme" as const },
    { id: 4, stake: 150, creator: "0xabcd...efgh", timeLeft: "12h", difficulty: "Easy" as const },
  ];
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center p-2 bg-accent/10 rounded-full mb-4 glow-effect">
          <Sparkles className="w-5 h-5 text-accent mr-2" />
          <span className="text-accent font-semibold">Decentralized Treasure Hunt</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient">
          CrowdQuest
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Hide treasures, solve puzzles, and earn rewards in a fully decentralized world
        </p>
        {isConnected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-6 inline-flex items-center space-x-2 bg-primary/20 rounded-full px-4 py-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-text-primary">Balance: {balance} CQT</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 text-center">
              <stat.icon className="w-10 h-10 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold text-text-primary mb-1">{stat.value}</div>
              <div className="text-text-secondary">{stat.label}</div>
              {stat.trend && (
                <Badge variant="success" className="mt-2">
                  {stat.trend}
                </Badge>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Features Section */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <Zap className="w-6 h-6 text-accent mr-2" />
          How to Play
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="p-6 text-center h-full flex flex-col">
                <div className={`w-16 h-16 rounded-full bg-${feature.color}/10 flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary mb-6 flex-grow">{feature.description}</p>
                <Link to={feature.link}>
                  <Button variant={feature.color === 'accent' ? 'primary' : 'secondary'} fullWidth>
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-2 inline" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Active Treasures */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <Target className="w-6 h-6 text-accent mr-2" />
          Active Treasures
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {activeTreasures.map((treasure, index) => (
            <motion.div
              key={treasure.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Treasure #{treasure.id}</h3>
                    <p className="text-sm text-text-secondary">Creator: {treasure.creator}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">Stake</p>
                    <p className="font-semibold text-accent">{treasure.stake} CQT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">Time Left</p>
                    <p className="font-semibold text-text-primary flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {treasure.timeLeft}
                    </p>
                  </div>
                  <Badge variant={treasure.difficulty === "Extreme" ? "gold" : "info"}>
                    {treasure.difficulty}
                  </Badge>
                  <Button size="sm">Hunt →</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Leaderboard Preview */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
          <Crown className="w-6 h-6 text-accent mr-2" />
          Top Hunters
        </h2>
        <Card className="p-6">
          <div className="space-y-3">
            {[
              { rank: 1, name: "0x742d...b359", finds: 47, earnings: 12500, icon: Crown },
              { rank: 2, name: "0x1234...5678", finds: 38, earnings: 9800, icon: Star },
              { rank: 3, name: "0x9876...4321", finds: 31, earnings: 7200, icon: Flame },
            ].map((player) => (
              <div key={player.rank} className="flex items-center justify-between p-3 bg-background-light/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-${player.rank === 1 ? 'accent' : 'text-primary'}`}>
                    #{player.rank}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{player.name}</p>
                    <p className="text-xs text-text-secondary">{player.finds} treasures found</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <player.icon className="w-4 h-4 text-accent" />
                  <span className="font-bold text-accent">{player.earnings} CQT</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Placeholder components for other pages
const VirtualModePage = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-text-primary mb-4">Virtual Treasure Hunt</h1>
    <p className="text-text-secondary">Coming soon... 128x128 grid gameplay</p>
  </div>
);

const ScanPage = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-text-primary mb-4">QR Code Scanner</h1>
    <p className="text-text-secondary">Scan real-world QR codes to find treasures</p>
  </div>
);

const CreatePage = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-text-primary mb-4">Create Treasure</h1>
    <p className="text-text-secondary">Hide your treasure and stake tokens</p>
  </div>
);

const ProfilePage = () => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-text-primary mb-4">Player Profile</h1>
    <p className="text-text-secondary">View your stats and achievements</p>
  </div>
);

// Main App Component
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/virtual" element={<VirtualModePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#3a5a40',
            color: '#dad7cd',
            borderRadius: '1rem',
            padding: '1rem',
          },
          success: {
            iconTheme: {
              primary: '#bfd200',
              secondary: '#344e41',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#344e41',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;