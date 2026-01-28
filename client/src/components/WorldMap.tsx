import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface CountryEmotionData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  confidence: number;
}

interface WorldMapProps {
  countriesData: CountryEmotionData[];
  selectedCountry?: string;
  onCountrySelect?: (countryCode: string) => void;
}

// Simplified SVG map with country paths (using a basic representation)
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; size: number }> = {
  'SA': { x: 55, y: 45, size: 8 },
  'AE': { x: 60, y: 42, size: 5 },
  'EG': { x: 50, y: 35, size: 7 },
  'US': { x: 20, y: 35, size: 12 },
  'GB': { x: 48, y: 25, size: 4 },
  'DE': { x: 50, y: 28, size: 5 },
  'FR': { x: 48, y: 30, size: 6 },
  'JP': { x: 80, y: 35, size: 6 },
  'CN': { x: 70, y: 38, size: 10 },
  'IN': { x: 65, y: 45, size: 8 },
  'BR': { x: 30, y: 55, size: 9 },
  'CA': { x: 18, y: 25, size: 10 },
  'AU': { x: 75, y: 65, size: 8 },
  'KR': { x: 78, y: 32, size: 3 },
  'MX': { x: 18, y: 42, size: 6 },
  'RU': { x: 65, y: 20, size: 15 },
  'IT': { x: 52, y: 32, size: 3 },
  'ES': { x: 46, y: 32, size: 5 },
  'NL': { x: 49, y: 27, size: 2 },
  'SE': { x: 52, y: 20, size: 6 },
  'CH': { x: 50, y: 30, size: 2 },
  'SG': { x: 72, y: 50, size: 1 },
  'ID': { x: 72, y: 55, size: 7 },
  'TH': { x: 70, y: 48, size: 4 },
  'MY': { x: 70, y: 50, size: 3 },
};

function getEmotionColor(gmi: number, cfi: number, hri: number): string {
  if (cfi > 60) {
    const intensity = Math.round((cfi / 100) * 200);
    return `rgb(${intensity + 55}, 50, 50)`;
  }

  if (hri > 60) {
    const intensity = Math.round((hri / 100) * 155);
    return `rgb(50, ${intensity + 100}, 100)`;
  }

  if (gmi > 20) {
    const intensity = Math.round(((gmi + 100) / 200) * 155);
    return `rgb(100, ${intensity + 100}, 200)`;
  }

  if (gmi < -20) {
    const intensity = Math.round(((-gmi + 100) / 200) * 155);
    return `rgb(${intensity + 100}, 150, 50)`;
  }

  return 'rgb(200, 150, 100)';
}

function getEmotionIntensity(gmi: number, cfi: number, hri: number): number {
  const avgIntensity = (Math.abs(gmi) + cfi + hri) / 3;
  return Math.max(0.3, Math.min(1.0, avgIntensity / 100));
}

export function WorldMap({ countriesData, selectedCountry, onCountrySelect }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: CountryEmotionData } | null>(null);

  const handleCountryHover = (countryCode: string, e: React.MouseEvent) => {
    const country = countriesData.find((c) => c.countryCode === countryCode);
    if (country) {
      setHoveredCountry(countryCode);
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        data: country,
      });
    }
  };

  const handleCountryLeave = () => {
    setHoveredCountry(null);
    setTooltip(null);
  };

  return (
    <Card className="cosmic-card p-6 w-full">
      <h3 className="text-lg font-bold cosmic-text mb-4">Global Emotion Map</h3>

      <div className="relative w-full bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-lg overflow-hidden">
        {/* SVG Background */}
        <svg
          viewBox="0 0 100 70"
          className="w-full h-auto bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg"
          style={{ aspectRatio: '100/70' }}
        >
          {/* Grid lines for reference */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="70" fill="url(#grid)" />

          {/* Render country emotion nodes */}
          {countriesData.map((country) => {
            const pos = COUNTRY_POSITIONS[country.countryCode];
            if (!pos) return null;

            const color = getEmotionColor(country.gmi, country.cfi, country.hri);
            const intensity = getEmotionIntensity(country.gmi, country.cfi, country.hri);
            const radius = pos.size * intensity;

            return (
              <g key={country.countryCode}>
                {/* Glow effect */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius * 1.5}
                  fill={color}
                  opacity={0.3}
                  filter="url(#blur)"
                />

                {/* Main circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={color}
                  opacity={0.8}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => handleCountryHover(country.countryCode, e as any)}
                  onMouseLeave={handleCountryLeave}
                  onClick={() => onCountrySelect?.(country.countryCode)}
                  className={selectedCountry === country.countryCode ? 'stroke-accent stroke-2' : ''}
                />

                {/* Country code label */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-white font-bold pointer-events-none"
                  style={{ fontSize: '2px', fontWeight: 'bold' }}
                >
                  {country.countryCode}
                </text>
              </g>
            );
          })}

          {/* Blur filter */}
          <defs>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed cosmic-card p-3 z-50 pointer-events-none text-sm"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 10}px`,
            maxWidth: '250px',
          }}
        >
          <p className="font-bold cosmic-text">{tooltip.data.countryName}</p>
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>GMI: <span className="text-accent">{tooltip.data.gmi}</span></p>
            <p>CFI: <span className="text-cyan-400">{tooltip.data.cfi}</span></p>
            <p>HRI: <span className="text-green-400">{tooltip.data.hri}</span></p>
            <p>Confidence: {tooltip.data.confidence}%</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(255, 105, 105)' }} />
          <span className="text-muted-foreground">High Fear</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(100, 200, 100)' }} />
          <span className="text-muted-foreground">High Hope</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(100, 150, 200)' }} />
          <span className="text-muted-foreground">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(200, 150, 100)' }} />
          <span className="text-muted-foreground">Neutral</span>
        </div>
      </div>
    </Card>
  );
}
