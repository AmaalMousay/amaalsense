/**
 * Google Maps Component with Emotion Circles
 * Shows real-time mood data for countries on an interactive Google Map
 */

import { useEffect, useRef, useState } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

function loadMapScript() {
  return new Promise(resolve => {
    if (window.google?.maps) {
      resolve(null);
      return;
    }
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve(null);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };
    document.head.appendChild(script);
  });
}

// Country coordinates (lat, lng)
const COUNTRY_COORDS: Record<string, { lat: number; lng: number; name: string; nameEn: string }> = {
  // Middle East & North Africa
  'LY': { lat: 26.3351, lng: 17.2283, name: 'ليبيا', nameEn: 'Libya' },
  'EG': { lat: 26.8206, lng: 30.8025, name: 'مصر', nameEn: 'Egypt' },
  'SA': { lat: 23.8859, lng: 45.0792, name: 'السعودية', nameEn: 'Saudi Arabia' },
  'AE': { lat: 23.4241, lng: 53.8478, name: 'الإمارات', nameEn: 'UAE' },
  'IQ': { lat: 33.2232, lng: 43.6793, name: 'العراق', nameEn: 'Iraq' },
  'SY': { lat: 34.8021, lng: 38.9968, name: 'سوريا', nameEn: 'Syria' },
  'JO': { lat: 30.5852, lng: 36.2384, name: 'الأردن', nameEn: 'Jordan' },
  'LB': { lat: 33.8547, lng: 35.8623, name: 'لبنان', nameEn: 'Lebanon' },
  'PS': { lat: 31.9522, lng: 35.2332, name: 'فلسطين', nameEn: 'Palestine' },
  'KW': { lat: 29.3117, lng: 47.4818, name: 'الكويت', nameEn: 'Kuwait' },
  'QA': { lat: 25.3548, lng: 51.1839, name: 'قطر', nameEn: 'Qatar' },
  'BH': { lat: 26.0667, lng: 50.5577, name: 'البحرين', nameEn: 'Bahrain' },
  'OM': { lat: 21.4735, lng: 55.9754, name: 'عمان', nameEn: 'Oman' },
  'YE': { lat: 15.5527, lng: 48.5164, name: 'اليمن', nameEn: 'Yemen' },
  'MA': { lat: 31.7917, lng: -7.0926, name: 'المغرب', nameEn: 'Morocco' },
  'DZ': { lat: 28.0339, lng: 1.6596, name: 'الجزائر', nameEn: 'Algeria' },
  'TN': { lat: 33.8869, lng: 9.5375, name: 'تونس', nameEn: 'Tunisia' },
  'SD': { lat: 12.8628, lng: 30.2176, name: 'السودان', nameEn: 'Sudan' },
  
  // Europe
  'GB': { lat: 55.3781, lng: -3.4360, name: 'بريطانيا', nameEn: 'UK' },
  'FR': { lat: 46.2276, lng: 2.2137, name: 'فرنسا', nameEn: 'France' },
  'DE': { lat: 51.1657, lng: 10.4515, name: 'ألمانيا', nameEn: 'Germany' },
  'IT': { lat: 41.8719, lng: 12.5674, name: 'إيطاليا', nameEn: 'Italy' },
  'ES': { lat: 40.4637, lng: -3.7492, name: 'إسبانيا', nameEn: 'Spain' },
  'NL': { lat: 52.1326, lng: 5.2913, name: 'هولندا', nameEn: 'Netherlands' },
  'BE': { lat: 50.5039, lng: 4.4699, name: 'بلجيكا', nameEn: 'Belgium' },
  'SE': { lat: 60.1282, lng: 18.6435, name: 'السويد', nameEn: 'Sweden' },
  'NO': { lat: 60.4720, lng: 8.4689, name: 'النرويج', nameEn: 'Norway' },
  'PL': { lat: 51.9194, lng: 19.1451, name: 'بولندا', nameEn: 'Poland' },
  'UA': { lat: 48.3794, lng: 31.1656, name: 'أوكرانيا', nameEn: 'Ukraine' },
  'RU': { lat: 61.5240, lng: 105.3188, name: 'روسيا', nameEn: 'Russia' },
  'TR': { lat: 38.9637, lng: 35.2433, name: 'تركيا', nameEn: 'Turkey' },
  'GR': { lat: 39.0742, lng: 21.8243, name: 'اليونان', nameEn: 'Greece' },
  'CH': { lat: 46.8182, lng: 8.2275, name: 'سويسرا', nameEn: 'Switzerland' },
  'AT': { lat: 47.5162, lng: 14.5501, name: 'النمسا', nameEn: 'Austria' },
  'PT': { lat: 39.3999, lng: -8.2245, name: 'البرتغال', nameEn: 'Portugal' },
  'IE': { lat: 53.1424, lng: -7.6921, name: 'أيرلندا', nameEn: 'Ireland' },
  'DK': { lat: 56.2639, lng: 9.5018, name: 'الدنمارك', nameEn: 'Denmark' },
  'FI': { lat: 61.9241, lng: 25.7482, name: 'فنلندا', nameEn: 'Finland' },
  
  // Americas
  'US': { lat: 37.0902, lng: -95.7129, name: 'أمريكا', nameEn: 'USA' },
  'CA': { lat: 56.1304, lng: -106.3468, name: 'كندا', nameEn: 'Canada' },
  'MX': { lat: 23.6345, lng: -102.5528, name: 'المكسيك', nameEn: 'Mexico' },
  'BR': { lat: -14.2350, lng: -51.9253, name: 'البرازيل', nameEn: 'Brazil' },
  'AR': { lat: -38.4161, lng: -63.6167, name: 'الأرجنتين', nameEn: 'Argentina' },
  'CO': { lat: 4.5709, lng: -74.2973, name: 'كولومبيا', nameEn: 'Colombia' },
  'CL': { lat: -35.6751, lng: -71.5430, name: 'تشيلي', nameEn: 'Chile' },
  'PE': { lat: -9.1900, lng: -75.0152, name: 'بيرو', nameEn: 'Peru' },
  'VE': { lat: 6.4238, lng: -66.5897, name: 'فنزويلا', nameEn: 'Venezuela' },
  
  // Asia
  'CN': { lat: 35.8617, lng: 104.1954, name: 'الصين', nameEn: 'China' },
  'JP': { lat: 36.2048, lng: 138.2529, name: 'اليابان', nameEn: 'Japan' },
  'KR': { lat: 35.9078, lng: 127.7669, name: 'كوريا الجنوبية', nameEn: 'South Korea' },
  'IN': { lat: 20.5937, lng: 78.9629, name: 'الهند', nameEn: 'India' },
  'PK': { lat: 30.3753, lng: 69.3451, name: 'باكستان', nameEn: 'Pakistan' },
  'ID': { lat: -0.7893, lng: 113.9213, name: 'إندونيسيا', nameEn: 'Indonesia' },
  'TH': { lat: 15.8700, lng: 100.9925, name: 'تايلاند', nameEn: 'Thailand' },
  'VN': { lat: 14.0583, lng: 108.2772, name: 'فيتنام', nameEn: 'Vietnam' },
  'MY': { lat: 4.2105, lng: 101.9758, name: 'ماليزيا', nameEn: 'Malaysia' },
  'SG': { lat: 1.3521, lng: 103.8198, name: 'سنغافورة', nameEn: 'Singapore' },
  'PH': { lat: 12.8797, lng: 121.7740, name: 'الفلبين', nameEn: 'Philippines' },
  'BD': { lat: 23.6850, lng: 90.3563, name: 'بنغلاديش', nameEn: 'Bangladesh' },
  'IR': { lat: 32.4279, lng: 53.6880, name: 'إيران', nameEn: 'Iran' },
  'AF': { lat: 33.9391, lng: 67.7100, name: 'أفغانستان', nameEn: 'Afghanistan' },
  
  // Africa
  'NG': { lat: 9.0820, lng: 8.6753, name: 'نيجيريا', nameEn: 'Nigeria' },
  'ZA': { lat: -30.5595, lng: 22.9375, name: 'جنوب أفريقيا', nameEn: 'South Africa' },
  'KE': { lat: -0.0236, lng: 37.9062, name: 'كينيا', nameEn: 'Kenya' },
  'ET': { lat: 9.1450, lng: 40.4897, name: 'إثيوبيا', nameEn: 'Ethiopia' },
  'GH': { lat: 7.9465, lng: -1.0232, name: 'غانا', nameEn: 'Ghana' },
  'TZ': { lat: -6.3690, lng: 34.8888, name: 'تنزانيا', nameEn: 'Tanzania' },
  'UG': { lat: 1.3733, lng: 32.2903, name: 'أوغندا', nameEn: 'Uganda' },
  'SN': { lat: 14.4974, lng: -14.4524, name: 'السنغال', nameEn: 'Senegal' },
  
  // Oceania
  'AU': { lat: -25.2744, lng: 133.7751, name: 'أستراليا', nameEn: 'Australia' },
  'NZ': { lat: -40.9006, lng: 174.8860, name: 'نيوزيلندا', nameEn: 'New Zealand' },
};

