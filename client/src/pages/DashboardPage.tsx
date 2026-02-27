/**
 * لوحة المعلومات الشاملة
 * Comprehensive Dashboard
 * 
 * تتضمن:
 * - ملخص شامل للمؤشرات
 * - رسوم بيانية تفاعلية
 * - الاتجاهات والتنبيهات
 * - التوصيات الشخصية
 * - إدارة الاهتمامات
 */

import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard";
import { TrendChart } from "@/components/TrendChart";
import { ComparisonChart } from "@/components/ComparisonChart";
import { RefreshCw, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Heart,
  Globe,
  Bell,
  Settings,
  Plus,
  X,
  Eye,
  EyeOff,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
} from "lucide-react";

// ============================================================================
// MOCK DATA
// ============================================================================

const trendData = [
  { date: "الأحد", GMI: 65, CFI: 60, HRI: 70 },
  { date: "الاثنين", GMI: 68, CFI: 62, HRI: 72 },
  { date: "الثلاثاء", GMI: 70, CFI: 65, HRI: 74 },
  { date: "الأربعاء", GMI: 72, CFI: 68, HRI: 75 },
  { date: "الخميس", GMI: 71, CFI: 67, HRI: 76 },
  { date: "الجمعة", GMI: 73, CFI: 70, HRI: 77 },
  { date: "السبت", GMI: 72, CFI: 68, HRI: 75 },
];

const regionData = [
  { name: "الشرق الأوسط", value: 72, fill: "#ef4444" },
  { name: "آسيا", value: 68, fill: "#3b82f6" },
  { name: "أوروبا", value: 65, fill: "#8b5cf6" },
  { name: "الأمريكتان", value: 70, fill: "#10b981" },
  { name: "أفريقيا", value: 75, fill: "#f59e0b" },
];

// ============================================================================
// ALERT CARD COMPONENT
// ============================================================================

interface Alert {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  description: string;
  timestamp: string;
  actionLabel?: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "قلق متزايد في أوروبا",
    description: "مؤشرات تظهر زيادة بنسبة 8% في مستويات القلق",
    timestamp: "منذ 2 ساعة",
    actionLabel: "عرض التفاصيل",
  },
  {
    id: "2",
    type: "success",
    title: "تفاؤل متزايد عالمياً",
    description: "المؤشرات تظهر ارتفاعاً بنسبة 12% في مستويات التفاؤل",
    timestamp: "منذ 4 ساعات",
    actionLabel: "عرض التحليل",
  },
  {
    id: "3",
    type: "info",
    title: "اتجاهات جديدة في وسائل التواصل",
    description: "ظهور اتجاهات جديدة تركز على الصحة العقلية",
    timestamp: "منذ 6 ساعات",
    actionLabel: "استكشف",
  },
];

