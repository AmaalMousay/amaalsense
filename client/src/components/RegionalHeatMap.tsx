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

// Country center coordinates - comprehensive list for all supported countries
const COUNTRY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  // Middle East & North Africa
  LY: { lat: 26.3351, lng: 17.2283, zoom: 5 },
  EG: { lat: 26.8206, lng: 30.8025, zoom: 6 },
  SA: { lat: 23.8859, lng: 45.0792, zoom: 5 },
  AE: { lat: 23.4241, lng: 53.8478, zoom: 7 },
  QA: { lat: 25.3548, lng: 51.1839, zoom: 8 },
  KW: { lat: 29.3117, lng: 47.4818, zoom: 8 },
  BH: { lat: 26.0667, lng: 50.5577, zoom: 9 },
  OM: { lat: 21.4735, lng: 55.9754, zoom: 6 },
  YE: { lat: 15.5527, lng: 48.5164, zoom: 6 },
  JO: { lat: 30.5852, lng: 36.2384, zoom: 7 },
  LB: { lat: 33.8547, lng: 35.8623, zoom: 8 },
  SY: { lat: 34.8021, lng: 38.9968, zoom: 6 },
  IQ: { lat: 33.2232, lng: 43.6793, zoom: 6 },
  PS: { lat: 31.9522, lng: 35.2332, zoom: 8 },
  TN: { lat: 33.8869, lng: 9.5375, zoom: 6 },
  DZ: { lat: 28.0339, lng: 1.6596, zoom: 5 },
  MA: { lat: 31.7917, lng: -7.0926, zoom: 6 },
  SD: { lat: 12.8628, lng: 30.2176, zoom: 5 },
  MR: { lat: 21.0079, lng: -10.9408, zoom: 5 },
  SO: { lat: 5.1521, lng: 46.1996, zoom: 6 },
  DJ: { lat: 11.8251, lng: 42.5903, zoom: 8 },
  KM: { lat: -11.6455, lng: 43.3333, zoom: 8 },
  
  // Europe
  GB: { lat: 55.3781, lng: -3.4360, zoom: 5 },
  DE: { lat: 51.1657, lng: 10.4515, zoom: 6 },
  FR: { lat: 46.2276, lng: 2.2137, zoom: 5 },
  IT: { lat: 41.8719, lng: 12.5674, zoom: 6 },
  ES: { lat: 40.4637, lng: -3.7492, zoom: 6 },
  PT: { lat: 39.3999, lng: -8.2245, zoom: 6 },
  NL: { lat: 52.1326, lng: 5.2913, zoom: 7 },
  BE: { lat: 50.5039, lng: 4.4699, zoom: 8 },
  CH: { lat: 46.8182, lng: 8.2275, zoom: 7 },
  AT: { lat: 47.5162, lng: 14.5501, zoom: 7 },
  PL: { lat: 51.9194, lng: 19.1451, zoom: 6 },
  CZ: { lat: 49.8175, lng: 15.4730, zoom: 7 },
  SE: { lat: 60.1282, lng: 18.6435, zoom: 4 },
  NO: { lat: 60.4720, lng: 8.4689, zoom: 4 },
  DK: { lat: 56.2639, lng: 9.5018, zoom: 6 },
  FI: { lat: 61.9241, lng: 25.7482, zoom: 5 },
  IE: { lat: 53.1424, lng: -7.6921, zoom: 6 },
  GR: { lat: 39.0742, lng: 21.8243, zoom: 6 },
  TR: { lat: 38.9637, lng: 35.2433, zoom: 6 },
  RU: { lat: 61.5240, lng: 105.3188, zoom: 3 },
  UA: { lat: 48.3794, lng: 31.1656, zoom: 6 },
  RO: { lat: 45.9432, lng: 24.9668, zoom: 6 },
  HU: { lat: 47.1625, lng: 19.5033, zoom: 7 },
  BG: { lat: 42.7339, lng: 25.4858, zoom: 7 },
  RS: { lat: 44.0165, lng: 21.0059, zoom: 7 },
  HR: { lat: 45.1000, lng: 15.2000, zoom: 7 },
  SK: { lat: 48.6690, lng: 19.6990, zoom: 7 },
  SI: { lat: 46.1512, lng: 14.9955, zoom: 8 },
  
  // Americas
  US: { lat: 37.0902, lng: -95.7129, zoom: 4 },
  CA: { lat: 56.1304, lng: -106.3468, zoom: 4 },
  MX: { lat: 23.6345, lng: -102.5528, zoom: 5 },
  BR: { lat: -14.2350, lng: -51.9253, zoom: 4 },
  AR: { lat: -38.4161, lng: -63.6167, zoom: 4 },
  CL: { lat: -35.6751, lng: -71.5430, zoom: 4 },
  CO: { lat: 4.5709, lng: -74.2973, zoom: 5 },
  PE: { lat: -9.1900, lng: -75.0152, zoom: 5 },
  VE: { lat: 6.4238, lng: -66.5897, zoom: 5 },
  EC: { lat: -1.8312, lng: -78.1834, zoom: 6 },
  BO: { lat: -16.2902, lng: -63.5887, zoom: 5 },
  PY: { lat: -23.4425, lng: -58.4438, zoom: 6 },
  UY: { lat: -32.5228, lng: -55.7658, zoom: 6 },
  CU: { lat: 21.5218, lng: -77.7812, zoom: 6 },
  DO: { lat: 18.7357, lng: -70.1627, zoom: 7 },
  PR: { lat: 18.2208, lng: -66.5901, zoom: 8 },
  GT: { lat: 15.7835, lng: -90.2308, zoom: 7 },
  HN: { lat: 15.2000, lng: -86.2419, zoom: 7 },
  SV: { lat: 13.7942, lng: -88.8965, zoom: 8 },
  NI: { lat: 12.8654, lng: -85.2072, zoom: 7 },
  CR: { lat: 9.7489, lng: -83.7534, zoom: 7 },
  PA: { lat: 8.5380, lng: -80.7821, zoom: 7 },
  
  // Asia
  CN: { lat: 35.8617, lng: 104.1954, zoom: 4 },
  JP: { lat: 36.2048, lng: 138.2529, zoom: 5 },
  KR: { lat: 35.9078, lng: 127.7669, zoom: 7 },
  IN: { lat: 20.5937, lng: 78.9629, zoom: 5 },
  ID: { lat: -0.7893, lng: 113.9213, zoom: 4 },
  TH: { lat: 15.8700, lng: 100.9925, zoom: 5 },
  VN: { lat: 14.0583, lng: 108.2772, zoom: 5 },
  MY: { lat: 4.2105, lng: 101.9758, zoom: 5 },
  SG: { lat: 1.3521, lng: 103.8198, zoom: 10 },
  PH: { lat: 12.8797, lng: 121.7740, zoom: 5 },
  PK: { lat: 30.3753, lng: 69.3451, zoom: 5 },
  BD: { lat: 23.6850, lng: 90.3563, zoom: 6 },
  MM: { lat: 21.9162, lng: 95.9560, zoom: 5 },
  NP: { lat: 28.3949, lng: 84.1240, zoom: 6 },
  LK: { lat: 7.8731, lng: 80.7718, zoom: 7 },
  KH: { lat: 12.5657, lng: 104.9910, zoom: 6 },
  LA: { lat: 19.8563, lng: 102.4955, zoom: 6 },
  TW: { lat: 23.6978, lng: 120.9605, zoom: 7 },
  HK: { lat: 22.3193, lng: 114.1694, zoom: 10 },
  MO: { lat: 22.1987, lng: 113.5439, zoom: 11 },
  MN: { lat: 46.8625, lng: 103.8467, zoom: 5 },
  KZ: { lat: 48.0196, lng: 66.9237, zoom: 4 },
  UZ: { lat: 41.3775, lng: 64.5853, zoom: 5 },
  AF: { lat: 33.9391, lng: 67.7100, zoom: 6 },
  IR: { lat: 32.4279, lng: 53.6880, zoom: 5 },
  
  // Africa
  NG: { lat: 9.0820, lng: 8.6753, zoom: 6 },
  ZA: { lat: -30.5595, lng: 22.9375, zoom: 5 },
  KE: { lat: -0.0236, lng: 37.9062, zoom: 6 },
  ET: { lat: 9.1450, lng: 40.4897, zoom: 5 },
  GH: { lat: 7.9465, lng: -1.0232, zoom: 6 },
  TZ: { lat: -6.3690, lng: 34.8888, zoom: 5 },
  UG: { lat: 1.3733, lng: 32.2903, zoom: 6 },
  RW: { lat: -1.9403, lng: 29.8739, zoom: 8 },
  SN: { lat: 14.4974, lng: -14.4524, zoom: 6 },
  CI: { lat: 7.5400, lng: -5.5471, zoom: 6 },
  CM: { lat: 7.3697, lng: 12.3547, zoom: 5 },
  AO: { lat: -11.2027, lng: 17.8739, zoom: 5 },
  MZ: { lat: -18.6657, lng: 35.5296, zoom: 5 },
  ZW: { lat: -19.0154, lng: 29.1549, zoom: 6 },
  ZM: { lat: -13.1339, lng: 27.8493, zoom: 5 },
  BW: { lat: -22.3285, lng: 24.6849, zoom: 6 },
  NA: { lat: -22.9576, lng: 18.4904, zoom: 5 },
  MW: { lat: -13.2543, lng: 34.3015, zoom: 6 },
  MG: { lat: -18.7669, lng: 46.8691, zoom: 5 },
  MU: { lat: -20.3484, lng: 57.5522, zoom: 9 },
  
  // Oceania
  AU: { lat: -25.2744, lng: 133.7751, zoom: 4 },
  NZ: { lat: -40.9006, lng: 174.8860, zoom: 5 },
  FJ: { lat: -17.7134, lng: 178.0650, zoom: 7 },
  PG: { lat: -6.3150, lng: 143.9555, zoom: 5 },
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
