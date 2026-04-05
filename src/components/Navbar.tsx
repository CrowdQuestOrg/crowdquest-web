import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { MapPin, Grid3X3, User, Menu, X, Compass, LogOut } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";

const navItems = [
  { to: "/", label: "Home", icon: Compass },
  { to: "/hunt", label: "Virtual Hunt", icon: Grid3X3 },
  { to: "/scan", label: "Scan QR", icon: MapPin },
  { to: "/profile", label: "Profile", icon: User },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">CrowdQuest</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <Button
                  variant="ghost"
                  className={`gap-2 ${isActive ? "bg-accent/15 text-accent-foreground font-semibold" : "text-muted-foreground"}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-accent/15 px-3 py-1.5 font-display text-xs font-medium text-accent-foreground">
                {shortAddr}
              </span>
              <Button variant="ghost" size="icon" onClick={disconnect}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="hero" size="sm" onClick={connect} disabled={isConnecting}>
              {isConnecting ? "Connecting…" : "Connect Wallet"}
            </Button>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground md:hidden">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-2 ${isActive ? "bg-accent/15 font-semibold" : "text-muted-foreground"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            {isConnected ? (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium text-accent-foreground">{shortAddr}</span>
                <Button variant="ghost" size="sm" onClick={disconnect}>
                  <LogOut className="h-4 w-4 mr-1" /> Disconnect
                </Button>
              </div>
            ) : (
              <Button variant="hero" className="mt-2" onClick={connect} disabled={isConnecting}>
                {isConnecting ? "Connecting…" : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
