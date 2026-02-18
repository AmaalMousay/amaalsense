/**
 * Emotional Weather Page
 * صفحة الطقس العاطفي - عرض المشاعر الجماعية الحالية
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

interface EmotionalWeatherData {
  primaryEmotion: string;
  intensity: number; // 0-100
  secondaryEmotions: Array<{
    emotion: string;
    intensity: number;
  }>;
  trend: "increasing" | "decreasing" | "stable";
  topicsAffecting: string[];
  globalContext: string;
  recommendations: string[];
  timestamp: Date;
}

export default function EmotionalWeather() {
  const [weatherData, setWeatherData] = useState<EmotionalWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Fetch emotional weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        // Simulate fetching data from the API
        const mockData: EmotionalWeatherData = {
          primaryEmotion: "Hope",
          intensity: 72,
          secondaryEmotions: [
            { emotion: "Optimism", intensity: 65 },
            { emotion: "Concern", intensity: 45 },
            { emotion: "Determination", intensity: 58 }
          ],
          trend: "increasing",
          topicsAffecting: [
            "Climate Change Solutions",
            "Technological Innovation",
            "Social Progress"
          ],
          globalContext:
            "Global sentiment is shifting towards optimism due to recent breakthroughs in renewable energy and international cooperation.",
          recommendations: [
            "Engage with positive news about climate solutions",
            "Share success stories of innovation",
            "Connect with communities working on sustainability"
          ],
          timestamp: new Date()
        };
        setWeatherData(mockData);
      } catch (error) {
        console.error("Error fetching emotional weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getEmotionColor = (emotion: string): string => {
    const emotionColors: Record<string, string> = {
      Hope: "bg-gradient-to-r from-yellow-400 to-orange-500",
      Joy: "bg-gradient-to-r from-green-400 to-emerald-500",
      Sadness: "bg-gradient-to-r from-blue-400 to-indigo-500",
      Anger: "bg-gradient-to-r from-red-400 to-rose-500",
      Fear: "bg-gradient-to-r from-purple-400 to-violet-500",
      Surprise: "bg-gradient-to-r from-pink-400 to-fuchsia-500",
      Disgust: "bg-gradient-to-r from-amber-400 to-yellow-600",
      Trust: "bg-gradient-to-r from-teal-400 to-cyan-500",
      Anticipation: "bg-gradient-to-r from-sky-400 to-blue-500",
      Optimism: "bg-gradient-to-r from-lime-400 to-green-500",
      Concern: "bg-gradient-to-r from-orange-400 to-red-500",
      Determination: "bg-gradient-to-r from-slate-400 to-gray-600"
    };
    return emotionColors[emotion] || "bg-gradient-to-r from-gray-400 to-gray-600";
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case "increasing":
        return "📈";
      case "decreasing":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌪️</div>
          <p className="text-lg font-semibold">جاري تحليل الطقس العاطفي...</p>
          <p className="text-sm text-gray-500">Analyzing Emotional Weather...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>خطأ</CardTitle>
            <CardDescription>Error loading emotional weather data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>إعادة محاولة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🌍 الطقس العاطفي العالمي
          </h1>
          <p className="text-xl text-gray-300">Global Emotional Weather</p>
          <p className="text-sm text-gray-400 mt-2">
            آخر تحديث: {weatherData.timestamp.toLocaleString("ar-SA")}
          </p>
        </div>

        {/* Main Emotion Card */}
        <div className="mb-8">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className={`${getEmotionColor(weatherData.primaryEmotion)} p-8 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-bold mb-2">{weatherData.primaryEmotion}</h2>
                  <p className="text-lg opacity-90">المشاعر الأساسية | Primary Emotion</p>
                </div>
                <div className="text-6xl">{getTrendIcon(weatherData.trend)}</div>
              </div>

              {/* Intensity Bar */}
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">الشدة | Intensity</span>
                  <span className="text-sm font-bold">{weatherData.intensity}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${weatherData.intensity}%` }}
                  />
                </div>
              </div>

              {/* Trend Info */}
              <div className="mt-4 text-sm opacity-90">
                {weatherData.trend === "increasing" && "المشاعر في ارتفاع | Emotions are rising"}
                {weatherData.trend === "decreasing" && "المشاعر في انخفاض | Emotions are declining"}
                {weatherData.trend === "stable" && "المشاعر مستقرة | Emotions are stable"}
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Emotions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {weatherData.secondaryEmotions.map((emotion, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{emotion.emotion}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الشدة</span>
                    <span className="font-bold">{emotion.intensity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${getEmotionColor(emotion.emotion)} h-full rounded-full`}
                      style={{ width: `${emotion.intensity}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Context */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              السياق العالمي | Global Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{weatherData.globalContext}</p>
          </CardContent>
        </Card>

        {/* Topics Affecting Emotions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Topics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📌</span>
                الموضوعات المؤثرة | Affecting Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weatherData.topicsAffecting.map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <span className="text-lg mr-2">→</span>
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                التوصيات | Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {weatherData.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-lg">✨</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Selected Topic Details */}
        {selectedTopic && (
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle>تفاصيل الموضوع | Topic Details</CardTitle>
              <CardDescription>{selectedTopic}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  هذا الموضوع يؤثر بشكل كبير على المشاعر الجماعية الحالية. يمكنك الاطلاع على
                  المزيد من التحليلات والإحصائيات المتعلقة به.
                </p>
                <Button className="w-full">
                  اقرأ المزيد | Read More Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>تحديث الطقس العاطفي كل ساعة | Emotional Weather updates every hour</p>
          <p className="mt-2">مدعوم بـ AmalSense Engine | Powered by AmalSense Engine</p>
        </div>
      </div>
    </div>
  );
}
