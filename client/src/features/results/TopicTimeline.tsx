/**
 * Topic Timeline Page
 * Analyze sentiment evolution for a topic over time
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Clock,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  ArrowLeft,
  RefreshCw,
  Info
} from "lucide-react";

// Sample countries
const COUNTRIES = [
  { code: "LY", name: "" },
  { code: "EG", name: "" },
  { code: "SA", name: "" },
  { code: "AE", name: "" },
  { code: "US", name: "" },
  { code: "GB", name: "" },
];

interface TimelinePoint {
  date: string;
  support: number;
  opposition: number;
  neutral: number;
  sentiment: number;
}

// Generate mock timeline data
function generateTimelineData(days: number): TimelinePoint[] {
  const data: TimelinePoint[] = [];
  const now = new Date();
  
  let baseSentiment = 50 + Math.random() * 20;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some variation
    baseSentiment += (Math.random() - 0.5) * 10;
    baseSentiment = Math.max(20, Math.min(80, baseSentiment));
    
    const support = baseSentiment + (Math.random() - 0.5) * 10;
    const opposition = 100 - support - Math.random() * 20;
    const neutral = 100 - support - opposition;
    
    data.push({
      date: date.toISOString().split('T')[0],
      support: Math.round(support * 10) / 10,
      opposition: Math.round(opposition * 10) / 10,
      neutral: Math.round(neutral * 10) / 10,
      sentiment: Math.round(baseSentiment * 10) / 10,
    });
  }
  
  return data;
}

export default function TopicTimeline() {
  const [topic, setTopic] = useState("");
  const [country, setCountry] = useState("LY");
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30">("7");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelinePoint[] | null>(null);

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      toast.error("   Analysis");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const data = generateTimelineData(parseInt(timeRange));
    setTimelineData(data);
    setIsAnalyzing(false);
    toast.success(" Analysis Topic ");
  };

  const getCountryName = (code: string) => {
    return COUNTRIES.find(c => c.code === code)?.name || code;
  };

  const getTrend = () => {
    if (!timelineData || timelineData.length < 2) return null;
    const first = timelineData[0].sentiment;
    const last = timelineData[timelineData.length - 1].sentiment;
    return last - first;
  };

  const trend = getTrend();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/analyzer">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <Badge variant="outline" className="mb-2">
              <Clock className="h-3 w-3 ml-1" />
              Topic Timeline
            </Badge>
            <h1 className="text-2xl font-bold">Analysis   </h1>
            <p className="text-muted-foreground">  Emotions      </p>
          </div>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
               Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Topic</Label>
                <Input
                  placeholder=" Topic Analysis (:  )"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>

              <div className="space-y-2">
                <Label></Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label> </Label>
                <Select value={timeRange} onValueChange={(v) => setTimeRange(v as "7" | "14" | "30")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7"> 7 </SelectItem>
                    <SelectItem value="14"> 14 </SelectItem>
                    <SelectItem value="30"> 30 </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                     Analysis...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 ml-2" />
                    Analysis Topic
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {timelineData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground"> </p>
                      <p className="text-2xl font-bold text-green-500">
                        {(timelineData.reduce((a, b) => a + b.support, 0) / timelineData.length).toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground"> </p>
                      <p className="text-2xl font-bold text-red-500">
                        {(timelineData.reduce((a, b) => a + b.opposition, 0) / timelineData.length).toFixed(1)}%
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground"> </p>
                      <p className={`text-2xl font-bold ${trend && trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {trend ? (trend >= 0 ? "+" : "") + trend.toFixed(1) : "--"}%
                      </p>
                    </div>
                    {trend && trend >= 0 ? (
                      <TrendingUp className="h-8 w-8 text-green-500/20" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-500/20" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground"> </p>
                      <p className="text-2xl font-bold">{timelineData.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle> Emotions  </CardTitle>
                <CardDescription>
                  Analysis "{topic}"  {getCountryName(country)} -  {timeRange} 
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Simple Bar Chart */}
                <div className="space-y-4">
                  {timelineData.map((point, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{point.date}</span>
                        <span className="font-medium">{point.sentiment}%</span>
                      </div>
                      <div className="flex h-6 rounded-full overflow-hidden bg-muted">
                        <div
                          className="bg-green-500 transition-all duration-300"
                          style={{ width: `${point.support}%` }}
                          title={`: ${point.support}%`}
                        />
                        <div
                          className="bg-red-500 transition-all duration-300"
                          style={{ width: `${point.opposition}%` }}
                          title={`: ${point.opposition}%`}
                        />
                        <div
                          className="bg-gray-400 transition-all duration-300"
                          style={{ width: `${point.neutral}%` }}
                          title={`Neutral: ${point.neutral}%`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span className="text-sm"></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500" />
                    <span className="text-sm"></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-400" />
                    <span className="text-sm">Neutral</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                   Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2"> Analysis</h4>
                    <p className="text-muted-foreground">
                      {trend && trend >= 5 && ` Analysis     Emotions  "${topic}"       ${trend.toFixed(1)}%.`}
                      {trend && trend <= -5 && ` Analysis    Emotions  "${topic}"       ${Math.abs(trend).toFixed(1)}%.`}
                      {trend && trend > -5 && trend < 5 && `Emotions  "${topic}"          ${trend.toFixed(1)}%.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">  </h4>
                      <p className="text-muted-foreground">
                        {timelineData.reduce((max, p) => p.support > max.support ? p : max).date}
                        {" - "}
                        {timelineData.reduce((max, p) => p.support > max.support ? p : max).support}%
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">  </h4>
                      <p className="text-muted-foreground">
                        {timelineData.reduce((max, p) => p.opposition > max.opposition ? p : max).date}
                        {" - "}
                        {timelineData.reduce((max, p) => p.opposition > max.opposition ? p : max).opposition}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!timelineData && !isAnalyzing && (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2"> Analysis</h3>
              <p className="text-muted-foreground mb-4">
                        Emotions  
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
