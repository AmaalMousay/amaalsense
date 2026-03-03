/**
 * CUSTOM ALERTS COMPONENT
 * 
 * مكون التنبيهات المخصصة
 * - عرض تنبيهات مخصصة حسب نوعها وأولويتها
 * - دعم تنبيهات متعددة الأنواع (critical, warning, info, success)
 * - إمكانية الإغلاق والتفاعل مع التنبيهات
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X, Bell } from 'lucide-react';

export interface CustomAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  dismissible?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
}

interface CustomAlertsProps {
  alerts: CustomAlert[];
  onDismiss?: (alertId: string) => void;
  maxVisible?: number;
  position?: 'top' | 'bottom';
  className?: string;
}

export function CustomAlerts({
  alerts,
  onDismiss,
  maxVisible = 5,
  position = 'top',
  className = ''
}: CustomAlertsProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<string[]>([]);

  useEffect(() => {
    const newAlerts = alerts.slice(0, maxVisible).map(a => a.id);
    setVisibleAlerts(newAlerts);

    // Auto-dismiss alerts with duration
    const timers = alerts
      .filter(a => a.duration && a.duration > 0)
      .map(alert => {
        return setTimeout(() => {
          handleDismiss(alert.id);
        }, alert.duration);
      });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [alerts, maxVisible]);

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts(prev => prev.filter(id => id !== alertId));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const displayAlerts = alerts.filter(a => visibleAlerts.includes(a.id));

  if (displayAlerts.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-50 space-y-3 max-w-md ${className}`}
    >
      {displayAlerts.map(alert => (
        <Card
          key={alert.id}
          className={`border p-4 ${getAlertStyles(alert.type)} animate-in fade-in slide-in-from-right-4 duration-300`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getAlertIcon(alert.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{alert.title}</h3>
              <p className="text-sm mt-1 opacity-90">{alert.message}</p>

              {alert.actionUrl && alert.actionLabel && (
                <a
                  href={alert.actionUrl}
                  className="text-sm font-medium mt-2 inline-block underline hover:opacity-75"
                >
                  {alert.actionLabel}
                </a>
              )}

              <p className="text-xs opacity-75 mt-2">
                {new Date(alert.timestamp).toLocaleTimeString('ar-SA')}
              </p>
            </div>

            {alert.dismissible !== false && (
              <button
                onClick={() => handleDismiss(alert.id)}
                className="flex-shrink-0 p-1 hover:opacity-75 transition-opacity"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </Card>
      ))}

      {alerts.length > maxVisible && (
        <div className="text-center text-xs text-gray-500">
          و {alerts.length - maxVisible} تنبيه آخر
        </div>
      )}
    </div>
  );
}

/**
 * Alert Manager Hook - لإدارة التنبيهات
 */
export function useAlertManager() {
  const [alerts, setAlerts] = useState<CustomAlert[]>([]);

  const addAlert = (
    type: CustomAlert['type'],
    title: string,
    message: string,
    options?: {
      dismissible?: boolean;
      actionUrl?: string;
      actionLabel?: string;
      duration?: number;
    }
  ) => {
    const id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: CustomAlert = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
      dismissible: options?.dismissible ?? true,
      actionUrl: options?.actionUrl,
      actionLabel: options?.actionLabel,
      duration: options?.duration ?? (type === 'critical' ? 0 : 5000)
    };

    setAlerts(prev => [newAlert, ...prev]);
    return id;
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const addCritical = (title: string, message: string, options?: any) =>
    addAlert('critical', title, message, options);

  const addWarning = (title: string, message: string, options?: any) =>
    addAlert('warning', title, message, options);

  const addInfo = (title: string, message: string, options?: any) =>
    addAlert('info', title, message, options);

  const addSuccess = (title: string, message: string, options?: any) =>
    addAlert('success', title, message, options);

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    addCritical,
    addWarning,
    addInfo,
    addSuccess
  };
}
