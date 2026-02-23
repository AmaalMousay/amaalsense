/**
 * صفحة الإعدادات الشاملة
 * Comprehensive Settings Page
 * 
 * تتضمن:
 * - إدارة الحساب
 * - تفضيلات اللغة والمنطقة
 * - إعدادات الإشعارات
 * - خصوصية وأمان
 * - إدارة البيانات
 */

import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Bell,
  Lock,
  Globe,
  Trash2,
  LogOut,
  ChevronRight,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";

// ============================================================================
// ACCOUNT SETTINGS
// ============================================================================

interface AccountInfo {
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  lastLogin: string;
}

function AccountSettings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: user?.name || "المستخدم",
    email: user?.email || "user@example.com",
    phone: "+966501234567",
    joinDate: "2024-01-15",
    lastLogin: "منذ ساعة",
  });

  const [editedInfo, setEditedInfo] = useState(accountInfo);

  const handleSave = () => {
    setAccountInfo(editedInfo);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="border-slate-700/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            معلومات الحساب
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "إلغاء" : "تعديل"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold">الاسم</label>
                <input
                  type="text"
                  value={editedInfo.name}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={editedInfo.email}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">رقم الهاتف</label>
                <input
                  type="tel"
                  value={editedInfo.phone}
                  onChange={(e) =>
                    setEditedInfo({ ...editedInfo, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
              >
                <Save className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-xs text-muted-foreground">الاسم</p>
                  <p className="font-semibold">{accountInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-semibold">{accountInfo.email}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-700">
                  مؤكد
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                  <p className="font-semibold">{accountInfo.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-muted-foreground">تاريخ الانضمام</p>
                  <p className="font-semibold text-sm">{accountInfo.joinDate}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-muted-foreground">آخر دخول</p>
                  <p className="font-semibold text-sm">{accountInfo.lastLogin}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-red-500">منطقة الخطر</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج من جميع الأجهزة
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            حذف الحساب نهائياً
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const notificationPreferences: NotificationPreference[] = [
  {
    id: "1",
    title: "التنبيهات الفورية",
    description: "إشعارات حول التغييرات الكبيرة في المؤشرات",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "2",
    title: "التقارير اليومية",
    description: "ملخص يومي للمؤشرات والاتجاهات",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "3",
    title: "التقارير الأسبوعية",
    description: "تقرير شامل أسبوعي",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "4",
    title: "تنبيهات الاهتمامات",
    description: "إشعارات حول موضوعاتك المفضلة",
    email: true,
    push: true,
    sms: true,
  },
];

function NotificationSettings() {
  const [preferences, setPreferences] = useState(notificationPreferences);

  const togglePreference = (id: string, channel: "email" | "push" | "sms") => {
    setPreferences(
      preferences.map((pref) =>
        pref.id === id ? { ...pref, [channel]: !pref[channel] } : pref
      )
    );
  };

  return (
    <div className="space-y-4">
      {preferences.map((pref) => (
        <Card key={pref.id} className="border-slate-700/50">
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="font-semibold">{pref.title}</p>
              <p className="text-sm text-muted-foreground">{pref.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => togglePreference(pref.id, "email")}
                className={`p-3 rounded-lg border transition ${
                  pref.email
                    ? "border-purple-500/30 bg-purple-500/10"
                    : "border-slate-700/50 bg-slate-800/50"
                }`}
              >
                <Mail className={`h-5 w-5 mx-auto mb-2 ${pref.email ? "text-purple-500" : "text-muted-foreground"}`} />
                <p className="text-xs font-semibold">البريد</p>
              </button>

              <button
                onClick={() => togglePreference(pref.id, "push")}
                className={`p-3 rounded-lg border transition ${
                  pref.push
                    ? "border-purple-500/30 bg-purple-500/10"
                    : "border-slate-700/50 bg-slate-800/50"
                }`}
              >
                <Bell className={`h-5 w-5 mx-auto mb-2 ${pref.push ? "text-purple-500" : "text-muted-foreground"}`} />
                <p className="text-xs font-semibold">الإشعارات</p>
              </button>

              <button
                onClick={() => togglePreference(pref.id, "sms")}
                className={`p-3 rounded-lg border transition ${
                  pref.sms
                    ? "border-purple-500/30 bg-purple-500/10"
                    : "border-slate-700/50 bg-slate-800/50"
                }`}
              >
                <Smartphone className={`h-5 w-5 mx-auto mb-2 ${pref.sms ? "text-purple-500" : "text-muted-foreground"}`} />
                <p className="text-xs font-semibold">الرسائل</p>
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// PRIVACY & SECURITY
// ============================================================================

function PrivacySecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Password */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            كلمة المرور
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">كلمة المرور الحالية</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">كلمة المرور الجديدة</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
            تحديث كلمة المرور
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              المصادقة الثنائية
            </span>
            <Badge className="bg-orange-500/20 text-orange-700">
              غير مفعلة
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            أضف طبقة أمان إضافية لحسابك باستخدام تطبيق المصادقة
          </p>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
            تفعيل المصادقة الثنائية
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle>إعدادات الخصوصية</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {[
            {
              title: "جعل الملف الشخصي عاماً",
              description: "السماح للآخرين برؤية ملفك الشخصي",
            },
            {
              title: "السماح بالتوصيات الشخصية",
              description: "استخدام بيانات نشاطك لتحسين التوصيات",
            },
            {
              title: "مشاركة البيانات مع الشركاء",
              description: "السماح بمشاركة بيانات مجهولة الهوية",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
            >
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>

              <button className="p-2 hover:bg-slate-700/50 rounded transition">
                <div className="h-5 w-5 bg-slate-600 rounded-full" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// PREFERENCES SETTINGS
// ============================================================================

function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    language: "ar",
    region: "mena",
    theme: "dark",
    timezone: "Asia/Riyadh",
  });

  return (
    <div className="space-y-6">
      {/* Language */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            اللغة والمنطقة
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">اللغة</label>
            <select
              value={preferences.language}
              onChange={(e) =>
                setPreferences({ ...preferences, language: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">المنطقة</label>
            <select
              value={preferences.region}
              onChange={(e) =>
                setPreferences({ ...preferences, region: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
            >
              <option value="mena">الشرق الأوسط وشمال أفريقيا</option>
              <option value="asia">آسيا</option>
              <option value="europe">أوروبا</option>
              <option value="americas">الأمريكتان</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">المنطقة الزمنية</label>
            <select
              value={preferences.timezone}
              onChange={(e) =>
                setPreferences({ ...preferences, timezone: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
            >
              <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
            </select>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
            حفظ التفضيلات
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle>المظهر</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {[
            { value: "light", label: "فاتح" },
            { value: "dark", label: "داكن" },
            { value: "auto", label: "تلقائي" },
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() =>
                setPreferences({ ...preferences, theme: theme.value })
              }
              className={`w-full p-3 rounded-lg border transition text-left ${
                preferences.theme === theme.value
                  ? "border-purple-500/30 bg-purple-500/10"
                  : "border-slate-700/50 bg-slate-800/50"
              }`}
            >
              <p className="font-semibold">{theme.label}</p>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة حسابك والتفضيلات الشخصية
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="account">الحساب</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="privacy">الأمان</TabsTrigger>
            <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacySecuritySettings />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
