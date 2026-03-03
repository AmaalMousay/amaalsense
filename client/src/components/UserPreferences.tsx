/**
 * USER PREFERENCES COMPONENT
 * 
 * تفضيلات المستخدم
 * - إدارة الإعدادات الشخصية
 * - تخصيص التنبيهات والإشعارات
 * - إدارة الخصوصية والأمان
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Lock, Eye, Globe, Palette, Volume2, Mail, MessageSquare, Save, RotateCcw } from 'lucide-react';

interface UserPreferencesData {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    soundEnabled: boolean;
    quietHours: { start: string; end: string };
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showActivity: boolean;
    allowMessages: boolean;
    shareData: boolean;
  };
  content: {
    preferredRegions: string[];
    preferredCategories: string[];
    excludedTopics: string[];
    emotionFilters: string[];
  };
  analysis: {
    autoAnalysis: boolean;
    detailedReports: boolean;
    predictiveAnalytics: boolean;
    compareMode: boolean;
  };
}

interface UserPreferencesProps {
  userId?: string;
  onSave?: (preferences: UserPreferencesData) => void;
}

export function UserPreferences({
  userId,
  onSave
}: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<UserPreferencesData>({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      soundEnabled: true,
      quietHours: { start: '22:00', end: '08:00' }
    },
    display: {
      theme: 'light',
      language: 'ar',
      fontSize: 'medium',
      compactMode: false
    },
    privacy: {
      profileVisibility: 'private',
      showActivity: false,
      allowMessages: true,
      shareData: false
    },
    content: {
      preferredRegions: ['السعودية', 'الإمارات'],
      preferredCategories: ['اقتصاد', 'تكنولوجيا'],
      excludedTopics: [],
      emotionFilters: []
    },
    analysis: {
      autoAnalysis: true,
      detailedReports: true,
      predictiveAnalytics: false,
      compareMode: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (path: string) => {
    const keys = path.split('.');
    const newPrefs = JSON.parse(JSON.stringify(preferences));
    let obj = newPrefs;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = !obj[keys[keys.length - 1]];
    setPreferences(newPrefs);
    setHasChanges(true);
  };

  const handleSelectChange = (path: string, value: string) => {
    const keys = path.split('.');
    const newPrefs = JSON.parse(JSON.stringify(preferences));
    let obj = newPrefs;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setPreferences(newPrefs);
    setHasChanges(true);
  };

  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    const newPrefs = JSON.parse(JSON.stringify(preferences));
    newPrefs.notifications.quietHours[field] = value;
    setPreferences(newPrefs);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(preferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">تفضيلات المستخدم</h2>
          <p className="text-sm text-gray-600 mt-1">
            خصص تجربتك وأدر إعداداتك الشخصية
          </p>
        </div>
      </div>

      {/* Notifications Section */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-black" />
          <h3 className="text-lg font-semibold text-black">الإشعارات والتنبيهات</h3>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600" />
              <div>
                <p className="font-medium text-black">إشعارات البريد الإلكتروني</p>
                <p className="text-xs text-gray-600">استقبل التحديثات عبر البريد الإلكتروني</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications.emailNotifications')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.notifications.emailNotifications
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.notifications.emailNotifications ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-600" />
              <div>
                <p className="font-medium text-black">إشعارات المتصفح</p>
                <p className="text-xs text-gray-600">استقبل إشعارات فورية على جهازك</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications.pushNotifications')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.notifications.pushNotifications
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.notifications.pushNotifications ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <div>
                <p className="font-medium text-black">إشعارات الرسائل القصيرة</p>
                <p className="text-xs text-gray-600">استقبل تنبيهات عاجلة عبر الرسائل النصية</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications.smsNotifications')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.notifications.smsNotifications
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.notifications.smsNotifications ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <div>
                <p className="font-medium text-black">تفعيل الصوت</p>
                <p className="text-xs text-gray-600">تشغيل أصوات التنبيهات</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications.soundEnabled')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.notifications.soundEnabled
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.notifications.soundEnabled ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Quiet Hours */}
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-medium text-black mb-2">ساعات الهدوء</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">من</label>
                <input
                  type="time"
                  value={preferences.notifications.quietHours.start}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">إلى</label>
                <input
                  type="time"
                  value={preferences.notifications.quietHours.end}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Display Section */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-black" />
          <h3 className="text-lg font-semibold text-black">العرض والمظهر</h3>
        </div>

        <div className="space-y-4">
          {/* Theme */}
          <div className="p-3 bg-gray-50 rounded">
            <label className="font-medium text-black mb-2 block">المظهر</label>
            <select
              value={preferences.display.theme}
              onChange={(e) => handleSelectChange('display.theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
              <option value="auto">تلقائي</option>
            </select>
          </div>

          {/* Language */}
          <div className="p-3 bg-gray-50 rounded">
            <label className="font-medium text-black mb-2 block">اللغة</label>
            <select
              value={preferences.display.language}
              onChange={(e) => handleSelectChange('display.language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="p-3 bg-gray-50 rounded">
            <label className="font-medium text-black mb-2 block">حجم الخط</label>
            <select
              value={preferences.display.fontSize}
              onChange={(e) => handleSelectChange('display.fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
            </select>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">الوضع المضغوط</p>
              <p className="text-xs text-gray-600">عرض مختصر للمحتوى</p>
            </div>
            <button
              onClick={() => handleToggle('display.compactMode')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.display.compactMode
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.display.compactMode ? 'مفعّل' : 'معطّل'}
            </button>
          </div>
        </div>
      </Card>

      {/* Privacy Section */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-black" />
          <h3 className="text-lg font-semibold text-black">الخصوصية والأمان</h3>
        </div>

        <div className="space-y-4">
          {/* Profile Visibility */}
          <div className="p-3 bg-gray-50 rounded">
            <label className="font-medium text-black mb-2 block">ظهور الملف الشخصي</label>
            <select
              value={preferences.privacy.profileVisibility}
              onChange={(e) => handleSelectChange('privacy.profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="public">عام</option>
              <option value="friends">الأصدقاء فقط</option>
              <option value="private">خاص</option>
            </select>
          </div>

          {/* Show Activity */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">عرض النشاط</p>
              <p className="text-xs text-gray-600">السماح للآخرين برؤية نشاطك</p>
            </div>
            <button
              onClick={() => handleToggle('privacy.showActivity')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.privacy.showActivity
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.privacy.showActivity ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Allow Messages */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">السماح بالرسائل</p>
              <p className="text-xs text-gray-600">السماح للآخرين بإرسال رسائل لك</p>
            </div>
            <button
              onClick={() => handleToggle('privacy.allowMessages')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.privacy.allowMessages
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.privacy.allowMessages ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Share Data */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">مشاركة البيانات</p>
              <p className="text-xs text-gray-600">السماح بمشاركة بيانات الاستخدام</p>
            </div>
            <button
              onClick={() => handleToggle('privacy.shareData')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.privacy.shareData
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.privacy.shareData ? 'مفعّل' : 'معطّل'}
            </button>
          </div>
        </div>
      </Card>

      {/* Analysis Section */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-black" />
          <h3 className="text-lg font-semibold text-black">إعدادات التحليل</h3>
        </div>

        <div className="space-y-4">
          {/* Auto Analysis */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">التحليل التلقائي</p>
              <p className="text-xs text-gray-600">تحليل تلقائي للبيانات الجديدة</p>
            </div>
            <button
              onClick={() => handleToggle('analysis.autoAnalysis')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.analysis.autoAnalysis
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.analysis.autoAnalysis ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Detailed Reports */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">التقارير المفصلة</p>
              <p className="text-xs text-gray-600">عرض تقارير مفصلة وشاملة</p>
            </div>
            <button
              onClick={() => handleToggle('analysis.detailedReports')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.analysis.detailedReports
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.analysis.detailedReports ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Predictive Analytics */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">التحليلات التنبؤية</p>
              <p className="text-xs text-gray-600">عرض التنبؤات والاتجاهات المستقبلية</p>
            </div>
            <button
              onClick={() => handleToggle('analysis.predictiveAnalytics')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.analysis.predictiveAnalytics
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.analysis.predictiveAnalytics ? 'مفعّل' : 'معطّل'}
            </button>
          </div>

          {/* Compare Mode */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium text-black">وضع المقارنة</p>
              <p className="text-xs text-gray-600">مقارنة البيانات والسيناريوهات</p>
            </div>
            <button
              onClick={() => handleToggle('analysis.compareMode')}
              className={`px-4 py-2 rounded font-medium transition ${
                preferences.analysis.compareMode
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {preferences.analysis.compareMode ? 'مفعّل' : 'معطّل'}
            </button>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          onClick={handleReset}
          variant="outline"
          className="gap-2 border-gray-300 text-black hover:bg-gray-100"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة تعيين
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`gap-2 ${
            hasChanges
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          حفظ التغييرات
        </Button>
      </div>

      {/* Info Message */}
      {hasChanges && (
        <Card className="p-4 border border-gray-200 bg-blue-50">
          <p className="text-sm text-gray-700">
            ⚠️ لديك تغييرات غير محفوظة. اضغط على "حفظ التغييرات" لتطبيقها.
          </p>
        </Card>
      )}
    </div>
  );
}
