import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, Mail, Clock, AlertTriangle, 
  FileText, CheckCircle, ArrowLeft, Send, MessageCircle
} from "lucide-react";
import { Link } from "wouter";

export default function NotificationSettings() {
  // Email notifications state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "realtime">("daily");
  const [types, setTypes] = useState({
    report: true,
    alert: true,
    digest: false,
  });
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Telegram notifications state
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramCountry, setTelegramCountry] = useState("");
  const [telegramTopics, setTelegramTopics] = useState("");
  const [telegramAlertTypes, setTelegramAlertTypes] = useState({
    mood_change: true,
    fear_spike: true,
    hope_surge: true,
    daily_summary: true,
  });
  const [telegramSubscribed, setTelegramSubscribed] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramMessage, setTelegramMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email mutations
  const subscribeMutation = trpc.notifications.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setMessage({ type: "success", text: "Successfully subscribed to notifications!" });
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  const unsubscribeMutation = trpc.notifications.unsubscribe.useMutation({
    onSuccess: () => {
      setSubscribed(false);
      setMessage({ type: "success", text: "Successfully unsubscribed from notifications." });
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  // Telegram mutations
  const telegramSubscribeMutation = trpc.telegram.subscribe.useMutation({
    onSuccess: () => {
      setTelegramSubscribed(true);
      setTelegramMessage({ type: "success", text: "تم الاشتراك في إشعارات Telegram بنجاح!" });
    },
    onError: (error) => {
      setTelegramMessage({ type: "error", text: error.message });
    },
  });

  const telegramTestMutation = trpc.telegram.sendTestNotification.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setTelegramMessage({ type: "success", text: "تم إرسال رسالة تجريبية! تحقق من Telegram." });
      } else {
        setTelegramMessage({ type: "error", text: "فشل إرسال الرسالة. تحقق من Chat ID." });
      }
    },
    onError: (error) => {
      setTelegramMessage({ type: "error", text: error.message });
    },
  });

  const telegramDailySummaryMutation = trpc.telegram.sendDailySummary.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setTelegramMessage({ type: "success", text: "تم إرسال الملخص اليومي!" });
      } else {
        setTelegramMessage({ type: "error", text: "فشل إرسال الملخص." });
      }
    },
    onError: (error) => {
      setTelegramMessage({ type: "error", text: error.message });
    },
  });

  // Email handlers
  const handleSubscribe = async () => {
    if (!email || !name) {
      setMessage({ type: "error", text: "Please enter your name and email." });
      return;
    }

    const selectedTypes = Object.entries(types)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type as "report" | "alert" | "digest");

    if (selectedTypes.length === 0) {
      setMessage({ type: "error", text: "Please select at least one notification type." });
      return;
    }

    setLoading(true);
    await subscribeMutation.mutateAsync({
      email,
      name,
      frequency,
      types: selectedTypes,
    });
    setLoading(false);
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }

    setLoading(true);
    await unsubscribeMutation.mutateAsync({ email });
    setLoading(false);
  };

  const toggleType = (type: keyof typeof types) => {
    setTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Telegram handlers
  const handleTelegramSubscribe = async () => {
    if (!telegramChatId) {
      setTelegramMessage({ type: "error", text: "الرجاء إدخال Chat ID الخاص بك." });
      return;
    }

    const selectedAlertTypes = Object.entries(telegramAlertTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type as "mood_change" | "fear_spike" | "hope_surge" | "daily_summary");

    setTelegramLoading(true);
    await telegramSubscribeMutation.mutateAsync({
      chatId: telegramChatId,
      country: telegramCountry || undefined,
      topics: telegramTopics ? telegramTopics.split(",").map(t => t.trim()) : undefined,
      alertTypes: selectedAlertTypes.length > 0 ? selectedAlertTypes : undefined,
    });
    setTelegramLoading(false);
  };

  const handleTelegramTest = async () => {
    if (!telegramChatId) {
      setTelegramMessage({ type: "error", text: "الرجاء إدخال Chat ID الخاص بك." });
      return;
    }

    setTelegramLoading(true);
    await telegramTestMutation.mutateAsync({ chatId: telegramChatId });
    setTelegramLoading(false);
  };

  const handleTelegramDailySummary = async () => {
    if (!telegramChatId) {
      setTelegramMessage({ type: "error", text: "الرجاء إدخال Chat ID الخاص بك." });
      return;
    }

    setTelegramLoading(true);
    await telegramDailySummaryMutation.mutateAsync({ 
      chatId: telegramChatId,
      country: telegramCountry || undefined,
    });
    setTelegramLoading(false);
  };

  const toggleTelegramAlertType = (type: keyof typeof telegramAlertTypes) => {
    setTelegramAlertTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Notification Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your notifications</p>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        <Tabs defaultValue="telegram" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="telegram" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Telegram
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
          </TabsList>

          {/* Telegram Tab */}
          <TabsContent value="telegram" className="space-y-6">
            {/* Telegram Message */}
            {telegramMessage && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                telegramMessage.type === "success" 
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}>
                {telegramMessage.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                {telegramMessage.text}
              </div>
            )}

            {/* How to get Chat ID */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  كيفية الحصول على Chat ID
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>افتح Telegram وابحث عن <code className="bg-muted px-1 rounded">@userinfobot</code></li>
                  <li>أرسل أي رسالة للبوت</li>
                  <li>سيرسل لك الـ Chat ID الخاص بك</li>
                  <li>انسخ الرقم والصقه هنا</li>
                </ol>
              </CardContent>
            </Card>

            {/* Telegram Subscription Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-400" />
                  إشعارات Telegram
                </CardTitle>
                <CardDescription>
                  احصل على تنبيهات فورية عبر Telegram عند تغير المزاج العام
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chat ID */}
                <div className="space-y-2">
                  <Label htmlFor="chatId">Chat ID *</Label>
                  <Input
                    id="chatId"
                    placeholder="مثال: 123456789"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                  />
                </div>

                {/* Country Filter (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="country">رمز الدولة (اختياري)</Label>
                  <Input
                    id="country"
                    placeholder="مثال: LY للتركيز على ليبيا"
                    value={telegramCountry}
                    onChange={(e) => setTelegramCountry(e.target.value.toUpperCase())}
                    maxLength={2}
                  />
                </div>

                {/* Topics (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="topics">المواضيع (اختياري)</Label>
                  <Input
                    id="topics"
                    placeholder="مثال: أسعار الوقود, الانتخابات"
                    value={telegramTopics}
                    onChange={(e) => setTelegramTopics(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">افصل بين المواضيع بفاصلة</p>
                </div>

                {/* Alert Types */}
                <div className="space-y-3">
                  <Label>أنواع التنبيهات</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium">تغير المزاج</p>
                          <p className="text-sm text-muted-foreground">عند تغير GMI بشكل كبير</p>
                        </div>
                      </div>
                      <Switch
                        checked={telegramAlertTypes.mood_change}
                        onCheckedChange={() => toggleTelegramAlertType("mood_change")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="font-medium">ارتفاع الخوف</p>
                          <p className="text-sm text-muted-foreground">عند ارتفاع CFI فوق 70</p>
                        </div>
                      </div>
                      <Switch
                        checked={telegramAlertTypes.fear_spike}
                        onCheckedChange={() => toggleTelegramAlertType("fear_spike")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium">ارتفاع الأمل</p>
                          <p className="text-sm text-muted-foreground">عند ارتفاع HRI فوق 70</p>
                        </div>
                      </div>
                      <Switch
                        checked={telegramAlertTypes.hope_surge}
                        onCheckedChange={() => toggleTelegramAlertType("hope_surge")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="font-medium">الملخص اليومي</p>
                          <p className="text-sm text-muted-foreground">تقرير يومي بالمؤشرات</p>
                        </div>
                      </div>
                      <Switch
                        checked={telegramAlertTypes.daily_summary}
                        onCheckedChange={() => toggleTelegramAlertType("daily_summary")}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleTelegramSubscribe}
                      disabled={telegramLoading || telegramSubscribed}
                      className="flex-1"
                    >
                      {telegramLoading ? "جاري المعالجة..." : telegramSubscribed ? "تم الاشتراك ✓" : "اشتراك"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleTelegramTest}
                      disabled={telegramLoading || !telegramChatId}
                    >
                      إرسال تجريبي
                    </Button>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleTelegramDailySummary}
                    disabled={telegramLoading || !telegramChatId}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    إرسال الملخص اليومي الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-6">
            {/* Email Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success" 
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}>
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            )}

            {/* Subscription Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Receive daily reports, weekly digests, and real-time alerts about emotional trends.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div className="space-y-3">
                  <Label>Notification Frequency</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "daily", label: "Daily", icon: <Clock className="w-4 h-4" /> },
                      { value: "weekly", label: "Weekly", icon: <FileText className="w-4 h-4" /> },
                      { value: "realtime", label: "Real-time", icon: <AlertTriangle className="w-4 h-4" /> },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFrequency(option.value as typeof frequency)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          frequency === option.value
                            ? "border-purple-500 bg-purple-500/10 text-purple-400"
                            : "border-border hover:border-purple-500/50"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {option.icon}
                          <span className="text-sm">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-3">
                  <Label>Notification Types</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium">Reports</p>
                          <p className="text-sm text-muted-foreground">Daily/weekly summary of indices</p>
                        </div>
                      </div>
                      <Switch
                        checked={types.report}
                        onCheckedChange={() => toggleType("report")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="font-medium">Alerts</p>
                          <p className="text-sm text-muted-foreground">Notifications when indices cross thresholds</p>
                        </div>
                      </div>
                      <Switch
                        checked={types.alert}
                        onCheckedChange={() => toggleType("alert")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="font-medium">Digest</p>
                          <p className="text-sm text-muted-foreground">Comprehensive weekly analysis</p>
                        </div>
                      </div>
                      <Switch
                        checked={types.digest}
                        onCheckedChange={() => toggleType("digest")}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading || subscribed}
                    className="flex-1"
                  >
                    {loading ? "Processing..." : subscribed ? "Subscribed" : "Subscribe"}
                  </Button>
                  {subscribed && (
                    <Button
                      variant="outline"
                      onClick={handleUnsubscribe}
                      disabled={loading}
                    >
                      Unsubscribe
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="bg-muted/30 mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">ما ستحصل عليه:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                تقارير يومية بمؤشرات GMI و CFI و HRI
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                تنبيهات فورية عند تغير المزاج العام بشكل كبير
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                ملخصات أسبوعية لمقارنة الاتجاهات
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                إلغاء الاشتراك في أي وقت بنقرة واحدة
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
