import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { 
  GMI_COLORS, 
  CFI_COLORS, 
  HRI_COLORS,
  EMOTION_COLORS,
  getGMIColor,
  getCFIColor,
  getHRIColor
} from '@shared/emotionColors';

export interface StockStyleIndicatorProps {
  title: string;
  shortName: string; // GMI, CFI, HRI
  value: number;
  previousValue?: number;
  min?: number;
  max?: number;
  description?: string;
  indexType: 'gmi' | 'cfi' | 'hri';
  historicalData?: number[]; // Array of last N values for sparkline
  isLoading?: boolean;
}

/**
 * Mini sparkline chart component
 */
function Sparkline({ 
  data, 
  color, 
  width = 120, 
  height = 40 
}: { 
  data: number[]; 
  color: string; 
  width?: number; 
  height?: number;
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Create area path
  const areaPath = `M 0,${height} L ${points} L ${width},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path 
        d={areaPath} 
        fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current value dot */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r={4}
        fill={color}
        className="animate-pulse"
      />
    </svg>
  );
}

/**
 * Get color based on index type and value
 */
function getIndexColor(indexType: string, value: number, min: number, max: number): string {
  const normalizedValue = ((value - min) / (max - min)) * 100;
  
  switch (indexType) {
    case 'gmi':
      return getGMIColor(normalizedValue);
    case 'cfi':
      return getCFIColor(normalizedValue);
    case 'hri':
      return getHRIColor(normalizedValue);
    default:
      return EMOTION_COLORS.neutral;
  }
}

/**
 * Get trend direction and percentage change
 */
function getTrendInfo(current: number, previous: number | undefined) {
  if (previous === undefined) {
    return { direction: 'stable' as const, change: 0, percentage: 0 };
  }
  
  const change = current - previous;
  const percentage = previous !== 0 ? (change / Math.abs(previous)) * 100 : 0;
  
  if (Math.abs(change) < 0.5) {
    return { direction: 'stable' as const, change, percentage };
  }
  
  return {
    direction: change > 0 ? 'up' as const : 'down' as const,
    change,
    percentage
  };
}

export function StockStyleIndicator({
  title,
  shortName,
  value,
  previousValue,
  min = 0,
  max = 100,
  description,
  indexType,
  historicalData = [],
  isLoading = false,
}: StockStyleIndicatorProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  // Animate value changes
  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsAnimating(true);
      const startValue = prevValueRef.current;
      const endValue = value;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevValueRef.current = value;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value]);

  const color = getIndexColor(indexType, value, min, max);
  const trend = getTrendInfo(value, previousValue);
  
  // Determine if this index type means "up is good" or "up is bad"
  const isUpGood = indexType === 'gmi' || indexType === 'hri';
  const trendColor = trend.direction === 'stable' 
    ? EMOTION_COLORS.neutral
    : (trend.direction === 'up' === isUpGood) 
      ? EMOTION_COLORS.hope 
      : EMOTION_COLORS.anger;

  const TrendIcon = trend.direction === 'up' 
    ? TrendingUp 
    : trend.direction === 'down' 
      ? TrendingDown 
      : Minus;

  return (
    <Card className="cosmic-card p-4 md:p-6 relative overflow-hidden group hover:border-accent/50 transition-all duration-300 dark:bg-card/95">
      {/* Background pulse effect when animating */}
      {isAnimating && (
        <div 
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-bold px-2 py-1 rounded"
              style={{ 
                backgroundColor: `${color}20`,
                color: color
              }}
            >
              {shortName}
            </span>
            <Activity className="w-4 h-4 text-muted-foreground animate-pulse" />
          </div>
          <h3 className="text-sm md:text-base font-medium text-muted-foreground mt-1">
            {title}
          </h3>
        </div>

        {/* Trend indicator */}
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ 
            backgroundColor: `${trendColor}20`,
            color: trendColor
          }}
        >
          <TrendIcon className="w-3 h-3" />
          <span>
            {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '' : ''}
            {trend.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Main value display */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div 
            className="text-4xl md:text-5xl font-bold tabular-nums transition-colors duration-300"
            style={{ color }}
          >
            {displayValue.toFixed(1)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="text-sm"
              style={{ color: trendColor }}
            >
              {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              vs previous
            </span>
          </div>
        </div>

        {/* Mini sparkline chart */}
        {historicalData.length > 1 && (
          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline 
              data={historicalData} 
              color={color}
              width={100}
              height={40}
            />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: `${color}20` }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{ 
              width: `${((displayValue - min) / (max - min)) * 100}%`,
              backgroundColor: color
            }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Range labels */}
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground mt-3 opacity-70">
          {description}
        </p>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Card>
  );
}

// Add shimmer animation to CSS
const shimmerStyle = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = shimmerStyle;
  document.head.appendChild(styleEl);
}
