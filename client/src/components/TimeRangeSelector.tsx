import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimeRangeOption {
  label: string;
  value: number;
  hours: number;
}

const TIME_RANGES: TimeRangeOption[] = [
  { label: '1H', value: 1, hours: 1 },
  { label: '6H', value: 6, hours: 6 },
  { label: '24H', value: 24, hours: 24 },
  { label: '7D', value: 168, hours: 168 },
  { label: '30D', value: 720, hours: 720 },
];

interface TimeRangeSelectorProps {
  selectedRange: number;
  onRangeChange: (hours: number) => void;
  isLoading?: boolean;
}

export function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  isLoading = false,
}: TimeRangeSelectorProps) {
  return (
    <Card className="cosmic-card p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold text-muted-foreground">Time Range:</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              onClick={() => onRangeChange(range.hours)}
              variant={selectedRange === range.hours ? 'default' : 'outline'}
              size="sm"
              disabled={isLoading}
              className={
                selectedRange === range.hours
                  ? 'glow-button text-white'
                  : 'text-xs'
              }
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-muted-foreground mt-3">
        {selectedRange === 1 && 'Showing data from the last hour with 15-minute intervals'}
        {selectedRange === 6 && 'Showing data from the last 6 hours with 15-minute intervals'}
        {selectedRange === 24 && 'Showing data from the last 24 hours with 1-hour intervals'}
        {selectedRange === 168 && 'Showing data from the last 7 days with 4-hour intervals'}
        {selectedRange === 720 && 'Showing data from the last 30 days with 1-day intervals'}
      </p>
    </Card>
  );
}
