import { useState, useRef, useCallback } from "react";
import { MapPin } from "lucide-react";
import forestBg from "../assets/forest-grid-bg.jpg";

const GRID_SIZE = 32;
const CELL_SIZE = 28;

interface VirtualGridProps {
  onCellSelect?: (x: number, y: number) => void;
  selectedCellProp?: { x: number; y: number } | null;
  // New Props for dynamic behavior
  treasures?: any[]; 
  showTreasures?: boolean;
}

const VirtualGrid = ({ 
  onCellSelect, 
  selectedCellProp, 
  treasures = [], // Default to empty array
  showTreasures = false // Default to hidden (Safe for Create Page)
}: VirtualGridProps) => {
  const [selectedCellLocal, setSelectedCellLocal] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use prop if provided, otherwise use local state
  const selectedCell = selectedCellProp !== undefined ? selectedCellProp : selectedCellLocal;

  const handleCellClick = useCallback((x: number, y: number) => {
    setSelectedCellLocal({ x, y });
    onCellSelect?.(x, y);
  }, [onCellSelect]);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-tighter text-foreground italic">
            Virtual_Grid_Link
          </h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase">
            {GRID_SIZE}×{GRID_SIZE} — {showTreasures ? treasures.length : 0} detected_signals
          </p>
        </div>
        {selectedCell && (
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-primary uppercase">Locked_Coords</span>
            <span className="font-mono text-xs font-black text-foreground">
              X:{selectedCell.x} Y:{selectedCell.y}
            </span>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative overflow-auto p-2 scrollbar-thin scrollbar-thumb-primary/20"
        style={{ maxHeight: 500 }}
      >
        <div
          className="relative shadow-2xl"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            backgroundImage: `url(${forestBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            imageRendering: "pixelated",
          }}
        >
          {/* Grid lines overlay */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ opacity: 0.15 }}>
            {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
              <g key={i}>
                <line
                  x1={i * CELL_SIZE} y1={0}
                  x2={i * CELL_SIZE} y2={GRID_SIZE * CELL_SIZE}
                  stroke="currentColor" strokeWidth={1}
                />
                <line
                  x1={0} y1={i * CELL_SIZE}
                  x2={GRID_SIZE * CELL_SIZE} y2={i * CELL_SIZE}
                  stroke="currentColor" strokeWidth={1}
                />
              </g>
            ))}
          </svg>

          {/* Cells interaction layer */}
          {Array.from({ length: GRID_SIZE }).map((_, y) =>
            Array.from({ length: GRID_SIZE }).map((_, x) => {
              const isSelected = selectedCell?.x === x && selectedCell?.y === y;
              const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
              return (
                <div
                  key={`${x}-${y}`}
                  className={`absolute cursor-crosshair transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/40 ring-2 ring-primary z-10 scale-105"
                      : isHovered
                        ? "bg-primary/10 border border-primary/30"
                        : ""
                  }`}
                  style={{
                    left: x * CELL_SIZE,
                    top: y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                  onClick={() => handleCellClick(x, y)}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              );
            })
          )}

          {/* Treasure markers (Only show if showTreasures is true) */}
          {showTreasures && treasures.map((t) => (
            <div
              key={t.id}
              className="absolute flex items-center justify-center animate-pulse rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] z-20"
              style={{
                left: t.x * CELL_SIZE + CELL_SIZE / 2 - 10,
                top: t.y * CELL_SIZE + CELL_SIZE / 2 - 10,
                width: 20,
                height: 20,
              }}
            >
              <MapPin className="h-3 w-3 text-primary-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualGrid;