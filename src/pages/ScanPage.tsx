import { Camera, QrCode, KeyboardIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";

const ScanPage = () => {
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [manualCode, setManualCode] = useState("");

  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl font-bold text-foreground">Scan QR Code</h1>
      <p className="text-sm text-muted-foreground mb-6">Scan a treasure QR code to claim your reward</p>

      <div className="mx-auto max-w-md space-y-4">
        {/* Mode toggle */}
        <div className="flex rounded-lg border bg-card p-1">
          <button
            onClick={() => setMode("camera")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "camera" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <Camera className="mr-1.5 inline h-4 w-4" />
            Camera
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "manual" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <KeyboardIcon className="mr-1.5 inline h-4 w-4" />
            Manual
          </button>
        </div>

        {mode === "camera" ? (
          <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border bg-card">
            <div className="text-center">
              <QrCode className="mx-auto h-16 w-16 text-muted-foreground/40" />
              <p className="mt-4 text-sm text-muted-foreground">Camera access required</p>
              <Button variant="hero" className="mt-4">
                Enable Camera
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-6">
            <label className="text-sm font-medium text-foreground">Treasure Address</label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="mt-2 w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="0x1234...abcd"
            />
            <Button variant="hero" className="mt-4 w-full">
              Verify & Claim
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
