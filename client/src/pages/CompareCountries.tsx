/**
 * Compare Countries Page - DCFT Side-by-Side Comparison
 * Uses the unified network engine's compareDCFT endpoint for real-time analysis
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  Globe,
  BarChart3,
  Brain,
  Heart,
  Shield,
  ArrowLeft,
  Zap,
  Activity,
  Newspaper,
  Hash,
} from "lucide-react";

// Country list organized by region
const COUNTRIES = [
  // MENA
  { code: "LY", nameAr: "ليبيا", nameEn: "Libya", region: "MENA" },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt", region: "MENA" },
  { code: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia", region: "MENA" },
  { code: "AE", nameAr: "الإمارات", nameEn: "UAE", region: "MENA" },
  { code: "QA", nameAr: "قطر", nameEn: "Qatar", region: "MENA" },
  { code: "KW", nameAr: "الكويت", nameEn: "Kuwait", region: "MENA" },
  { code: "BH", nameAr: "البحرين", nameEn: "Bahrain", region: "MENA" },
  { code: "OM", nameAr: "عُمان", nameEn: "Oman", region: "MENA" },
  { code: "YE", nameAr: "اليمن", nameEn: "Yemen", region: "MENA" },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan", region: "MENA" },
  { code: "LB", nameAr: "لبنان", nameEn: "Lebanon", region: "MENA" },
  { code: "SY", nameAr: "سوريا", nameEn: "Syria", region: "MENA" },
  { code: "IQ", nameAr: "العراق", nameEn: "Iraq", region: "MENA" },
  { code: "PS", nameAr: "فلسطين", nameEn: "Palestine", region: "MENA" },
  { code: "TN", nameAr: "تونس", nameEn: "Tunisia", region: "MENA" },
  { code: "DZ", nameAr: "الجزائر", nameEn: "Algeria", region: "MENA" },
  { code: "MA", nameAr: "المغرب", nameEn: "Morocco", region: "MENA" },
  { code: "SD", nameAr: "السودان", nameEn: "Sudan", region: "MENA" },
  // Europe
  { code: "GB", nameAr: "بريطانيا", nameEn: "United Kingdom", region: "Europe" },
  { code: "FR", nameAr: "فرنسا", nameEn: "France", region: "Europe" },
  { code: "DE", nameAr: "ألمانيا", nameEn: "Germany", region: "Europe" },
  { code: "IT", nameAr: "إيطاليا", nameEn: "Italy", region: "Europe" },
  { code: "ES", nameAr: "إسبانيا", nameEn: "Spain", region: "Europe" },
  { code: "NL", nameAr: "هولندا", nameEn: "Netherlands", region: "Europe" },
  { code: "SE", nameAr: "السويد", nameEn: "Sweden", region: "Europe" },
  { code: "NO", nameAr: "النرويج", nameEn: "Norway", region: "Europe" },
  { code: "RU", nameAr: "روسيا", nameEn: "Russia", region: "Europe" },
  { code: "UA", nameAr: "أوكرانيا", nameEn: "Ukraine", region: "Europe" },
  { code: "TR", nameAr: "تركيا", nameEn: "Turkey", region: "Europe" },
  // Americas
  { code: "US", nameAr: "أمريكا", nameEn: "United States", region: "Americas" },
  { code: "CA", nameAr: "كندا", nameEn: "Canada", region: "Americas" },
  { code: "MX", nameAr: "المكسيك", nameEn: "Mexico", region: "Americas" },
  { code: "BR", nameAr: "البرازيل", nameEn: "Brazil", region: "Americas" },
  { code: "AR", nameAr: "الأرجنتين", nameEn: "Argentina", region: "Americas" },
  // Asia
  { code: "CN", nameAr: "الصين", nameEn: "China", region: "Asia" },
  { code: "JP", nameAr: "اليابان", nameEn: "Japan", region: "Asia" },
  { code: "KR", nameAr: "كوريا الجنوبية", nameEn: "South Korea", region: "Asia" },
  { code: "IN", nameAr: "الهند", nameEn: "India", region: "Asia" },
  { code: "PK", nameAr: "باكستان", nameEn: "Pakistan", region: "Asia" },
  { code: "ID", nameAr: "إندونيسيا", nameEn: "Indonesia", region: "Asia" },
  // Africa
  { code: "NG", nameAr: "نيجيريا", nameEn: "Nigeria", region: "Africa" },
  { code: "ZA", nameAr: "جنوب أفريقيا", nameEn: "South Africa", region: "Africa" },
  { code: "KE", nameAr: "كينيا", nameEn: "Kenya", region: "Africa" },
  // Oceania
  { code: "AU", nameAr: "أستراليا", nameEn: "Australia", region: "Oceania" },
  { code: "NZ", nameAr: "نيوزيلندا", nameEn: "New Zealand", region: "Oceania" },
];

const REGIONS = ["MENA", "Europe", "Americas", "Asia", "Africa", "Oceania"];

const EMOTION_COLORS: Record<string, string> = {
  joy: '#FBBF24', fear: '#A855F7', anger: '#EF4444',
  sadness: '#3B82F6', hope: '#10B981', curiosity: '#06B6D4',
};

const EMOTION_LABELS_AR: Record<string, string> = {
  joy: 'فرح', fear: 'خوف', anger: 'غضب',
  sadness: 'حزن', hope: 'أمل', curiosity: 'فضول',
};

// ============================================================
// COMPARISON BAR COMPONENT
// ============================================================
function ComparisonBar({ 
  label, value1, value2, max, color, country1Name, country2Name 
}: { 
  label: string; value1: number; value2: number; max: number; color: string;
  country1Name: string; country2Name: string;
}) {
  const pct1 = max > 0 ? Math.abs(value1) / max * 100 : 0;
  const pct2 = max > 0 ? Math.abs(value2) / max * 100 : 0;
  const diff = value1 - value2;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`text-xs font-medium ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
          {diff > 0 ? '+' : ''}{diff.toFixed(1)}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 text-right truncate">{country1Name}</span>
          <div className="flex-1 h-4 bg-black/30 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm transition-all duration-700" style={{ width: `${Math.max(pct1, 2)}%`, backgroundColor: color, opacity: 0.8 }} />
          </div>
          <span className="text-xs text-white w-12 text-right">{value1.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 text-right truncate">{country2Name}</span>
          <div className="flex-1 h-4 bg-black/30 rounded-sm overflow-hidden">
            <div className="h-full rounded-sm transition-all duration-700" style={{ width: `${Math.max(pct2, 2)}%`, backgroundColor: color, opacity: 0.5 }} />
          </div>
          <span className="text-xs text-white w-12 text-right">{value2.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CompareCountries() {
  const [country1, setCountry1] = useState<string>("");
  const [country2, setCountry2] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const compareDCFT = trpc.engine.compareDCFT.useMutation();

  const filteredCountries = useMemo(() => {
    if (regionFilter === "all") return COUNTRIES;
    return COUNTRIES.filter(c => c.region === regionFilter);
  }, [regionFilter]);

  const country1Info = COUNTRIES.find(c => c.code === country1);
  const country2Info = COUNTRIES.find(c => c.code === country2);

  const handleCompare = () => {
    if (!country1 || !country2 || !country1Info || !country2Info) return;
    compareDCFT.mutate({
      country1Code: country1,
      country1Name: country1Info.nameEn,
      country2Code: country2,
      country2Name: country2Info.nameEn,
    });
  };

  const swapCountries = () => {
    const temp = country1;
    setCountry1(country2);
    setCountry2(temp);
  };

  const data = compareDCFT.data;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DCFT Country Comparison
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <ArrowLeftRight className="h-3 w-3 mr-1" />
            DCFT Comparison
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Compare DCFT Indices Between Countries
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Side-by-side comparison of GMI, CFI, HRI indices and emotional spectra using real-time DCFT analysis from the unified network engine
          </p>
        </div>

        {/* Country Selection */}
        <Card className="mb-8 bg-[#111827] border-white/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Region Filter */}
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-40 bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Country 1 */}
              <Select value={country1} onValueChange={setCountry1}>
                <SelectTrigger className="w-52 bg-blue-500/10 border-blue-500/30 text-white">
                  <SelectValue placeholder="Select Country 1" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCountries.map(country => (
                    <SelectItem 
                      key={country.code} 
                      value={country.code}
                      disabled={country.code === country2}
                    >
                      {country.nameAr} ({country.nameEn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Swap Button */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={swapCountries}
                disabled={!country1 || !country2}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              {/* Country 2 */}
              <Select value={country2} onValueChange={setCountry2}>
                <SelectTrigger className="w-52 bg-purple-500/10 border-purple-500/30 text-white">
                  <SelectValue placeholder="Select Country 2" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCountries.map(country => (
                    <SelectItem 
                      key={country.code} 
                      value={country.code}
                      disabled={country.code === country1}
                    >
                      {country.nameAr} ({country.nameEn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Compare Button */}
              <Button 
                onClick={handleCompare}
                disabled={!country1 || !country2 || compareDCFT.isPending}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                {compareDCFT.isPending ? "Analyzing..." : "Compare DCFT"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {compareDCFT.isPending && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <Card key={i} className="bg-[#111827] border-white/10">
                  <CardContent className="pt-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-white/10 rounded w-1/3" />
                      <div className="h-24 bg-white/5 rounded" />
                      <div className="h-24 bg-white/5 rounded" />
                      <div className="h-24 bg-white/5 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {compareDCFT.error && (
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-red-400">Error: {compareDCFT.error.message}</p>
              <Button variant="outline" className="mt-4 border-red-500/30 text-red-400" onClick={handleCompare}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comparison Results */}
        {data && country1Info && country2Info && (
          <div className="space-y-6">
            {/* ============================================================ */}
            {/* COUNTRY HEADERS */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                  <h3 className="font-bold text-xl text-white">{country1Info.nameAr}</h3>
                  <p className="text-sm text-gray-400">{country1Info.nameEn}</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 capitalize">
                      {data.country1.dominantEmotion}
                    </Badge>
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      {data.country1.totalItems} sources
                    </Badge>
                  </div>
                  {data.country1.isRealData && (
                    <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                      <Activity className="w-3 h-3 mr-1" /> Live Data
                    </Badge>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-10 w-10 mx-auto mb-3 text-purple-400" />
                  <h3 className="font-bold text-xl text-white">{country2Info.nameAr}</h3>
                  <p className="text-sm text-gray-400">{country2Info.nameEn}</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 capitalize">
                      {data.country2.dominantEmotion}
                    </Badge>
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      {data.country2.totalItems} sources
                    </Badge>
                  </div>
                  {data.country2.isRealData && (
                    <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                      <Activity className="w-3 h-3 mr-1" /> Live Data
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ============================================================ */}
            {/* DCFT INDICES SIDE-BY-SIDE */}
            {/* ============================================================ */}
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  DCFT Indices Comparison
                </CardTitle>
                <CardDescription className="text-gray-400">
                  GMI, CFI, HRI calculated through the unified network engine's DCFT group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* GMI */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-blue-400 font-medium">GMI - Global Mood</span>
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">{data.country1.gmi.toFixed(1)}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{country1Info.nameEn}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">{data.country2.gmi.toFixed(1)}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{country2Info.nameEn}</p>
                      </div>
                    </div>
                    {/* Visual comparison bars */}
                    <div className="space-y-1">
                      <div className="h-3 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500/70 transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, ((data.country1.gmi) + 100) / 2))}%` }} />
                      </div>
                      <div className="h-3 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500/70 transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, ((data.country2.gmi) + 100) / 2))}%` }} />
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <Badge className={`text-[10px] ${data.country1.gmi > data.country2.gmi ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {data.country1.gmi > data.country2.gmi ? country1Info.nameEn : country2Info.nameEn} leads by {Math.abs(data.country1.gmi - data.country2.gmi).toFixed(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* CFI */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-amber-400 font-medium">CFI - Collective Fear</span>
                      <Shield className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">{data.country1.cfi.toFixed(1)}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{country1Info.nameEn}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">{data.country2.cfi.toFixed(1)}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{country2Info.nameEn}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500/70 transition-all duration-700" style={{ width: `${data.country1.cfi}%` }} />
                      </div>
                      <div className="h-3 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500/70 transition-all duration-700" style={{ width: `${data.country2.cfi}%` }} />
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <Badge className={`text-[10px] ${data.country1.cfi > data.country2.cfi ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {data.country1.cfi > data.country2.cfi ? country1Info.nameEn : country2Info.nameEn} higher fear by {Math.abs(data.country1.cfi - data.country2.cfi).toFixed(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* HRI */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-emerald-400 font-medium">HRI - Hope-Resilience</span>
                      <Heart className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">{data.country1.hri.toFixed(1)}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{country1Info.nameEn}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">{data.country2.hri.toFixed(1)}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{country2Info.nameEn}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500/70 transition-all duration-700" style={{ width: `${data.country1.hri}%` }} />
                      </div>
                      <div className="h-3 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500/70 transition-all duration-700" style={{ width: `${data.country2.hri}%` }} />
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <Badge className={`text-[10px] ${data.country1.hri > data.country2.hri ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {data.country1.hri > data.country2.hri ? country1Info.nameEn : country2Info.nameEn} more hopeful by {Math.abs(data.country1.hri - data.country2.hri).toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ============================================================ */}
            {/* EMOTION SPECTRUM COMPARISON */}
            {/* ============================================================ */}
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  Emotion Spectrum Comparison
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Six-dimensional affective vector comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.keys(EMOTION_COLORS).map(emotion => {
                    const v1 = (data.country1.emotions as Record<string, number>)[emotion] ?? 0;
                    const v2 = (data.country2.emotions as Record<string, number>)[emotion] ?? 0;
                    return (
                      <ComparisonBar
                        key={emotion}
                        label={`${EMOTION_LABELS_AR[emotion] || emotion} (${emotion})`}
                        value1={v1}
                        value2={v2}
                        max={1}
                        color={EMOTION_COLORS[emotion]}
                        country1Name={country1Info.nameEn}
                        country2Name={country2Info.nameEn}
                      />
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 text-[10px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-blue-500/80" />
                    <span>{country1Info.nameEn}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-purple-500/50" />
                    <span>{country2Info.nameEn}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ============================================================ */}
            {/* TRENDING KEYWORDS & BREAKING NEWS */}
            {/* ============================================================ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country 1 Details */}
              <Card className="bg-[#111827] border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    {country1Info.nameEn} - Trending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.country1.trendingKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {data.country1.trendingKeywords.slice(0, 10).map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] text-blue-300 border-blue-500/30">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {data.country1.breakingNews.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Newspaper className="w-3 h-3" /> Breaking News
                        </p>
                        {data.country1.breakingNews.slice(0, 3).map((news, i) => (
                          <div key={i} className="p-2 rounded bg-black/30 text-xs text-gray-300">
                            {news.headline}
                            <span className="text-[10px] text-gray-500 ml-2">({news.source})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-2">
                      <span>Confidence: {(data.country1.confidence * 100).toFixed(0)}%</span>
                      <span>Sources: {data.country1.sourceCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Country 2 Details */}
              <Card className="bg-[#111827] border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    {country2Info.nameEn} - Trending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.country2.trendingKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {data.country2.trendingKeywords.slice(0, 10).map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] text-purple-300 border-purple-500/30">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {data.country2.breakingNews.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Newspaper className="w-3 h-3" /> Breaking News
                        </p>
                        {data.country2.breakingNews.slice(0, 3).map((news, i) => (
                          <div key={i} className="p-2 rounded bg-black/30 text-xs text-gray-300">
                            {news.headline}
                            <span className="text-[10px] text-gray-500 ml-2">({news.source})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 mt-2">
                      <span>Confidence: {(data.country2.confidence * 100).toFixed(0)}%</span>
                      <span>Sources: {data.country2.sourceCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ============================================================ */}
            {/* SUMMARY */}
            {/* ============================================================ */}
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Comparison Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <h4 className="font-semibold text-blue-400 mb-3">{country1Info.nameAr} ({country1Info.nameEn})</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Global Mood: <span className={data.country1.gmi > 0 ? 'text-green-400' : 'text-red-400'}>{data.country1.gmi > 0 ? 'Positive' : 'Negative'}</span> ({data.country1.gmi.toFixed(1)})</p>
                      <p>Fear Level: <span className={data.country1.cfi > 50 ? 'text-red-400' : 'text-green-400'}>{data.country1.cfi > 50 ? 'High' : 'Low'}</span> ({data.country1.cfi.toFixed(1)})</p>
                      <p>Hope-Resilience: <span className={data.country1.hri > 50 ? 'text-green-400' : 'text-amber-400'}>{data.country1.hri > 50 ? 'Strong' : 'Weak'}</span> ({data.country1.hri.toFixed(1)})</p>
                      <p>Dominant Emotion: <span className="text-white capitalize">{data.country1.dominantEmotion}</span></p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <h4 className="font-semibold text-purple-400 mb-3">{country2Info.nameAr} ({country2Info.nameEn})</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Global Mood: <span className={data.country2.gmi > 0 ? 'text-green-400' : 'text-red-400'}>{data.country2.gmi > 0 ? 'Positive' : 'Negative'}</span> ({data.country2.gmi.toFixed(1)})</p>
                      <p>Fear Level: <span className={data.country2.cfi > 50 ? 'text-red-400' : 'text-green-400'}>{data.country2.cfi > 50 ? 'High' : 'Low'}</span> ({data.country2.cfi.toFixed(1)})</p>
                      <p>Hope-Resilience: <span className={data.country2.hri > 50 ? 'text-green-400' : 'text-amber-400'}>{data.country2.hri > 50 ? 'Strong' : 'Weak'}</span> ({data.country2.hri.toFixed(1)})</p>
                      <p>Dominant Emotion: <span className="text-white capitalize">{data.country2.dominantEmotion}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!data && !compareDCFT.isPending && (
          <Card className="text-center py-16 bg-[#111827] border-white/10">
            <CardContent>
              <Globe className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select Two Countries to Compare</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Choose two countries from the dropdowns above and click "Compare DCFT" to see a side-by-side analysis of their emotional indices using the Digital Consciousness Field Theory
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
