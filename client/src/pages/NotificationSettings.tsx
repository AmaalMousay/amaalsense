import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, Mail, Clock, AlertTriangle, 
  FileText, CheckCircle, ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

export default function NotificationSettings() {
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
            <p className="text-sm text-muted-foreground">Manage your email notifications</p>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
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
        <Card className="mb-6">
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

        {/* Info Card */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">What you'll receive:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Daily reports with GMI, CFI, and HRI indices
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Weekly digests comparing trends over time
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Real-time alerts when significant changes occur
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Unsubscribe anytime with one click
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
