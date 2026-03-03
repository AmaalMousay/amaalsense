/**
 * EXTERNAL INTEGRATION COMPONENT
 * 
 * التكامل مع المنصات الخارجية
 * - Telegram
 * - Slack
 * - Discord
 * - Webhooks
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, AlertCircle, Settings, Trash2, Plus, Link2, Send } from 'lucide-react';

interface Integration {
  id: string;
  platform: 'telegram' | 'slack' | 'discord' | 'webhook';
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedDate?: Date;
  lastUsed?: Date;
  config: {
    token?: string;
    webhookUrl?: string;
    channelId?: string;
  };
}

interface ExternalIntegrationProps {
  userId?: string;
  onIntegrationChange?: (integration: Integration) => void;
}

export function ExternalIntegration({
  userId,
  onIntegrationChange
}: ExternalIntegrationProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'tg-1',
      platform: 'telegram',
      name: 'قناة Telegram',
      status: 'connected',
      connectedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      config: {
        token: 'bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
        channelId: '-1001234567890'
      }
    },
    {
      id: 'slack-1',
      platform: 'slack',
      name: 'Slack Workspace',
      status: 'disconnected',
      config: {
        token: 'xoxb-1234567890-1234567890-XXXXXXXXXXXX'
      }
    }
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'telegram' | 'slack' | 'discord' | 'webhook'>('telegram');

  const platformInfo = {
    telegram: {
      name: 'Telegram',
      icon: '📱',
      description: 'استقبل التنبيهات والتقارير على Telegram',
      setupSteps: [
        'أنشئ bot جديد عبر @BotFather على Telegram',
        'انسخ token البوت',
        'الصق الـ token أدناه',
        'ابدأ المحادثة مع البوت'
      ]
    },
    slack: {
      name: 'Slack',
      icon: '💼',
      description: 'أرسل الإشعارات إلى قنوات Slack',
      setupSteps: [
        'انتقل إلى إعدادات Slack Workspace',
        'أنشئ Incoming Webhook',
        'انسخ رابط الـ Webhook',
        'الصق الرابط أدناه'
      ]
    },
    discord: {
      name: 'Discord',
      icon: '🎮',
      description: 'شارك التحديثات مع فريقك على Discord',
      setupSteps: [
        'انتقل إلى إعدادات الخادم',
        'أنشئ Webhook جديد',
        'انسخ رابط الـ Webhook',
        'الصق الرابط أدناه'
      ]
    },
    webhook: {
      name: 'Webhook',
      icon: '🔗',
      description: 'أرسل البيانات إلى نقطة نهاية مخصصة',
      setupSteps: [
        'أدخل رابط الـ Webhook الخاص بك',
        'اختر نوع الأحداث',
        'اختبر الاتصال',
        'احفظ الإعدادات'
      ]
    }
  };

  const handleCopyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    setIntegrations(integrations.map(i => 
      i.id === id 
        ? { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' }
        : i
    ));
  };

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(integrations.filter(i => i.id !== id));
  };

  const handleAddIntegration = () => {
    const newIntegration: Integration = {
      id: `${selectedPlatform}-${Date.now()}`,
      platform: selectedPlatform,
      name: `${platformInfo[selectedPlatform].name} جديد`,
      status: 'disconnected',
      config: {}
    };
    setIntegrations([...integrations, newIntegration]);
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected':
        return 'متصل';
      case 'disconnected':
        return 'غير متصل';
      case 'error':
        return 'خطأ';
      default:
        return status;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">التكامل مع المنصات الخارجية</h2>
          <p className="text-sm text-gray-600 mt-1">
            ربط التطبيق مع Telegram و Slack و Discord والمنصات الأخرى
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="gap-2 bg-black text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          إضافة تكامل جديد
        </Button>
      </div>

      {/* Summary */}
      <Card className="p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">التكاملات المتصلة</p>
            <p className="text-2xl font-bold text-black mt-1">{connectedCount}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">إجمالي التكاملات</p>
            <p className="text-2xl font-bold text-black mt-1">{integrations.length}</p>
          </div>
        </div>
      </Card>

      {/* Add Integration Form */}
      {showAddForm && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <h3 className="font-semibold text-black mb-4">اختر منصة للتكامل</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {Object.entries(platformInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedPlatform(key as any)}
                className={`p-4 rounded border-2 transition ${
                  selectedPlatform === key
                    ? 'border-black bg-white'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <p className="text-2xl mb-2">{info.icon}</p>
                <p className="text-sm font-medium text-black">{info.name}</p>
              </button>
            ))}
          </div>

          <div className="mb-4 p-4 bg-white rounded border border-gray-200">
            <p className="text-sm font-medium text-black mb-2">خطوات الإعداد:</p>
            <ol className="text-sm text-gray-700 space-y-1">
              {platformInfo[selectedPlatform].setupSteps.map((step, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-medium text-black">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddIntegration}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              إضافة التكامل
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="outline"
              className="flex-1 border-gray-300"
            >
              إلغاء
            </Button>
          </div>
        </Card>
      )}

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.length > 0 ? (
          integrations.map(integration => (
            <Card key={integration.id} className="p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">
                    {platformInfo[integration.platform].icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{integration.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {platformInfo[integration.platform].description}
                    </p>
                    {integration.lastUsed && (
                      <p className="text-xs text-gray-600 mt-2">
                        آخر استخدام: {integration.lastUsed.toLocaleString('ar-SA')}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
                  {getStatusLabel(integration.status)}
                </Badge>
              </div>

              {/* Token Display */}
              {integration.config.token && (
                <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 truncate">
                      {integration.config.token.substring(0, 20)}...
                    </span>
                    <button
                      onClick={() => handleCopyToken(integration.config.token!, integration.id)}
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition"
                    >
                      {copiedId === integration.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleToggleStatus(integration.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-gray-300"
                >
                  {integration.status === 'connected' ? (
                    <>
                      <Link2 className="w-4 h-4" />
                      قطع الاتصال
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      الاتصال
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {}}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-300"
                >
                  <Send className="w-4 h-4" />
                  اختبار
                </Button>
                <Button
                  onClick={() => handleDeleteIntegration(integration.id)}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 border border-gray-200 text-center">
            <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">لا توجد تكاملات متصلة</p>
            <p className="text-sm text-gray-500 mt-1">
              أضف تكامل جديد للبدء في استقبال الإشعارات
            </p>
          </Card>
        )}
      </div>

      {/* Integration Guide */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          دليل الإعداد
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-black mb-2">📱 Telegram</h4>
            <p className="text-sm text-gray-700">
              أنشئ bot جديد عبر @BotFather وأرسل رسالة للبوت لتفعيل الإشعارات. سيتم استقبال جميع التنبيهات والتقارير مباشرة على Telegram.
            </p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded">
            <h4 className="font-medium text-black mb-2">💼 Slack</h4>
            <p className="text-sm text-gray-700">
              أنشئ Incoming Webhook من إعدادات Slack وربطه هنا. سيتم إرسال الإشعارات إلى القناة المحددة تلقائياً.
            </p>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded">
            <h4 className="font-medium text-black mb-2">🎮 Discord</h4>
            <p className="text-sm text-gray-700">
              أنشئ Webhook من إعدادات الخادم وربطه هنا. سيتم إرسال جميع التحديثات إلى قناة Discord المختارة.
            </p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-black mb-2">🔗 Webhook</h4>
            <p className="text-sm text-gray-700">
              أدخل رابط webhook مخصص لاستقبال البيانات بصيغة JSON. يمكنك استخدام أي خدمة تدعم webhooks.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
