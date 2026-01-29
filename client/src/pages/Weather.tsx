import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning,
  Wind,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Bell,
  RefreshCw,
  Thermometer
} from "lucide-react";
import { useState } from "react";
import { AlertSubscription } from "@/components/AlertSubscription";

export default function Weather() {
  const [forecastHours, setForecastHours] = useState(24);
  
  const { data: forecast, refetch: refetchForecast, isLoading: forecastLoading } = 
    trpc.dcft.getEmotionalForecast.useQuery({ hoursAhead: forecastHours });
  
  const { data: alerts, refetch: refetchAlerts, isLoading: alertsLoading } = 
    trpc.dcft.checkAlerts.useQuery();
  
  const { data: dcfData } = trpc.dcft.calculateDCF.useQuery({});

  const getWeatherIcon = (trend: string, cfi: number) => {
    if (cfi > 70) return <CloudLightning className="w-24 h-24 text-red-400" />;
    if (cfi > 50) return <CloudRain className="w-24 h-24 text-orange-400" />;
    if (trend === 'improving') return <Sun className="w-24 h-24 text-yellow-400" />;
    if (trend === 'declining') return <Cloud className="w-24 h-24 text-slate-400" />;
    return <Wind className="w-24 h-24 text-cyan-400" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (trend === 'declining') return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-slate-400" />;
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      default: return 'bg-green-500/20 border-green-500/50 text-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Emotional Weather
              </span>
            </div>
            <AlertSubscription compact />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            Emotional Forecasting System
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Global Emotional Weather
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Forecasting hope, fear, and collective clarity for the planet
          </p>
        </div>

        {/* Main Weather Display */}
        <Card className="mb-8 bg-black/40 border-blue-500/30 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <CardContent className="relative p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Weather Icon & Status */}
              <div className="text-center">
                {forecast && getWeatherIcon(forecast.trend, forecast.predictedCFI)}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {forecast && getTrendIcon(forecast.trend)}
                  <span className="text-2xl font-bold text-white capitalize">
                    {forecast?.trend || 'Loading...'} Conditions
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Thermometer className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">
                    Confidence: {forecast ? (forecast.confidence * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>

              {/* Forecast Details */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">Global Mood Index</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {forecast?.predictedGMI.toFixed(1) || '0'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                      style={{ width: `${((forecast?.predictedGMI || 0) + 100) / 2}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">Collective Fear Index</span>
                    <span className="text-2xl font-bold text-red-400">
                      {forecast?.predictedCFI.toFixed(1) || '50'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
                      style={{ width: `${forecast?.predictedCFI || 50}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">Hope Resonance Index</span>
                    <span className="text-2xl font-bold text-green-400">
                      {forecast?.predictedHRI.toFixed(1) || '50'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                      style={{ width: `${forecast?.predictedHRI || 50}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Text */}
            {forecast && (
              <div className="mt-8 p-6 rounded-lg bg-black/30 border border-white/10">
                <p className="text-lg text-slate-200 leading-relaxed">
                  {forecast.forecast}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Forecast Range & Alerts */}
        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid grid-cols-2 bg-black/40 border border-white/10">
            <TabsTrigger value="forecast" className="data-[state=active]:bg-blue-500/30">
              <Cloud className="w-4 h-4 mr-2" />
              Forecast Range
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-red-500/30">
              <Bell className="w-4 h-4 mr-2" />
              Alert System
            </TabsTrigger>
          </TabsList>

          {/* Forecast Range Tab */}
          <TabsContent value="forecast">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">Forecast Time Range</CardTitle>
                <CardDescription className="text-slate-400">
                  Select how far ahead to forecast emotional conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-6">
                  {[6, 12, 24, 48, 72, 168].map((hours) => (
                    <Button
                      key={hours}
                      variant={forecastHours === hours ? "default" : "outline"}
                      onClick={() => setForecastHours(hours)}
                      className={forecastHours === hours ? "bg-blue-500 hover:bg-blue-600" : ""}
                    >
                      {hours < 24 ? `${hours}H` : hours === 24 ? '1 Day' : hours === 48 ? '2 Days' : hours === 72 ? '3 Days' : '1 Week'}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={() => refetchForecast()} 
                  disabled={forecastLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${forecastLoading ? 'animate-spin' : ''}`} />
                  Update Forecast
                </Button>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-black/30">
                    <div className="text-sm text-slate-400 mb-1">Data Points</div>
                    <div className="text-xl font-bold text-cyan-400">{forecast?.dataPoints || 0}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/30">
                    <div className="text-sm text-slate-400 mb-1">Forecast Hours</div>
                    <div className="text-xl font-bold text-purple-400">{forecastHours}h</div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/30">
                    <div className="text-sm text-slate-400 mb-1">Last Updated</div>
                    <div className="text-sm font-bold text-green-400">
                      {forecast?.generatedAt ? new Date(forecast.generatedAt).toLocaleTimeString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Early Warning System
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Real-time monitoring of emotional stability thresholds
                    </CardDescription>
                  </div>
                  {alerts && (
                    <Badge className={getAlertColor(alerts.alertLevel)}>
                      {alerts.alertLevel.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Current Status */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Current GMI</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {alerts?.currentIndices.GMI.toFixed(1) || '0'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Current CFI</div>
                    <div className="text-2xl font-bold text-red-400">
                      {alerts?.currentIndices.CFI.toFixed(1) || '50'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-black/30 border border-white/10">
                    <div className="text-sm text-slate-400 mb-1">Current HRI</div>
                    <div className="text-2xl font-bold text-green-400">
                      {alerts?.currentIndices.HRI.toFixed(1) || '50'}
                    </div>
                  </div>
                </div>

                {/* Alerts List */}
                <div className="space-y-3">
                  {alerts?.hasAlert ? (
                    alerts.alerts.map((alert, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg border ${getAlertColor(alerts.alertLevel)}`}
                      >
                        {alert}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                      <Sun className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-green-300 font-semibold">All Clear</p>
                      <p className="text-slate-400 text-sm mt-1">
                        No alerts at this time. Emotional conditions are within normal parameters.
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => refetchAlerts()} 
                  disabled={alertsLoading}
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${alertsLoading ? 'animate-spin' : ''}`} />
                  Check for Alerts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Current Field Status */}
        {dcfData && (
          <Card className="mt-8 bg-black/40 border-purple-500/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-400">Current Digital Consciousness Field</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-black/30">
                  <div className="text-2xl font-bold text-cyan-400">{dcfData.dcfAmplitude.toFixed(2)}</div>
                  <div className="text-sm text-slate-400">D(t) Amplitude</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-black/30">
                  <div className="text-2xl font-bold text-purple-400 capitalize">{dcfData.phase.dominantEmotion}</div>
                  <div className="text-sm text-slate-400">Dominant Emotion</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-black/30">
                  <div className="text-2xl font-bold text-green-400">{(dcfData.phase.coherence * 100).toFixed(0)}%</div>
                  <div className="text-sm text-slate-400">Coherence</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-black/30">
                  <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: dcfData.color.primary }} />
                  <div className="text-sm text-slate-400">{dcfData.color.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
