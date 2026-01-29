import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, Activity, Database, Shield, 
  Play, Pause, RefreshCw, Download,
  AlertTriangle, CheckCircle, Clock,
  BarChart3, Globe, Zap, Settings
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [schedulerRunning, setSchedulerRunning] = useState(false);

  // Check if user is admin
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration
  const stats = {
    totalUsers: 156,
    activeToday: 42,
    proUsers: 23,
    enterpriseUsers: 5,
    totalAnalyses: 12847,
    analysesToday: 234,
    apiCalls: 45678,
    apiCallsToday: 1234,
  };

  const recentUsers = [
    { id: 1, name: "Ahmed Ali", email: "ahmed@example.com", tier: "pro", joinedAt: "2025-01-28" },
    { id: 2, name: "Sara Mohamed", email: "sara@example.com", tier: "free", joinedAt: "2025-01-27" },
    { id: 3, name: "Omar Hassan", email: "omar@example.com", tier: "enterprise", joinedAt: "2025-01-26" },
    { id: 4, name: "Fatima Khalil", email: "fatima@example.com", tier: "pro", joinedAt: "2025-01-25" },
    { id: 5, name: "Youssef Nabil", email: "youssef@example.com", tier: "free", joinedAt: "2025-01-24" },
  ];

  const systemHealth = {
    database: { status: "healthy", latency: "12ms" },
    newsApi: { status: "healthy", remaining: "87/100" },
    youtubeApi: { status: "healthy", remaining: "9234/10000" },
    scheduler: { status: schedulerRunning ? "running" : "stopped", lastRun: "2 hours ago" },
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      free: "bg-gray-500/20 text-gray-400",
      pro: "bg-purple-500/20 text-purple-400",
      enterprise: "bg-cyan-500/20 text-cyan-400",
      government: "bg-green-500/20 text-green-400",
    };
    return colors[tier] || colors.free;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-2xl font-bold gradient-text cursor-pointer">AmalSense</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Back to Site
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-green-400">+{stats.activeToday} active today</p>
                </div>
                <Users className="w-10 h-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Analyses</p>
                  <p className="text-3xl font-bold">{stats.totalAnalyses.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+{stats.analysesToday} today</p>
                </div>
                <BarChart3 className="w-10 h-10 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Calls</p>
                  <p className="text-3xl font-bold">{stats.apiCalls.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+{stats.apiCallsToday} today</p>
                </div>
                <Globe className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pro Users</p>
                  <p className="text-3xl font-bold">{stats.proUsers + stats.enterpriseUsers}</p>
                  <p className="text-xs text-muted-foreground">{stats.proUsers} Pro, {stats.enterpriseUsers} Enterprise</p>
                </div>
                <Zap className="w-10 h-10 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Users
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tier</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-2">{u.name}</td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getTierBadge(u.tier)}`}>
                              {u.tier}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">{u.joinedAt}</td>
                          <td className="py-3 px-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemHealth).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {value.status === "healthy" || value.status === "running" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : value.status === "stopped" ? (
                        <Pause className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {(value as any).remaining || (value as any).latency || (value as any).lastRun || (value as any).status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scheduler Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Scheduler Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto Analysis</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={schedulerRunning ? "outline" : "default"}
                      onClick={() => setSchedulerRunning(true)}
                      disabled={schedulerRunning}
                    >
                      <Play className="w-4 h-4 mr-1" /> Start
                    </Button>
                    <Button 
                      size="sm" 
                      variant={!schedulerRunning ? "outline" : "destructive"}
                      onClick={() => setSchedulerRunning(false)}
                      disabled={!schedulerRunning}
                    >
                      <Pause className="w-4 h-4 mr-1" /> Stop
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" /> Run Analysis Now
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" /> Export User Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" /> Database Backup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" /> Security Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
