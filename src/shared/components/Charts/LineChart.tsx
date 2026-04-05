import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  Brush,
} from 'recharts';
import { ChartCard } from './ChartCard';
// import { ChartTooltip } from './ChartTooltip';
import { ChartLegend } from './ChartLegend';
import { chartColors, getColor } from './colors';
import type { ChartProps, ChartSeries } from './types';

export interface LineChartProps extends ChartProps {
  series: ChartSeries[];
  showDots?: boolean;
  showArea?: boolean;
  smooth?: boolean;
  strokeWidth?: number;
  dotSize?: number;
  valueFormatter?: (value: number) => string;
  showBrush?: boolean;
  brushHeight?: number;
}

export const LineChart = ({
  data,
  series,
  height = 350,
  width = '100%',
  className = '',
  loading = false,
  title,
  description,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  animate = true,
  margin = { top: 20, right: 30, bottom: 20, left: 40 },
  showDots = true,
  showArea = false,
  smooth = false,
  strokeWidth = 2,
  dotSize = 4,
  valueFormatter = (value) => value.toLocaleString(),
  showBrush = false,
  brushHeight = 30,
}: LineChartProps) => {
  
  const chart = (
    <ResponsiveContainer width={width as any} height={height as any}>
      <RechartsLineChart data={data} margin={margin}>
        {/* Gradients */}
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.primary.main} stopOpacity={0.3} />
            <stop offset="100%" stopColor={chartColors.primary.main} stopOpacity={0} />
          </linearGradient>
          {series.map((s, idx) => {
            const color = s.color || getColor(idx);
            return (
              <linearGradient
                key={`gradient-${s.dataKey}`}
                id={`gradient-${s.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Grid */}
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}

        {/* Axes */}
        <XAxis
          dataKey="name"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickLine={{ stroke: '#E5E7EB' }}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickLine={{ stroke: '#E5E7EB' }}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={valueFormatter}
        />

        {/* Tooltip - Now properly used */}
        {showTooltip && (
          <Tooltip
            // formatter={(value: number) => [valueFormatter(value), '']}
            cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
        )}

        {/* Legend */}
        {showLegend && (
          <Legend
            content={<ChartLegend />}
            wrapperStyle={{ paddingTop: 16 }}
          />
        )}

        {/* Reference Line */}
        <ReferenceLine y={0} stroke="#E5E7EB" />

        {/* Lines */}
        {series.map((s, idx) => {
          const color = s.color || getColor(idx);
          
          return (
            <Line
              key={s.dataKey}
              type={smooth ? 'monotone' : 'linear'}
              dataKey={s.dataKey}
              name={s.name}
              stroke={color}
              strokeWidth={strokeWidth}
              dot={showDots ? { r: dotSize, fill: color, strokeWidth: 2 } : false}
              activeDot={{ r: dotSize + 2 }}
              animationDuration={animate ? 500 : 0}
              fill={`url(#gradient-${s.dataKey})`}
            />
          );
        })}

        {/* Areas - Removed unused color variable */}
        {showArea && series.map((s) => {
          return (
            <Area
              key={`area-${s.dataKey}`}
              type="monotone"
              dataKey={s.dataKey}
              fill={`url(#gradient-${s.dataKey})`}
              stroke="none"
              animationDuration={animate ? 500 : 0}
            />
          );
        })}

        {/* Brush for zooming */}
        {showBrush && data.length > 20 && (
          <Brush
            dataKey="name"
            height={brushHeight}
            stroke={chartColors.primary.main}
            fill={chartColors.primary.lighter}
            fillOpacity={0.2}
            travellerWidth={10}
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );

  return (
    <ChartCard
      title={title}
      description={description}
      loading={loading}
      className={className}
    >
      {chart}
    </ChartCard>
  );
};