// Mood colors
const MOOD_COLORS: Record<string, string> = {
  hope: '#2A9D8F',    // Green - Hope
  calm: '#457B9D',    // Blue - Calm
  neutral: '#E9C46A', // Yellow - Neutral
  fear: '#F4A261',    // Orange - Fear
  anger: '#E63946',   // Red - Anger
  sadness: '#8D5CF6', // Purple - Sadness
};

// Function to determine mood from GMI, CFI, HRI
// Uses a scoring system for better color distribution
function getMoodFromIndices(gmi: number, cfi: number, hri: number): string {
  // Calculate dominant emotion based on multiple factors
  
  // Very high CFI = Anger (red)
  if (cfi > 72) return 'anger';
  
  // High GMI with good HRI = Hope (green)
  if (gmi > 15 && hri > 45) return 'hope';
  if (gmi > 20) return 'hope';
  
  // High HRI with moderate CFI = Calm (blue)
  if (hri > 50 && cfi < 65) return 'calm';
  if (gmi > 10 && cfi < 60) return 'calm';
  
  // Moderate-high CFI = Fear (orange)
  if (cfi > 62) return 'fear';
  
  // Negative GMI = Fear (orange)
  if (gmi < -5) return 'fear';
  
  // Very negative = Anger (red)
  if (gmi < -15) return 'anger';
  
  // Default = Neutral (yellow)
  return 'neutral';
}

