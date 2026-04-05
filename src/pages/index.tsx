import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Grid3X3, MapPin, Trophy, Coins, ArrowRight } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const { isConnected, connect } = useWallet();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-hero opacity-80" />
        <div className="relative z-10 container flex min-h-[85vh] flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/80">Decentralized Treasure Hunting</span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl max-w-3xl">
            Hunt. Hide.{" "}
            <span className="text-gradient">Earn.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/70">
            Create and discover treasures in the real world and on a virtual grid.
            Stake tokens, solve hints, claim rewards — all on-chain.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {isConnected ? (
              <Link to="/create">
                <Button variant="hero" size="lg" className="gap-2 text-base px-8">
                  Create a Game
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="hero" size="lg" className="gap-2 text-base px-8" onClick={connect}>
                Connect Wallet
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            <Link to="/hunt">
              <Button variant="heroOutline" size="lg" className="gap-2 text-base px-8 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                Explore Grid
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground">Two Ways to Play</h2>
          <p className="mt-2 text-muted-foreground">Real-world QR hunts or virtual grid-based treasure discovery</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: "Real-World Hunt", desc: "Scan QR codes hidden in physical locations to claim rewards" },
            { icon: Grid3X3, title: "Virtual Grid", desc: "Navigate a 128×128 grid, solve hints, guess coordinates" },
            { icon: Coins, title: "Token Rewards", desc: "Earn based on speed — faster finds mean bigger payouts" },
            { icon: Trophy, title: "Rank Up", desc: "Earn badges, climb the leaderboard, become a Legend" },
          ].map((f, i) => (
            <div
              key={i}
              className="group rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-accent/20">
                <f.icon className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reward tiers */}
      <section className="border-t bg-card/50">
        <div className="container py-20">
          <h2 className="font-display text-3xl font-bold text-foreground text-center">Reward Tiers</h2>
          <p className="mt-2 text-center text-muted-foreground mb-12">Find treasures faster for bigger payouts</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { time: "< 1 hour", pct: "90%", turn: "Turn 1" },
              { time: "1h – 3 days", pct: "70%", turn: "Turn 5" },
              { time: "3 – 4 days", pct: "50%", turn: "Turn 10" },
              { time: "4 – 7 days", pct: "35%", turn: "Turn 15" },
              { time: "> 7 days", pct: "20%", turn: "Turn 20" },
            ].map((tier, i) => (
              <div key={i} className="rounded-xl border bg-background p-5 text-center">
                <p className="font-display text-3xl font-bold text-accent">{tier.pct}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{tier.time}</p>
                <p className="text-xs text-muted-foreground">{tier.turn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          CrowdQuest — Fully Decentralized. No admin keys. No central control.
        </div>
      </footer>
    </div>
  );
};

export default Index;
