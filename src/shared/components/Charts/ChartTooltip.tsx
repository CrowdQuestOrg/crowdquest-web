import type { TooltipProps } from 'recharts';
// import { chartColors } from './colors';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: number | string | undefined, name: string) => string;
}

export const ChartTooltip = ({ active, payload, label, formatter }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[150px] animate-fade-in">
      <p className="text-sm font-semibold text-gray-900 mb-2 border-b border-gray-100 pb-1">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatter
                ? formatter(entry.value, entry.name)
                : typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};