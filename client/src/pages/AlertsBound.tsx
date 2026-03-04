/**
 * نظام التنبيهات المربوط - مع API حقيقي
 * Alerts System Bound - with Real API Integration
 */

import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Trash2,
  Plus,
  Filter,
  Loader2,
  Settings,
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  emotion: string;
  region: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
}

export default function AlertsBound() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [showHistory, setShowHistory] = useState(false);

  // Fetch active alerts
  const alertsQuery = trpc.alerts.getActiveAlerts.useQuery(
    { severity: severityFilter !== "all" ? (severityFilter as any) : undefined },
    { refetchInterval: 10000 } // Refresh every 10 seconds
  );

  // Fetch alert history
  const historyQuery = trpc.alerts.getAlertHistory.useQuery(
    { limit: 50 },
    { enabled: showHistory }
  );

  // Mark as read mutation
  const markAsReadMutation = trpc.alerts.markAsRead.useMutation();

  const alerts = alertsQuery.data?.alerts || [];
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  // Get severity color
  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      critical: "bg-red-500/20 text-red-300 border-red-500/50",
      high: "bg-orange-500/20 text-orange-300 border-orange-500/50",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      low: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    };
    return colors[severity] || colors.low;
  };

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    const icons: Record<string, React.ReactNode> = {
      critical: <AlertCircle className="h-5 w-5 text-red-500" />,
      high: <AlertCircle className="h-5 w-5 text-orange-500" />,
      medium: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      low: <AlertCircle className="h-5 w-5 text-blue-500" />,
    };
    return icons[severity] || icons.low;
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAsReadMutation.mutateAsync({ alertId });
      alertsQuery.refetch();
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8 text-purple-500" />
              نظام التنبيهات
            </h1>
            <p className="text-muted-foreground">
              إدارة وتتبع التنبيهات والإشعارات الهامة
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">التنبيهات غير المقروءة</div>
            <div className="text-3xl font-bold text-red-500">{unreadCount}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">الخطورة</label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="critical">حرج</SelectItem>
                <SelectItem value="high">عالي</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">منخفض</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700 self-end">
            <Plus className="h-4 w-4 mr-2" />
            تنبيه جديد
          </Button>

          <Button variant="outline" className="self-end">
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="self-end"
          >
            <Clock className="h-4 w-4 mr-2" />
            {showHistory ? "إخفاء" : "عرض"} السجل
          </Button>
        </div>

        {/* Active Alerts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">التنبيهات النشطة</h2>

          {alertsQuery.isPending ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${
                    alert.severity === "critical"
                      ? "border-l-red-500"
                      : alert.severity === "high"
                      ? "border-l-orange-500"
                      : alert.severity === "medium"
                      ? "border-l-yellow-500"
                      : "border-l-blue-500"
                  } ${!alert.isRead ? "bg-slate-800/80" : "bg-slate-800/40"}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                            {!alert.isRead && (
                              <Badge className="bg-red-500/20 text-red-300">جديد</Badge>
                            )}
                            {alert.actionRequired && (
                              <Badge className="bg-orange-500/20 text-orange-300">
                                يتطلب إجراء
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">
                            {alert.description}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <Badge variant="outline">{alert.emotion}</Badge>
                            <Badge variant="outline">{alert.region}</Badge>
                            <Badge
                              variant="outline"
                              className={getSeverityColor(alert.severity)}
                            >
                              {alert.severity === "critical"
                                ? "حرج"
                                : alert.severity === "high"
                                ? "عالي"
                                : alert.severity === "medium"
                                ? "متوسط"
                                : "منخفض"}
                            </Badge>
                            <span className="text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString("ar-SA")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {!alert.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(alert.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-slate-700/50">
              <CardContent className="pt-12 pb-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">لا توجد تنبيهات نشطة</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Alert History */}
        {showHistory && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">سجل التنبيهات</h2>

            {historyQuery.isPending ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : historyQuery.data?.history && historyQuery.data.history.length > 0 ? (
              <div className="space-y-2">
                {historyQuery.data.history.map((alert: any) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString("ar-SA")}
                      </p>
                    </div>
                    <Badge variant="outline">{alert.severity}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-slate-700/50">
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-muted-foreground">لا يوجد سجل تنبيهات</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
