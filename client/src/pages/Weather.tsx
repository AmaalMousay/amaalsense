/**
 * Emotional Weather Page
 * 
 * Displays global emotional climate with:
 * - Current conditions (Hope, Fear, Stability)
 * - Forecast for next 7 days
 * - Risk levels and recommendations
 * - Multi-language support
 */

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface WeatherData {
  date: string;
  hope: number;
  fear: number;
  stability: number;
  condition: 'sunny' | 'cloudy' | 'stormy' | 'rainy' | 'calm' | 'turbulent';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  recommendation: string;
}

export default function Weather() {
  const { t, language } = useI18n();
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching weather data
    const mockCurrent: WeatherData = {
      date: new Date().toISOString().split('T')[0],
      hope: 72,
      fear: 28,
      stability: 65,
      condition: 'sunny',
      riskLevel: 'low',
      recommendation: 'Positive global sentiment. Good time for initiatives.',
    };

    const mockForecast: WeatherData[] = [
      {
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        hope: 70,
        fear: 30,
        stability: 63,
        condition: 'cloudy',
        riskLevel: 'low',
        recommendation: 'Slight uncertainty expected.',
      },
      {
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        hope: 65,
        fear: 35,
        stability: 58,
        condition: 'rainy',
        riskLevel: 'moderate',
        recommendation: 'Monitor for potential volatility.',
      },
      {
        date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        hope: 68,
        fear: 32,
        stability: 61,
        condition: 'cloudy',
        riskLevel: 'moderate',
        recommendation: 'Stabilizing trend expected.',
      },
      {
        date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
        hope: 75,
        fear: 25,
        stability: 70,
        condition: 'sunny',
        riskLevel: 'low',
        recommendation: 'Strong positive indicators.',
      },
      {
        date: new Date(Date.now() + 432000000).toISOString().split('T')[0],
        hope: 73,
        fear: 27,
        stability: 68,
        condition: 'calm',
        riskLevel: 'low',
        recommendation: 'Stable conditions continue.',
      },
      {
        date: new Date(Date.now() + 518400000).toISOString().split('T')[0],
        hope: 70,
        fear: 30,
        stability: 65,
        condition: 'cloudy',
        riskLevel: 'low',
        recommendation: 'Minor fluctuations expected.',
      },
      {
        date: new Date(Date.now() + 604800000).toISOString().split('T')[0],
        hope: 72,
        fear: 28,
        stability: 67,
        condition: 'sunny',
        riskLevel: 'low',
        recommendation: 'Positive week ahead.',
      },
    ];

    setCurrentWeather(mockCurrent);
    setForecast(mockForecast);
    setLoading(false);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'stormy':
        return <AlertTriangle className="w-8 h-8 text-red-400" />;
      case 'calm':
        return <Wind className="w-8 h-8 text-blue-300" />;
      case 'turbulent':
        return <AlertTriangle className="w-8 h-8 text-orange-400" />;
      default:
        return <Cloud className="w-8 h-8" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'moderate':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getIndicatorColor = (value: number) => {
    if (value >= 70) return 'text-green-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">{t.weather.title}</h1>
        <p className="text-slate-400">{t.weather.subtitle}</p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">{t.weather.currentConditions}</TabsTrigger>
            <TabsTrigger value="forecast">{t.weather.forecast}</TabsTrigger>
            <TabsTrigger value="alerts">{t.weather.alerts}</TabsTrigger>
          </TabsList>

          {/* Current Conditions */}
          <TabsContent value="current" className="space-y-6">
            {currentWeather && (
              <>
                {/* Main Weather Card */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {getWeatherIcon(currentWeather.condition)}
                      <span className="capitalize">{currentWeather.condition}</span>
                    </CardTitle>
                    <CardDescription>
                      {currentWeather.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Indicators Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Hope */}
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300">{t.weather.hopeLevel}</span>
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                          {currentWeather.hope}%
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${currentWeather.hope}%` }}
                          />
                        </div>
                      </div>

                      {/* Fear */}
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300">{t.weather.fearLevel}</span>
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                          {currentWeather.fear}%
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-400 to-rose-500 h-2 rounded-full"
                            style={{ width: `${currentWeather.fear}%` }}
                          />
                        </div>
                      </div>

                      {/* Stability */}
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300">{t.weather.stabilityIndex}</span>
                          <Wind className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                          {currentWeather.stability}%
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${currentWeather.stability}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-300 font-medium">{t.weather.riskLevel}</span>
                        <Badge className={getRiskColor(currentWeather.riskLevel)}>
                          {currentWeather.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-slate-300">{currentWeather.recommendation}</p>
                    </div>

                    {/* Global Mood */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                      <h3 className="text-lg font-semibold text-white mb-2">{t.weather.globalMood}</h3>
                      <p className="text-slate-300">
                        Global emotional climate analysis showing hope at {currentWeather.hope}%, fear at {currentWeather.fear}%, and stability at {currentWeather.stability}%.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* 7-Day Forecast */}
          <TabsContent value="forecast" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {forecast.map((day, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{day.date}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Hope</span>
                          <span className={`font-semibold ${getIndicatorColor(day.hope)}`}>
                            {day.hope}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Fear</span>
                          <span className={`font-semibold ${getIndicatorColor(100 - day.fear)}`}>
                            {day.fear}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Stability</span>
                          <span className={`font-semibold ${getIndicatorColor(day.stability)}`}>
                            {day.stability}%
                          </span>
                        </div>
                      </div>

                      <Badge className={getRiskColor(day.riskLevel)}>
                        {day.riskLevel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>{t.weather.alerts}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-200 mb-1">Moderate Volatility Expected</h4>
                        <p className="text-sm text-yellow-100/80">
                          Day 3 forecast shows increased uncertainty. Recommend monitoring key indicators.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-200 mb-1">Positive Trend Detected</h4>
                        <p className="text-sm text-green-100/80">
                          Hope levels trending upward. Stability improving across all regions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
