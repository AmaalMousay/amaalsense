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
  { code: "", name: "عالمي (جميع الدول)" },
  { code: "LY", name: "ليبيا" },
  { code: "EG", name: "مصر" },
  { code: "SA", name: "السعودية" },
  { code: "AE", name: "الإمارات" },
  { code: "US", name: "أمريكا" },
  { code: "GB", name: "بريطانيا" },
  { code: "FR", name: "فرنسا" },
  { code: "DE", name: "ألمانيا" },
  { code: "JP", name: "اليابان" },
  { code: "CN", name: "الصين" },
  { code: "BR", name: "البرازيل" },
  { code: "IN", name: "الهند" },
  { code: "RU", name: "روسيا" },
  { code: "TR", name: "تركيا" },
];

const METRICS = [
  { value: "gmi", label: "مؤشر المزاج العام (GMI)", icon: <Activity className="h-4 w-4" /> },
  { value: "cfi", label: "مؤشر الخوف الجماعي (CFI)", icon: <AlertTriangle className="h-4 w-4" /> },
  { value: "hri", label: "مؤشر الأمل والمرونة (HRI)", icon: <TrendingUp className="h-4 w-4" /> },
];

const CONDITIONS = [
  { value: "above", label: "أعلى من", icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
  { value: "below", label: "أقل من", icon: <TrendingDown className="h-4 w-4 text-red-500" /> },
  { value: "change", label: "تغير بنسبة", icon: <Activity className="h-4 w-4 text-yellow-500" /> },
];

const NOTIFY_METHODS = [
  { value: "email", label: "بريد إلكتروني", icon: <Mail className="h-4 w-4" /> },
  { value: "telegram", label: "تيليجرام", icon: <MessageCircle className="h-4 w-4" /> },
  { value: "both", label: "كلاهما", icon: <Bell className="h-4 w-4" /> },
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
      toast.success("تم إنشاء التنبيه بنجاح");
      setIsDialogOpen(false);
      resetForm();
      alertsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إنشاء التنبيه");
    },
  });

  const updateAlertMutation = trpc.alerts.updateAlert.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث التنبيه بنجاح");
      setIsDialogOpen(false);
      setEditingAlert(null);
      resetForm();
      alertsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث التنبيه");
    },
  });

  const deleteAlertMutation = trpc.alerts.deleteAlert.useMutation({
    onSuccess: () => {
      toast.success("تم حذف التنبيه");
      alertsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف التنبيه");
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
      toast.error("يرجى إدخال اسم للتنبيه");
      return;
    }

    const countryName = COUNTRIES.find(c => c.code === formData.countryCode)?.name || "عالمي";

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
    if (confirm("هل أنت متأكد من حذف هذا التنبيه؟")) {
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
          <h1 className="text-2xl font-bold mb-2">التنبيهات المخصصة</h1>
          <p className="text-muted-foreground mb-4">
            يجب تسجيل الدخول لإنشاء تنبيهات مخصصة
          </p>
          <Button onClick={() => window.location.href = "/api/oauth/login"}>
            تسجيل الدخول
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
              التنبيهات المخصصة
            </h1>
            <p className="text-muted-foreground mt-1">
              أنشئ تنبيهات مخصصة لمراقبة المؤشرات العاطفية
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
                تنبيه جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAlert ? "تعديل التنبيه" : "إنشاء تنبيه جديد"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>اسم التنبيه</Label>
                  <Input
                    placeholder="مثال: تنبيه ارتفاع الخوف في ليبيا"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>الدولة</Label>
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدولة" />
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
                  <Label>المؤشر</Label>
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
                    <Label>الشرط</Label>
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
                    <Label>القيمة {formData.condition === "change" ? "(%)" : ""}</Label>
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
                  <Label>طريقة الإشعار</Label>
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
                      <strong>ملخص:</strong> سيتم إرسال تنبيه عندما يكون{" "}
                      <Badge variant="outline">{getMetricLabel(formData.metric)}</Badge>{" "}
                      {getConditionLabel(formData.condition)}{" "}
                      <Badge>{formData.threshold}{formData.condition === "change" ? "%" : ""}</Badge>{" "}
                      {formData.countryCode ? `في ${COUNTRIES.find(c => c.code === formData.countryCode)?.name}` : "عالمياً"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSubmit} disabled={createAlertMutation.isPending || updateAlertMutation.isPending}>
                  {editingAlert ? "تحديث" : "إنشاء"}
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
              <p className="text-muted-foreground mt-4">جاري تحميل التنبيهات...</p>
            </CardContent>
          </Card>
        ) : alertsQuery.data?.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد تنبيهات</h3>
              <p className="text-muted-foreground mb-4">
                أنشئ تنبيهك الأول لمراقبة المؤشرات العاطفية
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                إنشاء تنبيه
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>تنبيهاتك ({alertsQuery.data?.length})</CardTitle>
              <CardDescription>
                إدارة التنبيهات المخصصة لمراقبة المؤشرات العاطفية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الدولة</TableHead>
                    <TableHead>المؤشر</TableHead>
                    <TableHead>الشرط</TableHead>
                    <TableHead>الإشعار</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertsQuery.data?.map((alert: any) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          {alert.countryName || "عالمي"}
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
                GMI - مؤشر المزاج العام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                يقيس المزاج العام للمجتمع. قيمة عالية تعني مزاج إيجابي، وقيمة منخفضة تعني مزاج سلبي.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                CFI - مؤشر الخوف الجماعي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                يقيس مستوى الخوف والقلق الجماعي. قيمة عالية تشير إلى توتر وقلق مرتفع.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                HRI - مؤشر الأمل والمرونة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                يقيس مستوى الأمل والقدرة على التعافي. قيمة عالية تعني مجتمع متفائل ومرن.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
