/**
 * Enterprise Dashboard Page
 * Custom dashboard for enterprise/institutional users
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Building2,
  Globe,
  Plus,
  Trash2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Bell,
  Settings,
  Download,
  RefreshCw,
  Star,
  Eye,
  Lock
} from "lucide-react";

// Sample countries for watchlist
const COUNTRIES = [
  { code: "LY", name: "ليبيا", nameEn: "Libya" },
  { code: "EG", name: "مصر", nameEn: "Egypt" },
  { code: "SA", name: "السعودية", nameEn: "Saudi Arabia" },
  { code: "AE", name: "الإمارات", nameEn: "UAE" },
  { code: "US", name: "أمريكا", nameEn: "USA" },
  { code: "GB", name: "بريطانيا", nameEn: "UK" },
  { code: "FR", name: "فرنسا", nameEn: "France" },
  { code: "DE", name: "ألمانيا", nameEn: "Germany" },
];

interface WatchlistItem {
  id: string;
  type: "country" | "topic";
  value: string;
  name: string;
  addedAt: Date;
}

export default function EnterpriseDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { id: "1", type: "country", value: "LY", name: "ليبيا", addedAt: new Date() },
    { id: "2", type: "country", value: "EG", name: "مصر", addedAt: new Date() },
    { id: "3", type: "topic", value: "الانتخابات", name: "الانتخابات", addedAt: new Date() },
  ]);
  const [newCountry, setNewCountry] = useState("");
  const [newTopic, setNewTopic] = useState("");

  // Get global mood data
  const { data: globalMood, isLoading: moodLoading, refetch: refetchMood } = trpc.emotion.getLatestIndices.useQuery(
    undefined,
    { refetchInterval: 60000 }
  );

  // Add to watchlist
  const addCountryToWatchlist = () => {
    if (!newCountry) return;
    const country = COUNTRIES.find(c => c.code === newCountry);
    if (!country) return;
    
    if (watchlist.some(w => w.type === "country" && w.value === newCountry)) {
      toast.error("هذه الدولة موجودة بالفعل في القائمة");
      return;
    }

    setWatchlist([...watchlist, {
      id: Date.now().toString(),
      type: "country",
      value: newCountry,
      name: country.name,
      addedAt: new Date()
    }]);
    setNewCountry("");
    toast.success("تمت إضافة الدولة إلى قائمة المتابعة");
  };

  const addTopicToWatchlist = () => {
    if (!newTopic.trim()) return;
    
    if (watchlist.some(w => w.type === "topic" && w.value === newTopic)) {
      toast.error("هذا الموضوع موجود بالفعل في القائمة");
      return;
    }

    setWatchlist([...watchlist, {
      id: Date.now().toString(),
      type: "topic",
      value: newTopic,
      name: newTopic,
      addedAt: new Date()
    }]);
    setNewTopic("");
    toast.success("تمت إضافة الموضوع إلى قائمة المتابعة");
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(w => w.id !== id));
    toast.success("تمت الإزالة من قائمة المتابعة");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16">
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>لوحة تحكم المؤسسات</CardTitle>
              <CardDescription>
                يجب تسجيل الدخول للوصول إلى لوحة التحكم المخصصة
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href={getLoginUrl()}>تسجيل الدخول</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="outline" className="mb-2">
              <Building2 className="h-3 w-3 ml-1" />
              Enterprise Dashboard
            </Badge>
            <h1 className="text-2xl font-bold">لوحة تحكم المؤسسات</h1>
            <p className="text-muted-foreground">مرحباً، {user?.name || "مستخدم"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetchMood()}>
              <RefreshCw className="h-4 w-4 ml-1" />
              تحديث
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/alerts">
                <Bell className="h-4 w-4 ml-1" />
                التنبيهات
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المزاج العام</p>
                  <p className="text-2xl font-bold">{globalMood?.gmi?.toFixed(1) || "--"}</p>
                </div>
                <div className={`p-2 rounded-full ${(globalMood?.gmi || 0) >= 50 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {(globalMood?.gmi || 0) >= 50 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مؤشر الخوف</p>
                  <p className="text-2xl font-bold">{globalMood?.cfi?.toFixed(1) || "--"}</p>
                </div>
                <div className={`p-2 rounded-full ${(globalMood?.cfi || 0) <= 50 ? "bg-green-500/10" : "bg-orange-500/10"}`}>
                  <BarChart3 className={`h-5 w-5 ${(globalMood?.cfi || 0) <= 50 ? "text-green-500" : "text-orange-500"}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مؤشر الأمل</p>
                  <p className="text-2xl font-bold">{globalMood?.hri?.toFixed(1) || "--"}</p>
                </div>
                <div className={`p-2 rounded-full ${(globalMood?.hri || 0) >= 50 ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                  <Star className={`h-5 w-5 ${(globalMood?.hri || 0) >= 50 ? "text-green-500" : "text-yellow-500"}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">دول متابعة</p>
                  <p className="text-2xl font-bold">{watchlist.filter(w => w.type === "country").length}</p>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="watchlist" className="space-y-6">
          <TabsList>
            <TabsTrigger value="watchlist">
              <Eye className="h-4 w-4 ml-1" />
              قائمة المتابعة
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Download className="h-4 w-4 ml-1" />
              التقارير
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 ml-1" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Countries Watchlist */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    الدول المتابعة
                  </CardTitle>
                  <CardDescription>
                    أضف الدول التي تريد متابعة مؤشراتها العاطفية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={newCountry} onValueChange={setNewCountry}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="اختر دولة" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.nameEn})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addCountryToWatchlist}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {watchlist.filter(w => w.type === "country").map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{item.name}</span>
                          <Badge variant="outline" className="text-xs">{item.value}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/analyzer?country=${item.value}`}>
                              <BarChart3 className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWatchlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {watchlist.filter(w => w.type === "country").length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        لم تضف أي دول بعد
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Topics Watchlist */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    المواضيع المتابعة
                  </CardTitle>
                  <CardDescription>
                    أضف المواضيع التي تريد تتبع المشاعر تجاهها
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="أدخل موضوع للمتابعة"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTopicToWatchlist()}
                    />
                    <Button onClick={addTopicToWatchlist}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {watchlist.filter(w => w.type === "topic").map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/analyzer?topic=${encodeURIComponent(item.value)}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWatchlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {watchlist.filter(w => w.type === "topic").length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        لم تضف أي مواضيع بعد
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>التقارير المتاحة</CardTitle>
                <CardDescription>
                  قم بتحميل تقارير مفصلة عن المؤشرات العاطفية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Download className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <h4 className="font-semibold">تقرير يومي</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        ملخص المؤشرات لليوم الحالي
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/analyzer">
                          إنشاء تقرير
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Download className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <h4 className="font-semibold">تقرير أسبوعي</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        تحليل اتجاهات الأسبوع
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/trends">
                          عرض الاتجاهات
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Download className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <h4 className="font-semibold">تقرير مقارنة</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        مقارنة بين دولتين
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/compare">
                          مقارنة الدول
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات لوحة التحكم</CardTitle>
                <CardDescription>
                  خصص تجربتك في لوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>تردد التحديث التلقائي</Label>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">كل دقيقة</SelectItem>
                      <SelectItem value="5">كل 5 دقائق</SelectItem>
                      <SelectItem value="15">كل 15 دقيقة</SelectItem>
                      <SelectItem value="30">كل 30 دقيقة</SelectItem>
                      <SelectItem value="60">كل ساعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>لغة التقارير</Label>
                  <Select defaultValue="ar">
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button>حفظ الإعدادات</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