interface CountryData {
  countryCode: string;
  countryName: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  isRealData: boolean;
  confidence: number;
}

interface EmotionGoogleMapProps {
  className?: string;
  countriesData: CountryData[];
  isLoading: boolean;
  onCountryClick: (code: string, name: string) => void;
}

export function EmotionGoogleMap({
  className,
  countriesData,
  isLoading,
  onCountryClick,
}: EmotionGoogleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const circles = useRef<google.maps.Circle[]>([]);
  const pulseCircles = useRef<google.maps.Circle[]>([]);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const pulseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create a map of country data for quick lookup
  const countryDataMap = new Map<string, CountryData>();
  countriesData.forEach(c => {
    countryDataMap.set(c.countryCode, c);
  });

  const init = usePersistFn(async () => {
    await loadMapScript();
    if (!mapContainer.current || !window.google) {
      console.error("Map container or Google Maps not found");
      return;
    }
    
    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: 2,
      center: { lat: 25, lng: 30 }, // Center on Middle East/Africa
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: false,
      mapId: "EMOTION_MAP_ID",
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
        { featureType: "road", stylers: [{ visibility: "off" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4a5568" }] },
        { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
      ],
    });
    
    infoWindow.current = new window.google.maps.InfoWindow();
    setMapReady(true);
  });

  useEffect(() => {
    init();
  }, [init]);

  // Update circles when data changes
  useEffect(() => {
    if (!mapReady || !map.current || !window.google) return;

    // Debug: Log countries data
    console.log('EmotionGoogleMap - countriesData:', countriesData.length, 'countries');
    console.log('EmotionGoogleMap - countryDataMap size:', countryDataMap.size);
    
    // Clear existing circles and pulse circles
    circles.current.forEach(circle => circle.setMap(null));
    circles.current = [];
    pulseCircles.current.forEach(circle => circle.setMap(null));
    pulseCircles.current = [];
    if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
    }

    // Add circles for each country
    console.log('Creating circles for', Object.keys(COUNTRY_COORDS).length, 'countries');
    console.log('CountryDataMap has', countryDataMap.size, 'entries');
    
    Object.entries(COUNTRY_COORDS).forEach(([code, coords]) => {
      const data = countryDataMap.get(code);
      const mood = data ? getMoodFromIndices(data.gmi, data.cfi, data.hri) : 'neutral';
      const color = MOOD_COLORS[mood] || MOOD_COLORS.neutral;
      
      // Debug first few countries
      if (['LY', 'EG', 'US', 'JP', 'BR'].includes(code)) {
        console.log(`Country ${code}: data=${JSON.stringify(data)}, mood=${mood}, color=${color}`);
      }
      
      // Create circle
      const circle = new window.google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: color,
        fillOpacity: 0.6,
        map: map.current,
        center: { lat: coords.lat, lng: coords.lng },
        radius: data ? 300000 + (Math.abs(data.gmi) * 5000) : 200000, // Size based on GMI intensity
        clickable: true,
      });

      // Add click listener
      circle.addListener('click', () => {
        onCountryClick(code, coords.nameEn);
      });

      // Add hover listener for info window
      circle.addListener('mouseover', () => {
        if (!infoWindow.current || !map.current) return;
        
        const content = data 
          ? `<div style="padding: 8px; color: #1a1a2e; min-width: 150px;">
              <strong style="font-size: 14px;">${coords.name} (${coords.nameEn})</strong>
              <div style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center;">
                <div>
                  <div style="font-size: 10px; color: #666;">GMI</div>
                  <div style="font-weight: bold; color: ${data.gmi > 0 ? '#2A9D8F' : '#E63946'};">${data.gmi.toFixed(1)}</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: #666;">CFI</div>
                  <div style="font-weight: bold; color: #F4A261;">${data.cfi.toFixed(1)}%</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: #666;">HRI</div>
                  <div style="font-weight: bold; color: #2A9D8F;">${data.hri.toFixed(1)}%</div>
                </div>
              </div>
            </div>`
          : `<div style="padding: 8px; color: #1a1a2e;">
              <strong>${coords.name} (${coords.nameEn})</strong>
              <div style="color: #666; margin-top: 4px;">لا توجد بيانات</div>
            </div>`;
        
        infoWindow.current.setContent(content);
        infoWindow.current.setPosition({ lat: coords.lat, lng: coords.lng });
        infoWindow.current.open(map.current);
      });

      circle.addListener('mouseout', () => {
        if (infoWindow.current) {
          infoWindow.current.close();
        }
      });

      circles.current.push(circle);

      // Create pulse circle for animation effect
      const pulseCircle = new window.google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: color,
        fillOpacity: 0.2,
        map: map.current,
        center: { lat: coords.lat, lng: coords.lng },
        radius: data ? 300000 + (Math.abs(data.gmi) * 5000) : 200000,
        clickable: false,
      });
      pulseCircles.current.push(pulseCircle);
    });

    // Animate pulse effect
    let pulsePhase = 0;
    pulseIntervalRef.current = setInterval(() => {
      pulsePhase = (pulsePhase + 1) % 60;
      const scale = 1 + Math.sin(pulsePhase * Math.PI / 30) * 0.3;
      const opacity = 0.15 + Math.sin(pulsePhase * Math.PI / 30) * 0.1;
      
      pulseCircles.current.forEach((pulseCircle, index) => {
        const baseCircle = circles.current[index];
        if (baseCircle && pulseCircle) {
          const baseRadius = baseCircle.getRadius();
          pulseCircle.setRadius(baseRadius * scale);
          pulseCircle.setOptions({ fillOpacity: opacity });
        }
      });
    }, 50);

    // Cleanup on unmount
    return () => {
      if (pulseIntervalRef.current) {
        clearInterval(pulseIntervalRef.current);
      }
    };
  }, [mapReady, countriesData, onCountryClick]);

  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-border/30", className)}>
      {/* Loading overlay */}
      {(isLoading || !mapReady) && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري تحميل الخريطة...</span>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapContainer} className="w-full h-[500px]" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOOD_COLORS.hope }} />
            <span>Hope</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOOD_COLORS.calm }} />
            <span>Calm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOOD_COLORS.neutral }} />
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOOD_COLORS.fear }} />
            <span>Fear</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MOOD_COLORS.anger }} />
            <span>Anger</span>
          </div>
        </div>
      </div>
      
      {/* Live indicator */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border flex items-center gap-2 text-xs">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Live Data</span>
      </div>
    </div>
  );
}
