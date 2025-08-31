"use client";

import { Icon } from "@iconify/react";
import { ReactNode } from "react";

interface DashboardWidgetProps {
  title: string;
  icon?: string;
  iconColor?: string;
  children: ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "glass" | "glass-strong";
}

export function DashboardWidget({
  title,
  icon,
  iconColor = "text-teal-500",
  children,
  className = "",
  loading = false,
  error,
  actions,
  size = "md",
  variant = "default"
}: DashboardWidgetProps) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8"
  };

  const variantClasses = {
    default: "card",
    glass: "card-glass",
    "glass-strong": "card-glass-strong"
  };

  if (loading) {
    return (
      <div className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            {actions && <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>}
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon 
            icon="material-symbols:error-outline" 
            className="text-red-500 mb-2" 
            width={32} 
          />
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-1">Unable to load data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <Icon 
              icon={icon} 
              className={iconColor} 
              width={24} 
            />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

interface MetricWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
  variant?: "default" | "glass" | "glass-strong";
}

export function MetricWidget({
  title,
  value,
  subtitle,
  icon,
  iconColor = "text-teal-500",
  trend,
  className = "",
  variant = "default"
}: MetricWidgetProps) {
  const variantClasses = {
    default: "card",
    glass: "card-glass",
    "glass-strong": "card-glass-strong"
  };

  const getTrendIcon = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return "material-symbols:trending-up";
      case "down":
        return "material-symbols:trending-down";
      default:
        return "material-symbols:trending-flat";
    }
  };

  const getTrendColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return "text-success";
      case "down":
        return "text-error";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className={`${variantClasses[variant]} p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <Icon 
                icon={getTrendIcon(trend.direction)} 
                className={getTrendColor(trend.direction)}
                width={16}
              />
              <span className={`text-sm font-medium ${getTrendColor(trend.direction)}`}>
                {trend.value}% {trend.label}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <Icon 
            icon={icon} 
            className={iconColor} 
            width={40} 
          />
        </div>
      </div>
    </div>
  );
}

interface ChartWidgetProps {
  title: string;
  icon?: string;
  iconColor?: string;
  children: ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  actions?: ReactNode;
  height?: string;
}

export function ChartWidget({
  title,
  icon,
  iconColor = "text-teal-500",
  children,
  className = "",
  loading = false,
  error,
  actions,
  height = "h-64"
}: ChartWidgetProps) {
  return (
    <DashboardWidget
      title={title}
      icon={icon}
      iconColor={iconColor}
      loading={loading}
      error={error}
      actions={actions}
      className={className}
      variant="glass"
    >
      <div className={`${height} flex items-center justify-center`}>
        {children}
      </div>
    </DashboardWidget>
  );
}

interface StatusBadgeProps {
  status: string;
  variant?: "equipment" | "assignment" | "event" | "maintenance";
  size?: "sm" | "md";
}

export function StatusBadge({ 
  status, 
  variant = "equipment", 
  size = "sm" 
}: StatusBadgeProps) {
  const statusLower = status.toLowerCase();
  
  const getStatusClasses = () => {
    const baseClasses = size === "sm" 
      ? "px-2 py-1 text-xs font-medium rounded-full"
      : "px-3 py-1 text-sm font-medium rounded-full";

    switch (variant) {
      case "equipment":
        if (statusLower.includes("available")) return `${baseClasses} status-available`;
        if (statusLower.includes("checked")) return `${baseClasses} status-checked-out`;
        if (statusLower.includes("maintenance")) return `${baseClasses} status-maintenance`;
        if (statusLower.includes("retired")) return `${baseClasses} status-retired`;
        break;
      case "assignment":
        if (statusLower.includes("overdue")) return `${baseClasses} bg-error text-white`;
        if (statusLower.includes("warning")) return `${baseClasses} bg-warning text-white`;
        if (statusLower.includes("normal")) return `${baseClasses} bg-success text-white`;
        break;
      case "event":
        if (statusLower.includes("completed")) return `${baseClasses} bg-success text-white`;
        if (statusLower.includes("active")) return `${baseClasses} bg-info text-white`;
        if (statusLower.includes("planned")) return `${baseClasses} bg-warning text-white`;
        if (statusLower.includes("cancelled")) return `${baseClasses} bg-error text-white`;
        break;
      case "maintenance":
        if (statusLower.includes("completed")) return `${baseClasses} bg-success text-white`;
        if (statusLower.includes("progress")) return `${baseClasses} bg-warning text-white`;
        if (statusLower.includes("scheduled")) return `${baseClasses} bg-info text-white`;
        if (statusLower.includes("overdue")) return `${baseClasses} bg-error text-white`;
        break;
    }
    
    return `${baseClasses} bg-gray-500 text-white`;
  };

  return (
    <span className={getStatusClasses()}>
      {status}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: "teal" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function ProgressBar({
  value,
  max,
  label,
  color = "teal",
  size = "md",
  showValue = false
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    teal: "bg-teal-500",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    info: "bg-info"
  };

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-600 dark:text-gray-400">{label}</span>}
          {showValue && (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {value}/{max} ({percentage.toFixed(1)}%)
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}