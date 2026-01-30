/**
 * Regional Heat Map Component
 * Displays sentiment analysis results on an interactive Google Map
 * with heat map visualization for support/opposition levels
 */

import { useEffect, useRef, useState } from "react";
import { MapView } from "./Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RegionData {
  name: string;
  sentiment: number; // -100 to +100 (negative = opposition, positive = support)
  gmi: number;
  dominantEmotion: string;
  population?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface RegionalHeatMapProps {
  countryCode: string;
  countryName: string;
  regions: RegionData[];
  topic: string;
  className?: string;
}

// Country center coordinates
const COUNTRY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  LY: { lat: 26.3351, lng: 17.2283, zoom: 5 },
  EG: { lat: 26.8206, lng: 30.8025, zoom: 6 },
  SA: { lat: 23.8859, lng: 45.0792, zoom: 5 },
  AE: { lat: 23.4241, lng: 53.8478, zoom: 7 },
  US: { lat: 37.0902, lng: -95.7129, zoom: 4 },
  GB: { lat: 55.3781, lng: -3.4360, zoom: 5 },
  DE: { lat: 51.1657, lng: 10.4515, zoom: 6 },
  FR: { lat: 46.2276, lng: 2.2137, zoom: 5 },
  JP: { lat: 36.2048, lng: 138.2529, zoom: 5 },
  CN: { lat: 35.8617, lng: 104.1954, zoom: 4 },
  IN: { lat: 20.5937, lng: 78.9629, zoom: 5 },
  BR: { lat: -14.2350, lng: -51.9253, zoom: 4 },
  RU: { lat: 61.5240, lng: 105.3188, zoom: 3 },
  AU: { lat: -25.2744, lng: 133.7751, zoom: 4 },
  CA: { lat: 56.1304, lng: -106.3468, zoom: 4 },
  MX: { lat: 23.6345, lng: -102.5528, zoom: 5 },
  KR: { lat: 35.9078, lng: 127.7669, zoom: 7 },
  IT: { lat: 41.8719, lng: 12.5674, zoom: 6 },
  ES: { lat: 40.4637, lng: -3.7492, zoom: 6 },
  TR: { lat: 38.9637, lng: 35.2433, zoom: 6 },
  NG: { lat: 9.0820, lng: 8.6753, zoom: 6 },
  ZA: { lat: -30.5595, lng: 22.9375, zoom: 5 },
  AR: { lat: -38.4161, lng: -63.6167, zoom: 4 },
};

// Get color based on sentiment (-100 to +100)
function getSentimentColor(sentiment: number): string {
  if (sentiment >= 50) return "#22c55e"; // Strong support - green
  if (sentiment >= 20) return "#84cc16"; // Moderate support - lime
  if (sentiment >= -20) return "#eab308"; // Neutral - yellow
  if (sentiment >= -50) return "#f97316"; // Moderate opposition - orange
  return "#ef4444"; // Strong opposition - red
}

// Get emotion icon
function getEmotionIcon(emotion: string): string {
  const icons: Record<string, string> = {
    joy: "😊",
    hope: "🌟",
    calm: "😌",
    curiosity: "🤔",
    fear: "😨",
    anger: "😠",
    sadness: "😢",
  };
  return icons[emotion.toLowerCase()] || "📊";
}