function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  const bgColor =
    alert.type === "warning"
      ? "bg-orange-500/10 border-orange-500/30"
      : alert.type === "success"
        ? "bg-green-500/10 border-green-500/30"
        : "bg-blue-500/10 border-blue-500/30";

  const icon =
    alert.type === "warning" ? (
      <AlertCircle className="h-5 w-5 text-orange-500" />
    ) : alert.type === "success" ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <Bell className="h-5 w-5 text-blue-500" />
    );

  return (
    <div className={`p-4 rounded-lg border ${bgColor} space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 flex-1">
          {icon}
          <div className="flex-1">
            <p className="font-semibold text-sm">{alert.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {alert.description}
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded transition"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
        {alert.actionLabel && (
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
            {alert.actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// INTERESTS MANAGEMENT
// ============================================================================

interface Interest {
  id: string;
  name: string;
  region: string;
  isActive: boolean;
  lastUpdate: string;
}

const defaultInterests: Interest[] = [
  {
    id: "1",
    name: "الذكاء الاصطناعي",
    region: "عالمي",
    isActive: true,
    lastUpdate: "منذ 2 ساعة",
  },
  {
    id: "2",
    name: "الاقتصاد العالمي",
    region: "الشرق الأوسط",
    isActive: true,
    lastUpdate: "منذ 4 ساعات",
  },
  {
    id: "3",
    name: "الصحة العقلية",
    region: "عالمي",
    isActive: false,
    lastUpdate: "منذ يوم",
  },
];

function InterestsSection() {
  const [interests, setInterests] = useState(defaultInterests);
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests(
      interests.map((interest) =>
        interest.id === id
          ? { ...interest, isActive: !interest.isActive }
          : interest
      )
    );
  };

  const removeInterest = (id: string) => {
    setInterests(interests.filter((interest) => interest.id !== id));
  };

  return (
    <Card className="border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          اهتماماتي
        </CardTitle>

        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Form */}
        {showAddForm && (
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-3">
            <input
              type="text"
              placeholder="أدخل الموضوع..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm"
            />

            <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm">
              <option>عالمي</option>
              <option>الشرق الأوسط</option>
              <option>آسيا</option>
              <option>أوروبا</option>
            </select>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                إضافة
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddForm(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Interests List */}
        <div className="space-y-2">
          {interests.map((interest) => (
            <div
              key={interest.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{interest.name}</p>
                <p className="text-xs text-muted-foreground">
                  {interest.region} • {interest.lastUpdate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleInterest(interest.id)}
                  className="p-2 hover:bg-slate-700/50 rounded transition"
                >
                  {interest.isActive ? (
                    <Eye className="h-4 w-4 text-purple-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                <button
                  onClick={() => removeInterest(interest.id)}
                  className="p-2 hover:bg-slate-700/50 rounded transition"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export default function DashboardPage() {
  const { user } = useAuth();
  const [visibleAlerts, setVisibleAlerts] = useState(alerts);

  const dismissAlert = (id: string) => {
    setVisibleAlerts(visibleAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                مرحباً، {user?.name || "المستخدم"}
              </h1>
              <p className="text-muted-foreground mt-2">
                إليك ملخص المؤشرات والاتجاهات الحالية
              </p>
            </div>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
            <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
            <TabsTrigger value="interests">الاهتمامات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      مؤشر المزاج العالمي
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-purple-400">72</p>
                      <Badge className="bg-green-500/20 text-green-700">
                        +5%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ارتفاع منذ أمس
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      مؤشر الشعور الجماعي
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-red-400">68</p>
                      <Badge className="bg-gray-500/20 text-gray-700">
                        0%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      مستقر منذ أمس
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      مؤشر حقوق الإنسان
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-blue-400">75</p>
                      <Badge className="bg-green-500/20 text-green-700">
                        +3%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ارتفاع منذ أمس
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle>تطور المؤشرات خلال الأسبوع</CardTitle>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="GMI"
                      stroke="#a855f7"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="CFI"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="HRI"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-slate-700/50">
                <CardHeader>
                  <CardTitle>توزيع المشاعر الإقليمي</CardTitle>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-slate-700/50">
                <CardHeader>
                  <CardTitle>أكثر الموضوعات اتجاهاً</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {[
                    {
                      topic: "الذكاء الاصطناعي",
                      trend: "up",
                      value: 45,
                    },
                    {
                      topic: "المشاعر العالمية",
                      trend: "up",
                      value: 38,
                    },
                    {
                      topic: "الاقتصاد العالمي",
                      trend: "down",
                      value: 28,
                    },
                    {
                      topic: "الصحة العقلية",
                      trend: "up",
                      value: 35,
                    },
                  ].map((item) => (
                    <div
                      key={item.topic}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                    >
                      <span className="text-sm font-semibold">
                        {item.topic}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-purple-400">
                          {item.value}
                        </span>
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <Card className="border-slate-700/50">
              <CardHeader>
                <CardTitle>تحليل الاتجاهات المفصل</CardTitle>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="GMI" fill="#a855f7" />
                    <Bar dataKey="CFI" fill="#ef4444" />
                    <Bar dataKey="HRI" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            {visibleAlerts.length > 0 ? (
              visibleAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={() => dismissAlert(alert.id)}
                />
              ))
            ) : (
              <Card className="border-slate-700/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد تنبيهات جديدة</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests">
            <InterestsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
