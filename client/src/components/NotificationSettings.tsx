/**
 * NOTIFICATION SETTINGS COMPONENT
 * 
 * إعدادات الإشعارات والتنبيهات
 * - إدارة تفضيلات الإشعارات
 * - تعيين عتبات التنبيهات
 * - اختيار قنوات الإشعارات
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Smartphone, Volume2, Save } from 'lucide-react';

interface NotificationThreshold {
  gmi: number;
  cfi: number;
  hri: number;
  emotionShift: number;
  anomalyScore: number;
}

interface NotificationChannels {
  inApp: boolean;
  email: boolean;
  sms: boolean;
  sound: boolean;
  browser: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  thresholds: NotificationThreshold;
  channels: NotificationChannels;
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationSettingsProps {
  initialSettings?: Partial<NotificationSettings>;
  onSave?: (settings: NotificationSettings) => void;
}

export function NotificationSettings({
  initialSettings,
  onSave
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    thresholds: {
      gmi: 70,
      cfi: 65,
      hri: 60,
      emotionShift: 0.3,
      anomalyScore: 0.8
    },
    channels: {
      inApp: true,
      email: true,
      sms: false,
      sound: true,
      browser: true
    },
    frequency: 'instant',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    ...initialSettings
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleThresholdChange = (key: keyof NotificationThreshold, value: number) => {
    setSettings(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: value
      }
    }));
  };

  const handleChannelToggle = (key: keyof NotificationChannels) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [key]: !prev.channels[key]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        onSave(settings);
      }
      // Show success message
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-black">تفعيل الإشعارات</h3>
            <p className="text-sm text-gray-600 mt-1">
              تفعيل أو تعطيل جميع الإشعارات والتنبيهات
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) =>
              setSettings(prev => ({ ...prev, enabled: checked }))
            }
          />
        </div>
      </Card>

      {settings.enabled && (
        <>
          {/* Thresholds */}
          <Card className="p-6 border border-gray-200">
            <h3 className="font-semibold text-black mb-4">عتبات التنبيهات</h3>
            <div className="space-y-4">
              {/* GMI Threshold */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  مؤشر المشاعر العالمية (GMI)
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.thresholds.gmi}
                    onChange={(e) =>
                      handleThresholdChange('gmi', parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-black w-12">
                    {settings.thresholds.gmi}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  تنبيه عند تغيير GMI بأكثر من {settings.thresholds.gmi} نقطة
                </p>
              </div>

              {/* CFI Threshold */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  مؤشر الثقة الجماعية (CFI)
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.thresholds.cfi}
                    onChange={(e) =>
                      handleThresholdChange('cfi', parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-black w-12">
                    {settings.thresholds.cfi}
                  </span>
                </div>
              </div>

              {/* HRI Threshold */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  مؤشر الأمل والمرونة (HRI)
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.thresholds.hri}
                    onChange={(e) =>
                      handleThresholdChange('hri', parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-black w-12">
                    {settings.thresholds.hri}
                  </span>
                </div>
              </div>

              {/* Emotion Shift Threshold */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  حساسية تغيير العاطفة
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.thresholds.emotionShift}
                    onChange={(e) =>
                      handleThresholdChange('emotionShift', parseFloat(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-black w-12">
                    {settings.thresholds.emotionShift.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Anomaly Score Threshold */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  حساسية الشذوذ
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.thresholds.anomalyScore}
                    onChange={(e) =>
                      handleThresholdChange('anomalyScore', parseFloat(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-semibold text-black w-12">
                    {settings.thresholds.anomalyScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notification Channels */}
          <Card className="p-6 border border-gray-200">
            <h3 className="font-semibold text-black mb-4">قنوات الإشعارات</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">إشعارات داخل التطبيق</span>
                </div>
                <Switch
                  checked={settings.channels.inApp}
                  onCheckedChange={() => handleChannelToggle('inApp')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">البريد الإلكتروني</span>
                </div>
                <Switch
                  checked={settings.channels.email}
                  onCheckedChange={() => handleChannelToggle('email')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">رسائل نصية</span>
                </div>
                <Switch
                  checked={settings.channels.sms}
                  onCheckedChange={() => handleChannelToggle('sms')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">أصوات التنبيهات</span>
                </div>
                <Switch
                  checked={settings.channels.sound}
                  onCheckedChange={() => handleChannelToggle('sound')}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">إشعارات المتصفح</span>
                </div>
                <Switch
                  checked={settings.channels.browser}
                  onCheckedChange={() => handleChannelToggle('browser')}
                />
              </div>
            </div>
          </Card>

          {/* Frequency */}
          <Card className="p-6 border border-gray-200">
            <h3 className="font-semibold text-black mb-4">تكرار الإشعارات</h3>
            <div className="space-y-2">
              {(['instant', 'hourly', 'daily', 'weekly'] as const).map(freq => (
                <label key={freq} className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={settings.frequency === freq}
                    onChange={(e) =>
                      setSettings(prev => ({ ...prev, frequency: e.target.value as any }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    {freq === 'instant' && 'فوري'}
                    {freq === 'hourly' && 'كل ساعة'}
                    {freq === 'daily' && 'يومي'}
                    {freq === 'weekly' && 'أسبوعي'}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Quiet Hours */}
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-black">ساعات الهدوء</h3>
              <Switch
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: checked }
                  }))
                }
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">من</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">إلى</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  لن تتلقى إشعارات خلال ساعات الهدوء المحددة
                </p>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-black text-white hover:bg-gray-800"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>
    </div>
  );
}
