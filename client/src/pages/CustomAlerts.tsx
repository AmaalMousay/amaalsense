/**
 * Custom Alerts Page
 * Allows users to create and manage custom alert conditions
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  Globe,
  TrendingUp,
  TrendingDown,
  Activity,
  Mail,
  MessageCircle,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

// Country list for selection
const COUNTRIES = [
  { code: "", name: " ( )" },
  { code: "LY", name: "" },
  { code: "EG", name: "" },
  { code: "SA", name: "" },
  { code: "AE", name: "" },
  { code: "US", name: "" },
  { code: "GB", name: "" },
  { code: "FR", name: "" },
  { code: "DE", name: "" },
  { code: "JP", name: "" },
  { code: "CN", name: "" },
  { code: "BR", name: "" },
  { code: "IN", name: "" },
  { code: "RU", name: "" },
  { code: "TR", name: "" },
];

const METRICS = [
  { value: "gmi", label: "   (GMI)", icon: <Activity className="h-4 w-4" /> },
  { value: "cfi", label: " Fear  (CFI)", icon: <AlertTriangle className="h-4 w-4" /> },
  { value: "hri", label: "   (HRI)", icon: <TrendingUp className="h-4 w-4" /> },
];

const CONDITIONS = [
  { value: "above", label: " ", icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
  { value: "below", label: " ", icon: <TrendingDown className="h-4 w-4 text-red-500" /> },
  { value: "change", label: " ", icon: <Activity className="h-4 w-4 text-yellow-500" /> },
];

const NOTIFY_METHODS = [
  { value: "email", label: " ", icon: <Mail className="h-4 w-4" /> },
  { value: "telegram", label: "", icon: <MessageCircle className="h-4 w-4" /> },
  { value: "both", label: "", icon: <Bell className="h-4 w-4" /> },
];

interface AlertFormData {
  name: string;
  countryCode: string;
  metric: "gmi" | "cfi" | "hri";
  condition: "above" | "below" | "change";
  threshold: number;
  notifyMethod: "email" | "telegram" | "both";
}

export default function CustomAlerts() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [formData, setFormData] = useState<AlertFormData>({
    name: "",
    countryCode: "",
    metric: "gmi",
    condition: "above",
    threshold: 70,
    notifyMethod: "email",
  });

  // Fetch user's alerts
  const alertsQuery = trpc.alerts.getUserAlerts.useQuery(undefined, {
    enabled: !!user,
  });

  // Mutations
  const createAlertMutation = trpc.alerts.createAlert.useMutation({
    onSuccess: () => {
      toast.success("   ");
      setIsDialogOpen(false);
      resetForm();
      alertsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "   ");
    },
  });

  const updateAlertMutation = trpc.alerts.updateAlert.useMutation({
    onSuccess: () => {
      toast.success("   ");
      setIsDialogOpen(false);
      setEditingAlert(null);
      resetForm();
      alertsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "   ");
    },
  });

  const deleteAlertMutation = trpc.alerts.deleteAlert.useMutation({
    onSuccess: () => {
      toast.success(" Delete ");
      alertsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "  Delete ");
    },
  });

  const toggleAlertMutation = trpc.alerts.toggleAlert.useMutation({
    onSuccess: () => {
      alertsQuery.refetch();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      countryCode: "",
      metric: "gmi",
      condition: "above",
      threshold: 70,
      notifyMethod: "email",
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("   ");
      return;
    }

    const countryName = COUNTRIES.find(c => c.code === formData.countryCode)?.name || "";

    if (editingAlert) {
      updateAlertMutation.mutate({
        id: editingAlert.id,
        ...formData,
        countryName,
      });
    } else {
      createAlertMutation.mutate({
        ...formData,
        countryName,
      });
    }
  };

  const handleEdit = (alert: any) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      countryCode: alert.countryCode || "",
      metric: alert.metric,
      condition: alert.condition,
      threshold: alert.threshold,
      notifyMethod: alert.notifyMethod,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("    Delete  ")) {
      deleteAlertMutation.mutate({ id });
    }
  };

  const getMetricLabel = (metric: string) => {
    return METRICS.find(m => m.value === metric)?.label || metric;
  };

  const getConditionLabel = (condition: string) => {
    return CONDITIONS.find(c => c.value === condition)?.label || condition;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 text-center">
          <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2"> </h1>
          <p className="text-muted-foreground mb-4">
                 
          </p>
          <Button onClick={() => window.location.href = "/api/oauth/login"}>
             
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary" />
               
            </h1>
            <p className="text-muted-foreground mt-1">
                   
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingAlert(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                 
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAlert ? "Edit " : "  "}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label> </Label>
                  <Input
                    placeholder="e.g., Alert for high fear in Libya"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label></Label>
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label></Label>
                  <Select
                    value={formData.metric}
                    onValueChange={(value) => setFormData({ ...formData, metric: value as "gmi" | "cfi" | "hri" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {METRICS.map((metric) => (
                        <SelectItem key={metric.value} value={metric.value}>
                          <div className="flex items-center gap-2">
                            {metric.icon}
                            {metric.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label></Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value as "above" | "below" | "change" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            <div className="flex items-center gap-2">
                              {condition.icon}
                              {condition.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label> {formData.condition === "change" ? "(%)" : ""}</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.threshold}
                      onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label> </Label>
                  <Select
                    value={formData.notifyMethod}
                    onValueChange={(value) => setFormData({ ...formData, notifyMethod: value as "email" | "telegram" | "both" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFY_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            {method.icon}
                            {method.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <p className="text-sm">
                      <strong>:</strong>     {" "}
                      <Badge variant="outline">{getMetricLabel(formData.metric)}</Badge>{" "}
                      {getConditionLabel(formData.condition)}{" "}
                      <Badge>{formData.threshold}{formData.condition === "change" ? "%" : ""}</Badge>{" "}
                      {formData.countryCode ? ` ${COUNTRIES.find(c => c.code === formData.countryCode)?.name}` : ""}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={createAlertMutation.isPending || updateAlertMutation.isPending}>
                  {editingAlert ? "" : ""}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alerts List */}
        {alertsQuery.isLoading ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-muted-foreground mt-4">  ...</p>
            </CardContent>
          </Card>
        ) : alertsQuery.data?.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">  </h3>
              <p className="text-muted-foreground mb-4">
                     
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                 
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle> ({alertsQuery.data?.length})</CardTitle>
              <CardDescription>
                     
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertsQuery.data?.map((alert: any) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          {alert.countryName || ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getMetricLabel(alert.metric)}</Badge>
                      </TableCell>
                      <TableCell>
                        {getConditionLabel(alert.condition)} {alert.threshold}
                        {alert.condition === "change" ? "%" : ""}
                      </TableCell>
                      <TableCell>
                        {NOTIFY_METHODS.find(m => m.value === alert.notifyMethod)?.icon}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={alert.isActive === 1}
                          onCheckedChange={(checked) => 
                            toggleAlertMutation.mutate({ id: alert.id, isActive: checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(alert)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                GMI -   
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                   .          .
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                CFI -  Fear 
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                  Fear  .       .
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                HRI -   
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                     .      .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
