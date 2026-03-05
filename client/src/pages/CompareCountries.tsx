/**
 * Compare Countries Page
 * Allows users to compare emotional indices between two countries side by side
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Globe,
  BarChart3,
  Brain,
  Heart,
  Shield
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
  { code: "BE", nameAr: "بلجيكا", nameEn: "Belgium", region: "Europe" },
  { code: "SE", nameAr: "السويد", nameEn: "Sweden", region: "Europe" },
  { code: "NO", nameAr: "النرويج", nameEn: "Norway", region: "Europe" },
  { code: "DK", nameAr: "الدنمارك", nameEn: "Denmark", region: "Europe" },
  { code: "FI", nameAr: "فنلندا", nameEn: "Finland", region: "Europe" },
  { code: "PL", nameAr: "بولندا", nameEn: "Poland", region: "Europe" },
  { code: "RU", nameAr: "روسيا", nameEn: "Russia", region: "Europe" },
  { code: "UA", nameAr: "أوكرانيا", nameEn: "Ukraine", region: "Europe" },
  { code: "TR", nameAr: "تركيا", nameEn: "Turkey", region: "Europe" },
  // Americas
  { code: "US", nameAr: "أمريكا", nameEn: "United States", region: "Americas" },
  { code: "CA", nameAr: "كندا", nameEn: "Canada", region: "Americas" },
  { code: "MX", nameAr: "المكسيك", nameEn: "Mexico", region: "Americas" },
  { code: "BR", nameAr: "البرازيل", nameEn: "Brazil", region: "Americas" },
  { code: "AR", nameAr: "الأرجنتين", nameEn: "Argentina", region: "Americas" },
  { code: "CO", nameAr: "كولومبيا", nameEn: "Colombia", region: "Americas" },
  { code: "CL", nameAr: "تشيلي", nameEn: "Chile", region: "Americas" },
  // Asia
  { code: "CN", nameAr: "الصين", nameEn: "China", region: "Asia" },
  { code: "JP", nameAr: "اليابان", nameEn: "Japan", region: "Asia" },
  { code: "KR", nameAr: "كوريا الجنوبية", nameEn: "South Korea", region: "Asia" },
  { code: "IN", nameAr: "الهند", nameEn: "India", region: "Asia" },
  { code: "PK", nameAr: "باكستان", nameEn: "Pakistan", region: "Asia" },
  { code: "ID", nameAr: "إندونيسيا", nameEn: "Indonesia", region: "Asia" },
  { code: "MY", nameAr: "ماليزيا", nameEn: "Malaysia", region: "Asia" },
  { code: "SG", nameAr: "سنغافورة", nameEn: "Singapore", region: "Asia" },
  { code: "TH", nameAr: "تايلاند", nameEn: "Thailand", region: "Asia" },
  { code: "VN", nameAr: "فيتنام", nameEn: "Vietnam", region: "Asia" },
  { code: "PH", nameAr: "الفلبين", nameEn: "Philippines", region: "Asia" },
  // Africa
  { code: "NG", nameAr: "نيجيريا", nameEn: "Nigeria", region: "Africa" },
  { code: "ZA", nameAr: "جنوب أفريقيا", nameEn: "South Africa", region: "Africa" },
  { code: "KE", nameAr: "كينيا", nameEn: "Kenya", region: "Africa" },
  { code: "ET", nameAr: "إثيوبيا", nameEn: "Ethiopia", region: "Africa" },
  { code: "GH", nameAr: "غانا", nameEn: "Ghana", region: "Africa" },
  // Oceania
  { code: "AU", nameAr: "أستراليا", nameEn: "Australia", region: "Oceania" },
  { code: "NZ", nameAr: "نيوزيلندا", nameEn: "New Zealand", region: "Oceania" },
];

const REGIONS = ["MENA", "Europe", "Americas", "Asia", "Africa", "Oceania"];

interface CountryData {
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  trend: "up" | "down" | "stable";
}

function IndexCard({ 
  label, 
  value1, 
  value2, 
  country1, 
  country2,
  icon,
  color 
}: { 
  label: string; 
  value1: number; 
  value2: number; 
  country1: string;
  country2: string;
  icon: React.ReactNode;
  color: string;
}) {
  const diff = value1 - value2;
  const winner = diff > 0 ? country1 : diff < 0 ? country2 : "متساوي";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color }}>{value1.toFixed(1)}</div>
            <Progress value={value1} className="h-2 mt-2" />
          </div>
          <div className="text-center">
            <Badge variant={diff > 0 ? "default" : diff < 0 ? "destructive" : "secondary"}>
              {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">
              {winner === "متساوي" ? "متساوي" : `${winner} أفضل`}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color }}>{value2.toFixed(1)}</div>
            <Progress value={value2} className="h-2 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompareCountries() {
  const [country1, setCountry1] = useState<string>("");
  const [country2, setCountry2] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [isComparing, setIsComparing] = useState(false);
  const [data1, setData1] = useState<CountryData | null>(null);
  const [data2, setData2] = useState<CountryData | null>(null);

  const globalMoodQuery = trpc.emotion.getLatestIndices.useQuery();

  const filteredCountries = useMemo(() => {
    if (regionFilter === "all") return COUNTRIES;
    return COUNTRIES.filter(c => c.region === regionFilter);
  }, [regionFilter]);

  const country1Info = COUNTRIES.find(c => c.code === country1);
  const country2Info = COUNTRIES.find(c => c.code === country2);

  const handleCompare = async () => {
    if (!country1 || !country2) return;
    
    setIsComparing(true);
    
    // Simulate fetching data (in real app, this would be an API call)
    setTimeout(() => {
      // Generate realistic data based on global mood with some variation
      const baseMood = globalMoodQuery.data || { gmi: 0, cfi: 0, hri: 0 };
      
      setData1({
        gmi: Math.min(100, Math.max(0, baseMood.gmi + (Math.random() - 0.5) * 30)),
        cfi: Math.min(100, Math.max(0, baseMood.cfi + (Math.random() - 0.5) * 30)),
        hri: Math.min(100, Math.max(0, baseMood.hri + (Math.random() - 0.5) * 30)),
        dominantEmotion: ["أمل", "خوف", "غضب", "حزن", "فضول"][Math.floor(Math.random() * 5)],
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
      });
      
      setData2({
        gmi: Math.min(100, Math.max(0, baseMood.gmi + (Math.random() - 0.5) * 30)),
        cfi: Math.min(100, Math.max(0, baseMood.cfi + (Math.random() - 0.5) * 30)),
        hri: Math.min(100, Math.max(0, baseMood.hri + (Math.random() - 0.5) * 30)),
        dominantEmotion: ["أمل", "خوف", "غضب", "حزن", "فضول"][Math.floor(Math.random() * 5)],
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
      });
      
      setIsComparing(false);
    }, 1500);
  };

  const swapCountries = () => {
    const temp = country1;
    setCountry1(country2);
    setCountry2(temp);
    
    const tempData = data1;
    setData1(data2);
    setData2(tempData);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <ArrowLeftRight className="h-3 w-3 ml-1" />
            مقارنة الدول
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            مقارنة المزاج العام بين دولتين
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            قارن المؤشرات العاطفية (GMI, CFI, HRI) بين أي دولتين جنباً إلى جنب
          </p>
        </div>

        {/* Country Selection */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Region Filter */}
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="كل المناطق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المناطق</SelectItem>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Country 1 */}
              <Select value={country1} onValueChange={setCountry1}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر الدولة الأولى" />
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
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              {/* Country 2 */}
              <Select value={country2} onValueChange={setCountry2}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر الدولة الثانية" />
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
                disabled={!country1 || !country2 || isComparing}
              >
                {isComparing ? "جاري المقارنة..." : "قارن"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {data1 && data2 && country1Info && country2Info && (
          <div className="space-y-6">
            {/* Country Headers */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4 bg-primary/5 border-primary/20">
                <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-bold text-lg">{country1Info.nameAr}</h3>
                <p className="text-sm text-muted-foreground">{country1Info.nameEn}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {getTrendIcon(data1.trend)}
                  <span className="text-sm">{data1.dominantEmotion}</span>
                </div>
              </Card>
              
              <Card className="text-center p-4 flex items-center justify-center">
                <div>
                  <ArrowLeftRight className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">مقارنة</p>
                </div>
              </Card>
              
              <Card className="text-center p-4 bg-purple-500/5 border-purple-500/20">
                <Globe className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-bold text-lg">{country2Info.nameAr}</h3>
                <p className="text-sm text-muted-foreground">{country2Info.nameEn}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {getTrendIcon(data2.trend)}
                  <span className="text-sm">{data2.dominantEmotion}</span>
                </div>
              </Card>
            </div>

            {/* Index Comparisons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <IndexCard
                label="مؤشر المزاج العام (GMI)"
                value1={data1.gmi}
                value2={data2.gmi}
                country1={country1Info.nameAr}
                country2={country2Info.nameAr}
                icon={<Brain className="h-4 w-4 text-blue-500" />}
                color="#3B82F6"
              />
              <IndexCard
                label="مؤشر الخوف الجماعي (CFI)"
                value1={data1.cfi}
                value2={data2.cfi}
                country1={country1Info.nameAr}
                country2={country2Info.nameAr}
                icon={<Shield className="h-4 w-4 text-orange-500" />}
                color="#F97316"
              />
              <IndexCard
                label="مؤشر الأمل والمرونة (HRI)"
                value1={data1.hri}
                value2={data2.hri}
                country1={country1Info.nameAr}
                country2={country2Info.nameAr}
                icon={<Heart className="h-4 w-4 text-green-500" />}
                color="#22C55E"
              />
            </div>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  ملخص المقارنة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">{country1Info.nameAr}</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• المزاج العام: {data1.gmi > 50 ? "إيجابي" : "سلبي"} ({data1.gmi.toFixed(1)})</li>
                      <li>• مستوى الخوف: {data1.cfi > 50 ? "مرتفع" : "منخفض"} ({data1.cfi.toFixed(1)})</li>
                      <li>• الأمل والمرونة: {data1.hri > 50 ? "مرتفع" : "منخفض"} ({data1.hri.toFixed(1)})</li>
                      <li>• الشعور السائد: {data1.dominantEmotion}</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">{country2Info.nameAr}</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• المزاج العام: {data2.gmi > 50 ? "إيجابي" : "سلبي"} ({data2.gmi.toFixed(1)})</li>
                      <li>• مستوى الخوف: {data2.cfi > 50 ? "مرتفع" : "منخفض"} ({data2.cfi.toFixed(1)})</li>
                      <li>• الأمل والمرونة: {data2.hri > 50 ? "مرتفع" : "منخفض"} ({data2.hri.toFixed(1)})</li>
                      <li>• الشعور السائد: {data2.dominantEmotion}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!data1 && !data2 && (
          <Card className="text-center py-16">
            <CardContent>
              <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">اختر دولتين للمقارنة</h3>
              <p className="text-muted-foreground">
                حدد دولتين من القائمة أعلاه لمقارنة المؤشرات العاطفية بينهما
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
