export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  color?: string;
  stackId?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  height?: number | string;
  width?: number | string;
  className?: string;
  loading?: boolean;
  title?: string;
  description?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
}