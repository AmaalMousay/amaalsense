import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  GMI_COLORS, 
  CFI_COLORS, 
  HRI_COLORS,
  getGMIColor,
  getCFIColor,
  getHRIColor
} from '@shared/emotionColors';

export interface IndexCardProps {
  title: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  indexType?: 'gmi' | 'cfi' | 'hri';
  color?: 'purple' | 'cyan' | 'green'; // Legacy support
}

/**
 * Get the appropriate color based on index type and value
 * Using the unified AmaálSense color system
 */
function getIndexColor(indexType: string | undefined, value: number, min: number, max: number): string {
  // Normalize value to 0-100 scale
  const normalizedValue = ((value - min) / (max - min)) * 100;
  
  switch (indexType) {
    case 'gmi':
      return getGMIColor(normalizedValue);
    case 'cfi':
      return getCFIColor(normalizedValue);
    case 'hri':
      return getHRIColor(normalizedValue);
    default:
      // Fallback to GMI colors for legacy support
      return getGMIColor(normalizedValue);
  }
}

/**
 * Get gradient colors for the gauge based on index type
 */
function getGradientColors(indexType: string | undefined): { start: string; end: string } {
  switch (indexType) {
    case 'gmi':
      return { start: GMI_COLORS.negative, end: GMI_COLORS.positive };
    case 'cfi':
      return { start: CFI_COLORS.low, end: CFI_COLORS.high };
    case 'hri':
      return { start: HRI_COLORS.low, end: HRI_COLORS.high };
    default:
      return { start: GMI_COLORS.negative, end: GMI_COLORS.positive };
  }
}

export function IndexCard({
  title,
  value,
  min = 0,
  max = 100,
  unit = '',
  description,
  icon,
  indexType,
  color,
}: IndexCardProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  // Get color based on index type and value
  const fillColor = getIndexColor(indexType, value, min, max);
  const gradientColors = getGradientColors(indexType);

  return (
    <Card className="cosmic-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold cosmic-text">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && <div className="text-3xl opacity-60">{icon}</div>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          {/* Gauge background with gradient */}
          <div 
            className="relative h-3 rounded-full overflow-hidden"
            style={{
              background: `linear-gradient(90deg, ${gradientColors.start}40, ${gradientColors.end}40)`
            }}
          >
            {/* Gauge fill */}
            <div
              className="h-full transition-all duration-500 rounded-full shadow-lg"
              style={{ 
                width: `${clampedPercentage}%`,
                backgroundColor: fillColor
              }}
            />
            {/* Glow effect */}
            <div
              className="absolute top-0 h-full opacity-50 blur-md transition-all duration-500"
              style={{ 
                width: `${clampedPercentage}%`,
                backgroundColor: fillColor
              }}
            />
          </div>
        </div>

        <div className="text-right">
          <div 
            className="text-3xl font-bold"
            style={{ color: fillColor }}
          >
            {value.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
      </div>

      {/* Range labels with color indicators */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span style={{ color: gradientColors.start }}>{min}{unit}</span>
        <span style={{ color: gradientColors.end }}>{max}{unit}</span>
      </div>
    </Card>
  );
}
