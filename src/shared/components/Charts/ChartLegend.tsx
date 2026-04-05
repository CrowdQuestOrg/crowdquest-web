interface ChartLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    dataKey: string;
  }>;
  className?: string;
}

export const ChartLegend = ({ payload, className = '' }: ChartLegendProps) => {
  if (!payload || !payload.length) return null;

  return (
    <div className={`flex flex-wrap justify-center gap-4 mt-4 ${className}`}>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};