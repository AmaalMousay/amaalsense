import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  AlertTriangle, 
  Check, 
  Loader2,
  Settings
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AlertSubscriptionProps {
  compact?: boolean;
}

export function AlertSubscription({ compact = false }: AlertSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    cfiCritical: true,
    cfiHigh: true,
    hriLow: true,
    gmiExtreme: false,
    dailyDigest: true,
  });

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubscribed(true);
    setIsLoading(false);
    alert("Successfully subscribed to alerts! You will receive notifications at " + email);
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribed(false);
    setEmail("");
    setIsLoading(false);
  };

  if (compact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            {isSubscribed ? "Subscribed" : "Get Alerts"}
            {isSubscribed && <Check className="w-3 h-3 text-green-400" />}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Email Alert Subscription
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Get notified when emotional indices cross critical thresholds.
            </DialogDescription>
          </DialogHeader>
          <AlertSubscriptionForm
            email={email}
            setEmail={setEmail}
            isSubscribed={isSubscribed}
            isLoading={isLoading}
            alertSettings={alertSettings}
            setAlertSettings={setAlertSettings}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          Email Alert Subscription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AlertSubscriptionForm
          email={email}
          setEmail={setEmail}
          isSubscribed={isSubscribed}
          isLoading={isLoading}
          alertSettings={alertSettings}
          setAlertSettings={setAlertSettings}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleUnsubscribe}
        />
      </CardContent>
    </Card>
  );
}

interface AlertSubscriptionFormProps {
  email: string;
  setEmail: (email: string) => void;
  isSubscribed: boolean;
  isLoading: boolean;
  alertSettings: {
    cfiCritical: boolean;
    cfiHigh: boolean;
    hriLow: boolean;
    gmiExtreme: boolean;
    dailyDigest: boolean;
  };
  setAlertSettings: (settings: any) => void;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

function AlertSubscriptionForm({
  email,
  setEmail,
  isSubscribed,
  isLoading,
  alertSettings,
  setAlertSettings,
  onSubscribe,
  onUnsubscribe,
}: AlertSubscriptionFormProps) {
  if (isSubscribed) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">Subscribed</span>
          </div>
          <p className="text-sm text-slate-400">
            Alerts will be sent to: <span className="text-white">{email}</span>
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Alert Settings
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-400">CFI Critical (&gt;70)</Label>
              <Switch
                checked={alertSettings.cfiCritical}
                onCheckedChange={(checked) =>
                  setAlertSettings({ ...alertSettings, cfiCritical: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-400">CFI High (&gt;60)</Label>
              <Switch
                checked={alertSettings.cfiHigh}
                onCheckedChange={(checked) =>
                  setAlertSettings({ ...alertSettings, cfiHigh: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-400">HRI Low (&lt;30)</Label>
              <Switch
                checked={alertSettings.hriLow}
                onCheckedChange={(checked) =>
                  setAlertSettings({ ...alertSettings, hriLow: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-400">GMI Extreme (&lt;-50 or &gt;50)</Label>
              <Switch
                checked={alertSettings.gmiExtreme}
                onCheckedChange={(checked) =>
                  setAlertSettings({ ...alertSettings, gmiExtreme: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm text-slate-400">Daily Digest</Label>
              <Switch
                checked={alertSettings.dailyDigest}
                onCheckedChange={(checked) =>
                  setAlertSettings({ ...alertSettings, dailyDigest: checked })
                }
              />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
          onClick={onUnsubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Unsubscribe
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Receive email notifications when emotional indices cross critical thresholds.
      </p>

      <div className="space-y-2">
        <Label htmlFor="alert-email" className="text-sm text-slate-300">
          Email Address
        </Label>
        <div className="flex gap-2">
          <Input
            id="alert-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/30 border-white/10 text-white placeholder:text-slate-500"
          />
          <Button
            onClick={onSubscribe}
            disabled={isLoading || !email}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
          <div className="text-xs text-slate-400">
            <p className="font-medium text-yellow-400 mb-1">Alert Types:</p>
            <ul className="space-y-0.5">
              <li>• CFI Critical: Fear index exceeds 70</li>
              <li>• HRI Low: Hope index drops below 30</li>
              <li>• Daily Digest: Summary of daily changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
