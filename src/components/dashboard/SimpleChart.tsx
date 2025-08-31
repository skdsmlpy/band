"use client";

import { Icon } from "@iconify/react";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: string;
  showValues?: boolean;
  title?: string;
}

export function BarChart({ data, height = "h-48", showValues = true, title }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  if (data.length === 0) {
    return (
      <div className={`${height} flex items-center justify-center text-gray-500`}>
        <div className="text-center">
          <Icon icon="material-symbols:bar-chart" width={40} className="mb-2 mx-auto" />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h4 className="font-medium text-gray-900 dark:text-gray-100">{title}</h4>}
      <div className={`${height} flex items-end justify-between gap-2`}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const color = item.color || "bg-teal-500";
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-full">
                {showValues && (
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {item.value}
                  </span>
                )}
                <div
                  className={`w-full ${color} rounded-t transition-all duration-500 ease-out`}
                  style={{ height: `${barHeight}%`, minHeight: item.value > 0 ? '4px' : '0px' }}
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center break-words">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: DataPoint[];
  size?: number;
  showLegend?: boolean;
  centerText?: string;
  centerSubtext?: string;
}

export function DonutChart({ 
  data, 
  size = 120, 
  showLegend = true, 
  centerText, 
  centerSubtext 
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Icon icon="material-symbols:donut-large" width={40} className="mb-2 mx-auto" />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  let cumulativePercentage = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;
    
    return {
      ...item,
      percentage: percentage,
      percentageFormatted: percentage.toFixed(1),
      startAngle,
      endAngle,
      color: item.color || `hsl(${(index * 45) % 360}, 65%, 55%)`
    };
  });

  const radius = size / 2;
  const strokeWidth = size / 8;
  const innerRadius = radius - strokeWidth / 2;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            className="dark:stroke-gray-600"
          />
          {segments.map((segment, index) => {
            const circumference = 2 * Math.PI * innerRadius;
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercentage - segment.percentage) / 100) * circumference;
            
            return (
              <circle
                key={index}
                cx={radius}
                cy={radius}
                r={innerRadius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        
        {(centerText || centerSubtext) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerText && (
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {centerText}
              </div>
            )}
            {centerSubtext && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {centerSubtext}
              </div>
            )}
          </div>
        )}
      </div>

      {showLegend && (
        <div className="flex flex-col gap-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {segment.label}: {segment.value} ({segment.percentageFormatted}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: string;
  color?: string;
  showPoints?: boolean;
  title?: string;
}

export function LineChart({ 
  data, 
  height = "h-48", 
  color = "#14b8a6", 
  showPoints = true, 
  title 
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className={`${height} flex items-center justify-center text-gray-500`}>
        <div className="text-center">
          <Icon icon="material-symbols:show-chart" width={40} className="mb-2 mx-auto" />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return { x, y, value: item.value, label: item.label };
  });

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="space-y-4">
      {title && <h4 className="font-medium text-gray-900 dark:text-gray-100">{title}</h4>}
      <div className={`${height} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
                className="dark:stroke-gray-600"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-500 ease-out"
          />

          {/* Points */}
          {showPoints && points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={color}
              className="transition-all duration-500 ease-out hover:r-3"
            />
          ))}
        </svg>

        {/* Value labels */}
        <div className="absolute inset-0 pointer-events-none">
          {points.map((point, index) => (
            <div
              key={index}
              className="absolute text-xs text-gray-600 dark:text-gray-400 -translate-x-1/2 -translate-y-8"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
            >
              {point.value}
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        {data.map((item, index) => (
          <span key={index} className="text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  icon: string;
  color?: string;
  onClick?: () => void;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  color = "text-teal-500",
  onClick 
}: StatCardProps) {
  return (
    <div 
      className={`card p-4 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <Icon
                icon={change.type === "increase" ? "material-symbols:trending-up" : "material-symbols:trending-down"}
                className={change.type === "increase" ? "text-success" : "text-error"}
                width={16}
              />
              <span className={`text-sm ${change.type === "increase" ? "text-success" : "text-error"}`}>
                {change.value}% vs {change.period}
              </span>
            </div>
          )}
        </div>
        <Icon icon={icon} className={`${color} ml-4`} width={32} />
      </div>
    </div>
  );
}