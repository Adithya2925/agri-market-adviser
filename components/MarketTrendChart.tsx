import React from 'react';
import recharts from 'recharts';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,

} from 'recharts';

export interface ChartData {
  type: 'line' | 'bar';
  data: any[];
  dataKey: string;
  xAxisKey: string;
  yAxisLabel?: string;
}

interface MarketTrendChartProps {
  data: ChartData;
}

export const MarketTrendChart: React.FC<MarketTrendChartProps> = ({ data }) => {
  const { type, data: chartData, dataKey, xAxisKey, yAxisLabel } = data;

  // Detect dark mode from html class
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#d1d5db' : '#4b5563'; // gray-300 : gray-600
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb'; // gray-700 : gray-200
  const chartColor = '#10b981'; // emerald-500
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff'; // gray-800 : white

  const chartProps = {
    data: chartData,
    margin: {
      top: 5,
      right: 20,
      left: 30, // Increased left margin for Y-axis label
      bottom: 5,
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const wrapperStyle: React.CSSProperties = {
        backgroundColor: tooltipBg,
        border: `1px solid ${gridColor}`,
        padding: '8px 12px',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      };
      
      const labelStyle: React.CSSProperties = {
          color: textColor,
          margin: 0,
          padding: '2px 0',
          fontSize: '0.875rem', // text-sm
          textTransform: 'capitalize',
      };

      const dataPoint = payload[0];
      const dataPointName = dataPoint.name || dataPoint.dataKey; // e.g., 'price' or 'demand'
      const value = dataPoint.value;
      const xAxisValue = label;
      
      return (
        <div style={wrapperStyle}>
            <p style={labelStyle}>{`${xAxisKey}: ${xAxisValue}`}</p>
            <p style={{...labelStyle, color: chartColor, fontWeight: 'bold' }}>{`${dataPointName}: ${value}`}</p>
        </div>
      );
    }
    return null;
  };


  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisKey} stroke={textColor} tick={{ fontSize: 12 }} />
            <YAxis stroke={textColor} tick={{ fontSize: 12 }}>
              {yAxisLabel && (
                <Label
                  value={yAxisLabel}
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: textColor, fontSize: 14 }}
                  dy={40} // Adjust position
                />
              )}
            </YAxis>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: gridColor, strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{ fontSize: 14 }} />
            <Line type="monotone" dataKey={dataKey} stroke={chartColor} strokeWidth={2} activeDot={{ r: 6, stroke: chartColor, fill: tooltipBg, strokeWidth: 2 }} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xAxisKey} stroke={textColor} tick={{ fontSize: 12 }} />
            <YAxis stroke={textColor} tick={{ fontSize: 12 }}>
                 {yAxisLabel && (
                <Label
                  value={yAxisLabel}
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: textColor, fontSize: 14 }}
                  dy={40}
                />
              )}
            </YAxis>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)' }}
            />
            <Legend wrapperStyle={{ fontSize: 14 }} />
            <Bar dataKey={dataKey} fill={chartColor} />
          </BarChart>
        );
      default:
        return <p className="text-red-500">Invalid chart type specified.</p>;
    }
  };

  return (
    <div className="mt-4" style={{ width: '100%', height: 300, cursor: 'pointer' }}>
      <ResponsiveContainer>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};