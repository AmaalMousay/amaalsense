/**
 * Comprehensive Settings Page
 * 
 // 
 */

import React, { useState } from "react";
import { trpc } from '@/lib/trpc';
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
    name: user?.name || "",
    email: user?.email || "user@example.com",
    phone: "+966501234567",
    joinDate: "2024-01-15",
    lastLogin: " ",
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
             
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold"></label>
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
                <label className="text-sm font-semibold"> </label>
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
                <label className="text-sm font-semibold"> </label>
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
                Save 
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-xs text-muted-foreground"></p>
                  <p className="font-semibold">{accountInfo.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-xs text-muted-foreground"> </p>
                  <p className="font-semibold">{accountInfo.email}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-700">
                  
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-xs text-muted-foreground"> </p>
                  <p className="font-semibold">{accountInfo.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-muted-foreground"> </p>
                  <p className="font-semibold text-sm">{accountInfo.joinDate}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-muted-foreground"> </p>
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
          <CardTitle className="text-red-500"> </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout   
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete  
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
    title: " ",
    description: "     ",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "2",
    title: "Reports ",
    description: "   ",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "3",
    title: "Reports ",
    description: "  ",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "4",
    title: " ",
    description: "   ",
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
                <p className="text-xs font-semibold"></p>
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
                <p className="text-xs font-semibold"></p>
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
                <p className="text-xs font-semibold"></p>
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
             
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">  </label>
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
            <label className="text-sm font-semibold">  </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
              
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
               
            </span>
            <Badge className="bg-orange-500/20 text-orange-700">
               
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
                   
          </p>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500">
              
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle> </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {[
            {
              title: "   ",
              description: "    ",
            },
            {
              title: "  ",
              description: "    ",
            },
            {
              title: "   ",
              description: "    ",
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
            Language Region
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Language</label>
            <select
              value={preferences.language}
              onChange={(e) =>
                setPreferences({ ...preferences, language: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
            >
              <option value="ar"></option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Region</label>
            <select
              value={preferences.region}
              onChange={(e) =>
                setPreferences({ ...preferences, region: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded"
            >
              <option value="mena">   </option>
              <option value="asia"></option>
              <option value="europe"></option>
              <option value="americas"></option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Region </label>
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
            Save 
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {[
            { value: "light", label: "" },
            { value: "dark", label: "" },
            { value: "auto", label: "" },
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
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
               
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="account"></TabsTrigger>
            <TabsTrigger value="notifications"></TabsTrigger>
            <TabsTrigger value="privacy"></TabsTrigger>
            <TabsTrigger value="preferences"></TabsTrigger>
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