export function RegionalHeatMap({
  countryCode,
  countryName,
  regions,
  topic,
  className,
}: RegionalHeatMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const countryCenter = COUNTRY_CENTERS[countryCode] || { lat: 0, lng: 0, zoom: 2 };

  // Create markers and circles when map is ready
  useEffect(() => {
    if (!isMapReady || !mapRef.current || regions.length === 0) return;

    const map = mapRef.current;

    // Clear existing markers and circles
    markersRef.current.forEach(marker => marker.map = null);
    circlesRef.current.forEach(circle => circle.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];

    // Create circles and markers for each region
    regions.forEach((region) => {
      const color = getSentimentColor(region.sentiment);
      
      // Create circle for heat effect
      const circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        map,
        center: region.coordinates,
        radius: 50000 + Math.abs(region.sentiment) * 500, // Size based on sentiment intensity
      });

      circle.addListener("click", () => {
        setSelectedRegion(region);
      });

      circlesRef.current.push(circle);

      // Create marker with custom content
      const markerContent = document.createElement("div");
      markerContent.className = "flex flex-col items-center";
      markerContent.innerHTML = `
        <div style="
          background: ${color};
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          text-align: center;
          min-width: 60px;
        ">
          <div>${region.name}</div>
          <div style="font-size: 10px;">${region.sentiment > 0 ? '+' : ''}${region.sentiment}%</div>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: region.coordinates,
        content: markerContent,
        title: region.name,
      });

      marker.addListener("click", () => {
        setSelectedRegion(region);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all regions
    if (regions.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      regions.forEach(region => {
        bounds.extend(region.coordinates);
      });
      map.fitBounds(bounds, 50);
    }

    return () => {
      markersRef.current.forEach(marker => marker.map = null);
      circlesRef.current.forEach(circle => circle.setMap(null));
    };
  }, [isMapReady, regions]);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapReady(true);
  };

  // Calculate statistics
  const supportRegions = regions.filter(r => r.sentiment > 20);
  const oppositionRegions = regions.filter(r => r.sentiment < -20);
  const neutralRegions = regions.filter(r => r.sentiment >= -20 && r.sentiment <= 20);

  return (
    <div className={className}>
      {/* Map Container */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>🗺️ الخريطة الحرارية - {countryName}</span>
            <Badge variant="outline">{topic}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MapView
            className="h-[500px] rounded-b-lg"
            initialCenter={countryCenter}
            initialZoom={countryCenter.zoom}
            onMapReady={handleMapReady}
          />
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mb-4">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">تأييد قوي (+50 إلى +100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-lime-500"></div>
              <span className="text-sm">تأييد معتدل (+20 إلى +50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">محايد (-20 إلى +20)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm">معارضة معتدلة (-50 إلى -20)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">معارضة قوية (-100 إلى -50)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="py-4 text-center">
            <div className="text-3xl font-bold text-green-500">{supportRegions.length}</div>
            <div className="text-sm text-muted-foreground">مناطق مؤيدة</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="py-4 text-center">
            <div className="text-3xl font-bold text-yellow-500">{neutralRegions.length}</div>
            <div className="text-sm text-muted-foreground">مناطق محايدة</div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="py-4 text-center">
            <div className="text-3xl font-bold text-red-500">{oppositionRegions.length}</div>
            <div className="text-sm text-muted-foreground">مناطق معارضة</div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Region Details */}
      {selectedRegion && (
        <Card className="border-2 border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              {getEmotionIcon(selectedRegion.dominantEmotion)}
              <span>{selectedRegion.name}</span>
              <Badge 
                variant={selectedRegion.sentiment > 0 ? "default" : "destructive"}
                className="mr-auto"
              >
                {selectedRegion.sentiment > 0 ? "مؤيد" : selectedRegion.sentiment < 0 ? "معارض" : "محايد"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold" style={{ color: getSentimentColor(selectedRegion.sentiment) }}>
                  {selectedRegion.sentiment > 0 ? '+' : ''}{selectedRegion.sentiment}%
                </div>
                <div className="text-xs text-muted-foreground">نسبة التأييد</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{selectedRegion.gmi}</div>
                <div className="text-xs text-muted-foreground">GMI</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl">{getEmotionIcon(selectedRegion.dominantEmotion)}</div>
                <div className="text-xs text-muted-foreground">{selectedRegion.dominantEmotion}</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">
                  {selectedRegion.coordinates.lat.toFixed(2)}, {selectedRegion.coordinates.lng.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">الإحداثيات</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RegionalHeatMap;
