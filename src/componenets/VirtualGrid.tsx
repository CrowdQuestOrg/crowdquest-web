import { useState, useRef, useCallback } from "react";
import { MapPin } from "lucide-react";
import forestBg from "@/assets/forest-grid-bg.jpg";

const GRID_SIZE = 32;
const CELL_SIZE = 28;

const treasures = [
  { x: 5, y: 8, id: 1 },
  { x: 18, y: 12, id: 2 },
  { x: 25, y: 3, id: 3 },
  { x: 10, y: 22, id: 4 },
  { x: 28, y: 28, id: 5 },
];

interface VirtualGridProps {
  onCellSelect?: (x: number, y: number) => void;
  selectedCellProp?: { x: number; y: number } | null;
}

const VirtualGrid = ({ onCellSelect, selectedCellProp }: VirtualGridProps) => {
  const [selectedCellLocal, setSelectedCellLocal] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCell = selectedCellProp !== undefined ? selectedCellProp : selectedCellLocal;

  const handleCellClick = useCallback((x: number, y: number) => {
    setSelectedCellLocal({ x, y });
    onCellSelect?.(x, y);
  }, [onCellSelect]);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Virtual Grid</h3>
          <p className="text-xs text-muted-foreground">128×128 — {treasures.length} active treasures</p>
        </div>
        {selectedCell && (
          <span className="rounded-md bg-accent/15 px-2 py-1 font-display text-xs font-medium text-accent-foreground">
            ({selectedCell.x}, {selectedCell.y})
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        className="relative overflow-auto p-2"
        style={{ maxHeight: 400 }}
      >
        <div
          className="relative"
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
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ opacity: 0.25 }}>
            {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
              <g key={i}>
                <line
                  x1={i * CELL_SIZE} y1={0}
                  x2={i * CELL_SIZE} y2={GRID_SIZE * CELL_SIZE}
                  stroke="hsl(var(--foreground))" strokeWidth={0.5}
                />
                <line
                  x1={0} y1={i * CELL_SIZE}
                  x2={GRID_SIZE * CELL_SIZE} y2={i * CELL_SIZE}
                  stroke="hsl(var(--foreground))" strokeWidth={0.5}
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
                  className={`absolute cursor-crosshair transition-colors duration-75 ${
                    isSelected
                      ? "bg-accent/40 ring-1 ring-accent"
                      : isHovered
                        ? "bg-accent/15"
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

          {/* Treasure markers */}
          {treasures.map((t) => (
            <div
              key={t.id}
              className="absolute flex items-center justify-center animate-pulse-glow rounded-full bg-accent"
              style={{
                left: t.x * CELL_SIZE + CELL_SIZE / 2 - 10,
                top: t.y * CELL_SIZE + CELL_SIZE / 2 - 10,
                width: 20,
                height: 20,
              }}
            >
              <MapPin className="h-3 w-3 text-accent-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualGrid;
