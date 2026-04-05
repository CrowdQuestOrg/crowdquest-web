import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ChartCard } from './ChartCard';
// import { ChartTooltip } from './ChartTooltip';
import { ChartLegend } from './ChartLegend';
import { chartColors, getColor } from './colors';
import type { ChartProps, ChartSeries } from './types';

export interface BarChartProps extends ChartProps {
  series: ChartSeries[];
  layout?: 'vertical' | 'horizontal';
  stacked?: boolean;
  showValues?: boolean;
  valueFormatter?: (value: number) => string;
  barSize?: number;
  barGap?: number;
  barCategoryGap?: number;
}

export const BarChart = ({
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
  layout = 'horizontal',
  stacked = false,
  showValues = false,
  valueFormatter = (value) => value.toLocaleString(),
  barSize,
  barGap,
  barCategoryGap,
}: BarChartProps) => {
  
  // Tooltip formatter function
  const tooltipFormatter = (value: any, name: string) => {
    if (value === undefined || value === null) return ['-', name];
    const formattedValue = typeof value === 'number' ? valueFormatter(value) : value;
    return [formattedValue, name];
  };

  // Label formatter for bar values
  const labelFormatter = (value: any) => {
    if (value === undefined || value === null) return '';
    return typeof value === 'number' ? valueFormatter(value) : value;
  };

  const renderBar = (s: ChartSeries, index: number) => {
    const color = s.color || getColor(index);
    
    return (
      <Bar
        key={s.dataKey}
        dataKey={s.dataKey}
        name={s.name}
        fill={color}
        stackId={stacked ? 'stack' : s.stackId}
        radius={[4, 4, 0, 0]}
        barSize={barSize}
        animationDuration={animate ? 500 : 0}
        label={
          showValues
            ? {
                position: 'top' as const,
                formatter: labelFormatter,
                fill: '#374151',
                fontSize: 11,
              }
            : false
        }
      >
        {!stacked &&
          data.map((_, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={color}
              fillOpacity={0.8}
              style={{
                transition: 'fill-opacity 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e: any) => {
                e.target.setAttribute('fill-opacity', '1');
              }}
              onMouseLeave={(e: any) => {
                e.target.setAttribute('fill-opacity', '0.8');
              }}
            />
          ))}
      </Bar>
    );
  };

  const chart = (
    <ResponsiveContainer width={width as any} height={height as any}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={margin}
        barGap={barGap}
        barCategoryGap={barCategoryGap}
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.primary.main} stopOpacity={1} />
            <stop offset="100%" stopColor={chartColors.primary.light} stopOpacity={0.8} />
          </linearGradient>
        </defs>

        {/* Grid */}
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}

        {/* Axes */}
        {layout === 'horizontal' ? (
          <>
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
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={valueFormatter}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
          </>
        )}

        {/* Tooltip */}
        {showTooltip && (
          <Tooltip
            // formatter={tooltipFormatter}
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
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

        {/* Bars */}
        {series.map((s, idx) => renderBar(s, idx))}
      </RechartsBarChart>
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