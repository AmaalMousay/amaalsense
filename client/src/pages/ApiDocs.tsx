/**
 * API Documentation Page
 * Provides comprehensive API documentation for developers
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Copy, 
  Check, 
  Key, 
  Globe, 
  BarChart3, 
  Bell,
  Zap,
  Lock,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = "https://api.amalsense.com/v1";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
  example: string;
}

const ENDPOINTS: Record<string, Endpoint[]> = {
  indices: [
    {
      method: "GET",
      path: "/indices/global",
      description: "Get current global emotion indices (GMI, CFI, HRI)",
      response: `{
  "gmi": 45.2,
  "cfi": 62.8,
  "hri": 38.5,
  "confidence": 87,
  "timestamp": "2026-01-31T12:00:00Z"
}`,
      example: `curl -X GET "${API_BASE_URL}/indices/global" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    {
      method: "GET",
      path: "/indices/country/:code",
      description: "Get emotion indices for a specific country",
      parameters: [
        { name: "code", type: "string", required: true, description: "ISO 3166-1 alpha-2 country code (e.g., LY, EG, US)" },
      ],
      response: `{
  "countryCode": "LY",
  "countryName": "Libya",
  "gmi": 42.1,
  "cfi": 58.3,
  "hri": 45.7,
  "confidence": 82,
  "timestamp": "2026-01-31T12:00:00Z"
}`,
      example: `curl -X GET "${API_BASE_URL}/indices/country/LY" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
  ],
  analysis: [
    {
      method: "POST",
      path: "/analyze/text",
      description: "Analyze emotion in a text using the Hybrid DCFT-AI Engine",
      parameters: [
        { name: "text", type: "string", required: true, description: "Text to analyze (max 1000 characters)" },
        { name: "language", type: "string", required: false, description: "Language code (auto-detected if not provided)" },
      ],
      response: `{
  "emotions": {
    "joy": 0.15,
    "fear": 0.45,
    "anger": 0.20,
    "sadness": 0.10,
    "hope": 0.05,
    "curiosity": 0.05
  },
  "dominantEmotion": "fear",
  "confidence": 0.89,
  "dcftContribution": 0.70,
  "aiContribution": 0.30
}`,
      example: `curl -X POST "${API_BASE_URL}/analyze/text" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "الأوضاع الاقتصادية تثير قلق المواطنين"}'`,
    },
    {
      method: "POST",
      path: "/analyze/topic",
      description: "Analyze public sentiment on a specific topic in a country",
      parameters: [
        { name: "topic", type: "string", required: true, description: "Topic to analyze" },
        { name: "countryCode", type: "string", required: true, description: "ISO 3166-1 alpha-2 country code" },
        { name: "timeRange", type: "string", required: false, description: "Time range: day, week, month (default: week)" },
      ],
      response: `{
  "topic": "الانتخابات",
  "country": "LY",
  "support": 45.2,
  "opposition": 32.8,
  "neutral": 22.0,
  "demographics": {
    "youth": { "support": 52.1, "opposition": 28.3 },
    "middleAge": { "support": 43.5, "opposition": 35.2 },
    "seniors": { "support": 38.9, "opposition": 38.1 }
  },
  "regions": [
    { "name": "طرابلس", "support": 48.2, "opposition": 30.1 },
    { "name": "بنغازي", "support": 42.8, "opposition": 35.6 }
  ]
}`,
      example: `curl -X POST "${API_BASE_URL}/analyze/topic" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "الانتخابات", "countryCode": "LY", "timeRange": "week"}'`,
    },
  ],
  trends: [
    {
      method: "GET",
      path: "/trends/daily",
      description: "Get daily emotion trend data",
      parameters: [
        { name: "days", type: "number", required: false, description: "Number of days (1-90, default: 30)" },
        { name: "countryCode", type: "string", required: false, description: "Filter by country code" },
      ],
      response: `{
  "trends": [
    {
      "date": "2026-01-30",
      "gmi": 44.5,
      "cfi": 61.2,
      "hri": 39.8
    },
    {
      "date": "2026-01-31",
      "gmi": 45.2,
      "cfi": 62.8,
      "hri": 38.5
    }
  ]
}`,
      example: `curl -X GET "${API_BASE_URL}/trends/daily?days=7" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
  ],
  alerts: [
    {
      method: "POST",
      path: "/alerts/create",
      description: "Create a custom alert for emotion threshold monitoring",
      parameters: [
        { name: "name", type: "string", required: true, description: "Alert name" },
        { name: "metric", type: "string", required: true, description: "Metric to monitor: gmi, cfi, hri" },
        { name: "condition", type: "string", required: true, description: "Condition: above, below, change" },
        { name: "threshold", type: "number", required: true, description: "Threshold value (0-100)" },
        { name: "countryCode", type: "string", required: false, description: "Country code (null for global)" },
        { name: "webhook", type: "string", required: false, description: "Webhook URL for notifications" },
      ],
      response: `{
  "id": 123,
  "name": "High Fear Alert",
  "metric": "cfi",
  "condition": "above",
  "threshold": 70,
  "countryCode": "LY",
  "active": true,
  "createdAt": "2026-01-31T12:00:00Z"
}`,
      example: `curl -X POST "${API_BASE_URL}/alerts/create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "High Fear Alert",
    "metric": "cfi",
    "condition": "above",
    "threshold": 70,
    "countryCode": "LY"
  }'`,
    },
  ],
};

const RATE_LIMITS = [
  { plan: "Free", requests: "100/day", burst: "10/min" },
  { plan: "Pro", requests: "1,000/day", burst: "60/min" },
  { plan: "Enterprise", requests: "10,000/day", burst: "300/min" },
  { plan: "Government", requests: "Unlimited", burst: "Custom" },
];

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("تم نسخ الكود");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const methodColors = {
    GET: "bg-green-500/10 text-green-500 border-green-500/20",
    POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={methodColors[endpoint.method]}>
            {endpoint.method}
          </Badge>
          <code className="text-sm font-mono">{endpoint.path}</code>
        </div>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {endpoint.parameters && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Parameters</h4>
            <div className="bg-muted/50 rounded-lg p-3">
              {endpoint.parameters.map((param) => (
                <div key={param.name} className="flex items-start gap-2 mb-2 last:mb-0">
                  <code className="text-xs bg-primary/10 px-1.5 py-0.5 rounded">{param.name}</code>
                  <span className="text-xs text-muted-foreground">({param.type})</span>
                  {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  <span className="text-sm">{param.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold mb-2">Response</h4>
          <CodeBlock code={endpoint.response} language="json" />
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Example</h4>
          <CodeBlock code={endpoint.example} language="bash" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Code className="h-3 w-3 ml-1" />
            API Documentation
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AmalSense API
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            دمج تحليل المشاعر الجماعية في تطبيقاتك باستخدام واجهة برمجة التطبيقات RESTful
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              البداية السريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">1</div>
                  <h4 className="font-semibold">احصل على مفتاح API</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  سجل للحصول على حساب واحصل على مفتاح API الخاص بك من لوحة التحكم
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">2</div>
                  <h4 className="font-semibold">أضف المفتاح للطلبات</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  أضف مفتاح API في header كـ Bearer token
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">3</div>
                  <h4 className="font-semibold">ابدأ الاستخدام</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  استخدم نقاط النهاية للحصول على بيانات المشاعر
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Base URL</h4>
              <CodeBlock code={API_BASE_URL} />
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Authentication</h4>
              <CodeBlock code={`curl -X GET "${API_BASE_URL}/indices/global" \\
  -H "Authorization: Bearer YOUR_API_KEY"`} />
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-500" />
              حدود الاستخدام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RATE_LIMITS.map((limit) => (
                <div key={limit.plan} className="p-4 rounded-lg bg-muted/50 text-center">
                  <h4 className="font-semibold mb-2">{limit.plan}</h4>
                  <p className="text-2xl font-bold text-primary">{limit.requests}</p>
                  <p className="text-xs text-muted-foreground">Burst: {limit.burst}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Tabs defaultValue="indices" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto mb-6">
            <TabsTrigger value="indices" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Indices</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="indices">
            <h2 className="text-xl font-bold mb-4">Emotion Indices</h2>
            <p className="text-muted-foreground mb-6">
              احصل على المؤشرات العاطفية الحالية (GMI, CFI, HRI) على المستوى العالمي أو لدولة محددة
            </p>
            {ENDPOINTS.indices.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </TabsContent>

          <TabsContent value="analysis">
            <h2 className="text-xl font-bold mb-4">Text & Topic Analysis</h2>
            <p className="text-muted-foreground mb-6">
              حلل النصوص والمواضيع باستخدام المحرك الهجين DCFT-AI
            </p>
            {ENDPOINTS.analysis.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </TabsContent>

          <TabsContent value="trends">
            <h2 className="text-xl font-bold mb-4">Historical Trends</h2>
            <p className="text-muted-foreground mb-6">
              احصل على البيانات التاريخية للمؤشرات العاطفية
            </p>
            {ENDPOINTS.trends.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </TabsContent>

          <TabsContent value="alerts">
            <h2 className="text-xl font-bold mb-4">Custom Alerts</h2>
            <p className="text-muted-foreground mb-6">
              أنشئ تنبيهات مخصصة لمراقبة المؤشرات العاطفية
            </p>
            {ENDPOINTS.alerts.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </TabsContent>
        </Tabs>

        {/* SDKs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-500" />
              SDKs & Libraries
            </CardTitle>
            <CardDescription>
              مكتبات جاهزة للاستخدام في لغات البرمجة المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Python</h4>
                <CodeBlock code="pip install amalsense" />
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">JavaScript/Node.js</h4>
                <CodeBlock code="npm install @amalsense/sdk" />
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">cURL</h4>
                <CodeBlock code="# No installation needed" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              SDKs قادمة قريباً - استخدم REST API مباشرة في الوقت الحالي
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
