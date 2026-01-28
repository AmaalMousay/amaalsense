import React from 'react';
import { Card } from '@/components/ui/card';

export interface IndexCardProps {
  title: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  color?: 'purple' | 'cyan' | 'green';
}

const colorMap = {
  purple: 'from-purple-500 to-violet-600',
  cyan: 'from-cyan-400 to-blue-500',
  green: 'from-green-400 to-emerald-500',
};

export function IndexCard({
  title,
  value,
  min = 0,
  max = 100,
  unit = '',
  description,
  icon,
  color = 'purple',
}: IndexCardProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

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
          {/* Gauge background */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            {/* Gauge fill with gradient */}
            <div
              className={`h-full bg-gradient-to-r ${colorMap[color]} transition-all duration-500 rounded-full shadow-lg`}
              style={{ width: `${clampedPercentage}%` }}
            />
            {/* Glow effect */}
            <div
              className={`absolute top-0 h-full bg-gradient-to-r ${colorMap[color]} opacity-50 blur-md transition-all duration-500`}
              style={{ width: `${clampedPercentage}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold gradient-text">
            {value.toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
      </div>

      {/* Range labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </Card>
  );
}
