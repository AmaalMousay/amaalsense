/**
 * Comprehensive Notifications Page
 * 
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from '@/lib/trpc';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  AlertCircle,
  TrendingUp,
  MapPin,
  Zap,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface Notification {
  id: string;
  type: "indicator_change" | "emotion_shift" | "anomaly" | "trending" | "impact";
  title: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "indicator_change",
    title: "  Emotions ",
    message: "  Emotions   65.2  72.8 ( 7.6 )",
    severity: "high",
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
    data: { oldGMI: 65.2, newGMI: 72.8 },
  },
  {
    id: "2",
    type: "emotion_shift",
    title: "  ",
    message: '    "Sadness"  ""  87%',
    severity: "medium",
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    read: false,
    data: { oldEmotion: "sadness", newEmotion: "hope", confidence: 0.87 },
  },
  {
    id: "3",
    type: "anomaly",
    title: "    ",
    message: "       Emotions    ",
    severity: "high",
    timestamp: new Date(Date.now() - 4 * 60 * 60000),
    read: true,
    data: { region: "MENA", anomalyScore: 0.92 },
  },
  {
    id: "4",
    type: "trending",
    title: "   ",
    message: ' " "      89%',
    severity: "medium",
    timestamp: new Date(Date.now() - 6 * 60 * 60000),
    read: true,
    data: { topic: "climate_change", regions: ["Asia"], trendScore: 0.89 },
  },
  {
    id: "5",
    type: "impact",
    title: "    ",
    message: '   " "   92%',
    severity: "critical",
    timestamp: new Date(Date.now() - 8 * 60 * 60000),
    read: false,
    data: { topic: "economic_crisis", impactScore: 0.92 },
  },
  {
    id: "6",
    type: "indicator_change",
    title: "  Confidence ",
    message: "  Confidence   58.3  51.7 ( 6.6 )",
    severity: "high",
    timestamp: new Date(Date.now() - 12 * 60 * 60000),
    read: true,
    data: { oldCFI: 58.3, newCFI: 51.7 },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getIconForType(type: Notification["type"]) {
  switch (type) {
    case "indicator_change":
      return <TrendingUp className="h-5 w-5" />;
    case "emotion_shift":
      return <Zap className="h-5 w-5" />;
    case "anomaly":
      return <AlertCircle className="h-5 w-5" />;
    case "trending":
      return <TrendingUp className="h-5 w-5" />;
    case "impact":
      return <AlertCircle className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
}

function getSeverityColor(severity: Notification["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-red-500/20 text-red-700 border-red-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-700 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "low":
      return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    default:
      return "bg-slate-500/20 text-slate-700 border-slate-500/30";
  }
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return ` ${minutes} `;
  if (hours < 24) return ` ${hours} `;
  if (days < 7) return ` ${days} `;
  return date.toLocaleDateString("ar-SA");
}

// ============================================================================
// NOTIFICATION CARD
// ============================================================================

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  return (
    <Card
      className={`border-l-4 transition ${
        notification.read
          ? "border-slate-700/50 bg-slate-800/30"
          : getSeverityColor(notification.severity)
      }`}
    >
      <CardContent className="pt-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">{getIconForType(notification.type)}</div>

          <div className="flex-1">
            <p className="font-semibold">{notification.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Badge className={getSeverityColor(notification.severity)}>
                {notification.severity === "critical"
                  ? ""
                  : notification.severity === "high"
                  ? ""
                  : notification.severity === "medium"
                  ? ""
                  : ""}
              </Badge>

              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(notification.timestamp)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="hover:bg-slate-700/50"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            className="hover:bg-red-500/20 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType !== "all" && n.type !== filterType) return false;
    if (filterSeverity !== "all" && n.severity !== filterSeverity) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bell className="h-8 w-8" />
                
              </h1>
              <p className="text-muted-foreground mt-2">
                {unreadCount}     {notifications.length} 
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                    
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="border-slate-700/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold"> </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
                >
                  <option value="all"></option>
                  <option value="indicator_change"> </option>
                  <option value="emotion_shift"> </option>
                  <option value="anomaly"></option>
                  <option value="trending">Topic </option>
                  <option value="impact">Impact </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold"> </label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
                >
                  <option value="all"></option>
                  <option value="critical"></option>
                  <option value="high"></option>
                  <option value="medium"></option>
                  <option value="low"></option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Card className="border-slate-700/50">
              <CardContent className="pt-12 pb-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">  </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm"> </p>
                <p className="text-3xl font-bold mt-2">{notifications.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm"> </p>
                <p className="text-3xl font-bold mt-2 text-red-500">
                  {unreadCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm"></p>
                <p className="text-3xl font-bold mt-2 text-red-600">
                  {notifications.filter((n) => n.severity === "critical").length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm"></p>
                <p className="text-3xl font-bold mt-2">
                  {
                    notifications.filter(
                      (n) =>
                        new Date().getTime() - n.timestamp.getTime() <
                        24 * 60 * 60 * 1000
                    ).length
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
