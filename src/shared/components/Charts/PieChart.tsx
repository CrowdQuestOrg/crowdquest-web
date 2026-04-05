import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import { useState } from 'react';
import { ChartCard } from './ChartCard';
// import { ChartTooltip } from './ChartTooltip';
import { ChartLegend } from './ChartLegend';
import { getColor } from './colors';
import type { ChartProps } from './types';

export interface PieChartProps extends ChartProps {
  data: any[]; // Override to make data required and typed
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  showPercentage?: boolean;
  valueFormatter?: (value: number) => string;
  donut?: boolean;
  label?: boolean;
  activeIndex?: number;
}

export const PieChart = ({
  data,
  height = 350,
  width = '100%',
  className = '',
  loading = false,
  title,
  description,
  showLegend = true,
  showTooltip = true,
  animate = true,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 0,
  outerRadius = 100,
  showPercentage = false,
  valueFormatter = (value) => value.toLocaleString(),
  donut = false,
  label = false,
  activeIndex: externalActiveIndex,
}: PieChartProps) => {
  
  const [activeIndex, setActiveIndex] = useState(externalActiveIndex || -1);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius: ir,
      outerRadius: or,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={ir}
          outerRadius={or + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.9}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={or + 10}
          outerRadius={or + 14}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="#374151"
          className="text-sm font-medium"
        >
          {payload[nameKey]}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="#6B7280"
          className="text-sm"
        >
          {valueFormatter(value)} ({Math.round(percent * 100)}%)
        </text>
      </g>
    );
  };

  const getLabel = (entry: any) => {
    if (showPercentage) {
      const total = data.reduce((sum, d) => sum + (d[dataKey] || 0), 0);
      const percentage = ((entry[dataKey] / total) * 100).toFixed(1);
      return `${entry[nameKey]}: ${percentage}%`;
    }
    return entry[nameKey];
  };

  // Tooltip formatter function
  const tooltipFormatter = (value: any, name: string) => {
    if (value === undefined || value === null) return ['-', name];
    const formattedValue = typeof value === 'number' ? valueFormatter(value) : value;
    return [formattedValue, name];
  };

  // Calculate the actual inner radius for donut charts
  const actualInnerRadius = donut ? outerRadius * 0.6 : innerRadius;

  const chart = (
    <ResponsiveContainer width={width as any} height={height as any}>
      <RechartsPieChart margin={margin}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={label ? getLabel : false}
          innerRadius={actualInnerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          animationDuration={animate ? 500 : 0}
          activeShape={activeIndex !== -1 ? renderActiveShape : undefined}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || getColor(index)}
              stroke="white"
              strokeWidth={2}
              style={{
                transition: 'filter 0.3s',
                cursor: 'pointer',
              }}
            />
          ))}
        </Pie>
        
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
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  // Calculate total for summary
  const total = data.reduce((sum, d) => sum + (d[dataKey] || 0), 0);

  return (
    <ChartCard
      title={title}
      description={description}
      loading={loading}
      className={className}
      actions={
        total > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-primary">{valueFormatter(total)}</p>
          </div>
        )
      }
    >
      {chart}
    </ChartCard>
  );
};