import VirtualGrid from "../components/VirtualGrid";
import { Button } from "../components/ui/button";
import { Lightbulb, Send } from "lucide-react";
import { useState } from "react";

const hints = [
  "The treasure lies where the forest meets the stream.",
  "Look to the east of the ancient oak.",
  "Count twenty paces from the mossy rock.",
];

const HuntPage = () => {
  const [guessX, setGuessX] = useState("");
  const [guessY, setGuessY] = useState("");
  const [currentHint, setCurrentHint] = useState(0);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Virtual Hunt</h1>
        <p className="text-sm text-muted-foreground">Turn 3 — 5 active treasures</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <VirtualGrid />

        <div className="space-y-4">
          {/* Hint panel */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-accent" />
              <h3 className="font-display text-sm font-semibold text-foreground">Hints</h3>
            </div>
            <div className="space-y-2">
              {hints.slice(0, currentHint + 1).map((hint, i) => (
                <div key={i} className="rounded-lg bg-accent/10 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Hint {i + 1}</p>
                  <p className="text-sm text-foreground">{hint}</p>
                </div>
              ))}
              {currentHint < hints.length - 1 && (
                <button
                  onClick={() => setCurrentHint((c) => c + 1)}
                  className="text-xs text-accent hover:underline"
                >
                  Reveal next hint →
                </button>
              )}
            </div>
          </div>

          {/* Guess form */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">Submit Guess</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-muted-foreground">X</label>
                <input
                  type="number"
                  min={0}
                  max={127}
                  value={guessX}
                  onChange={(e) => setGuessX(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0-127"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Y</label>
                <input
                  type="number"
                  min={0}
                  max={127}
                  value={guessY}
                  onChange={(e) => setGuessY(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0-127"
                />
              </div>
            </div>
            <Button variant="hero" className="w-full gap-2">
              <Send className="h-4 w-4" />
              Submit Guess
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuntPage;
