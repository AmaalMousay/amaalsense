import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, Activity, Database, Shield, 
  Play, Pause, RefreshCw, Download,
  AlertTriangle, CheckCircle, Clock,
  BarChart3, Globe, Zap, Settings,
  CreditCard, DollarSign, XCircle, Loader2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [schedulerRunning, setSchedulerRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users'>('overview');
  const [confirmingPayment, setConfirmingPayment] = useState<number | null>(null);
  const [rejectingPayment, setRejectingPayment] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  // Fetch payments data
  const { data: allPayments, refetch: refetchPayments } = trpc.payments.getAllPayments.useQuery();
  const { data: pendingPayments } = trpc.payments.getPendingPayments.useQuery();

  const confirmPaymentMutation = trpc.payments.confirmPayment.useMutation({
    onSuccess: () => {
      toast.success("Payment confirmed successfully!");
      refetchPayments();
      setConfirmingPayment(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to confirm payment");
    },
  });

  const rejectPaymentMutation = trpc.payments.rejectPayment.useMutation({
    onSuccess: () => {
      toast.success("Payment rejected");
      refetchPayments();
      setRejectingPayment(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject payment");
    },
  });

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
    pendingPayments: pendingPayments?.length || 0,
    totalRevenue: allPayments?.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + p.amount, 0) || 0,
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

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-400",
      confirmed: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
      refunded: "bg-gray-500/20 text-gray-400",
    };
    return colors[status] || colors.pending;
  };

  const getMethodName = (method: string) => {
    const names: Record<string, string> = {
      paypal: "PayPal",
      bank_transfer: "Bank Transfer",
      western_union: "Western Union",
      moneygram: "MoneyGram",
      crypto: "Crypto (USDT)",
    };
    return names[method] || method;
  };

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      pro: "Professional",
      enterprise: "Enterprise",
      government: "Government & NGO",
    };
    return names[plan] || plan;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-2xl font-bold gradient-text cursor-pointer">Amaalsense</span>
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

      {/* Tabs */}
      <div className="border-b border-border/50">
        <div className="container">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'overview' 
                  ? 'border-purple-500 text-purple-500' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'payments' 
                  ? 'border-purple-500 text-purple-500' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Payments
              {stats.pendingPayments > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingPayments}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'users' 
                  ? 'border-purple-500 text-purple-500' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>

      <main className="container py-8">
        {activeTab === 'overview' && (
          <>
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
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold">${stats.totalRevenue}</p>
                      <p className="text-xs text-yellow-400">{stats.pendingPayments} pending</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-green-400" />
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

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('payments')}
                    >
                      <CreditCard className="w-4 h-4 mr-2" /> Manage Payments
                      {stats.pendingPayments > 0 && (
                        <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {stats.pendingPayments}
                        </span>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" /> Export User Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" /> Database Backup
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Payments */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Recent Payments
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('payments')}>
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {allPayments && allPayments.length > 0 ? (
                      <div className="space-y-3">
                        {allPayments.slice(0, 5).map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">{payment.name}</p>
                              <p className="text-sm text-muted-foreground">{payment.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${payment.amount}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(payment.status)}`}>
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No payments yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Pending Payments */}
            {pendingPayments && pendingPayments.length > 0 && (
              <Card className="border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-500">
                    <AlertTriangle className="w-5 h-5" />
                    Pending Payments ({pendingPayments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold">{payment.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(payment.status)}`}>
                                {payment.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{payment.email}</p>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Plan:</span>{" "}
                                <span className="font-medium">{getPlanName(payment.plan)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Amount:</span>{" "}
                                <span className="font-bold text-green-400">${payment.amount}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Method:</span>{" "}
                                <span className="font-medium">{getMethodName(payment.paymentMethod)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Date:</span>{" "}
                                <span className="font-medium">
                                  {new Date(payment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {payment.transactionRef && (
                              <p className="mt-2 text-sm">
                                <span className="text-muted-foreground">Ref:</span>{" "}
                                <code className="bg-muted px-2 py-0.5 rounded">{payment.transactionRef}</code>
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {confirmingPayment === payment.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Admin notes (optional)"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  className="min-w-[200px]"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => confirmPaymentMutation.mutate({ 
                                      paymentId: payment.id, 
                                      adminNotes 
                                    })}
                                    disabled={confirmPaymentMutation.isPending}
                                  >
                                    {confirmPaymentMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      "Confirm"
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setConfirmingPayment(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : rejectingPayment === payment.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Reason for rejection (required)"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  className="min-w-[200px]"
                                  required
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectPaymentMutation.mutate({ 
                                      paymentId: payment.id, 
                                      adminNotes 
                                    })}
                                    disabled={!adminNotes || rejectPaymentMutation.isPending}
                                  >
                                    {rejectPaymentMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      "Reject"
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setRejectingPayment(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => setConfirmingPayment(payment.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setRejectingPayment(payment.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allPayments && allPayments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plan</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Method</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allPayments.map((payment) => (
                          <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-2">
                              <div>
                                <p className="font-medium">{payment.name}</p>
                                <p className="text-xs text-muted-foreground">{payment.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getTierBadge(payment.plan)}`}>
                                {getPlanName(payment.plan)}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-bold">${payment.amount}</td>
                            <td className="py-3 px-2 text-sm">{getMethodName(payment.paymentMethod)}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(payment.status)}`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No payments yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <Button variant="outline" size="sm">
                Export Users
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
        )}
      </main>
    </div>
  );
}
