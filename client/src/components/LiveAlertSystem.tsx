/**
 * LIVE ALERT SYSTEM COMPONENT
 * 
 * نظام التنبيهات الفورية
 * - اتصال WebSocket للتحديثات الحية
 * - عرض التنبيهات الفورية
 * - إدارة اتصالات الخادم
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { CustomAlerts, useAlertManager, CustomAlert } from './CustomAlerts';
import { AlertCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';

interface LiveAlertSystemProps {
  userId?: string;
  onAlertReceived?: (alert: CustomAlert) => void;
  maxAlerts?: number;
}

export function LiveAlertSystem({
  userId,
  onAlertReceived,
  maxAlerts = 10
}: LiveAlertSystemProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { alerts, addAlert, removeAlert } = useAlertManager();

  // Subscribe to alerts via tRPC
  const { data: alertHistory } = trpc.notification.getAlertHistory.useQuery(
    { limit: 5 },
    { enabled: !!userId }
  );

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/notifications/ws`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[LiveAlertSystem] WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);

        // Send subscription message
        if (userId) {
          ws.send(JSON.stringify({
            type: 'subscribe',
            userId
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleAlertMessage(data);
        } catch (error) {
          console.error('[LiveAlertSystem] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[LiveAlertSystem] WebSocket error:', error);
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('[LiveAlertSystem] WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[LiveAlertSystem] Error connecting WebSocket:', error);
      setIsConnecting(false);

      // Retry connection
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 5000);
    }
  }, [isConnecting, isConnected, userId]);

  // Handle incoming alert message
  const handleAlertMessage = useCallback((data: any) => {
    const {
      type,
      metric,
      oldValue,
      newValue,
      severity,
      timestamp
    } = data;

    let alertType: CustomAlert['type'] = 'info';
    let title = '';
    let message = '';

    switch (type) {
      case 'gmi_change':
        alertType = severity === 'critical' ? 'critical' : 'warning';
        title = 'تغيير مؤشر المشاعر العالمية';
        message = `تغير GMI من ${oldValue} إلى ${newValue}`;
        break;

      case 'cfi_change':
        alertType = severity === 'critical' ? 'critical' : 'warning';
        title = 'تغيير مؤشر الثقة الجماعية';
        message = `تغير CFI من ${oldValue} إلى ${newValue}`;
        break;

      case 'hri_change':
        alertType = severity === 'critical' ? 'critical' : 'warning';
        title = 'تغيير مؤشر الأمل والمرونة';
        message = `تغير HRI من ${oldValue} إلى ${newValue}`;
        break;

      case 'emotion_shift':
        alertType = 'warning';
        title = 'تغيير العاطفة السائدة';
        message = `تغيرت العاطفة من ${oldValue} إلى ${newValue}`;
        break;

      case 'anomaly_detected':
        alertType = 'critical';
        title = 'شذوذ مكتشف';
        message = `تم اكتشاف شذوذ بدرجة ${newValue} في ${metric}`;
        break;

      case 'trend_detected':
        alertType = 'info';
        title = 'موضوع متجه للانتشار';
        message = `${metric} يتجه للانتشار بدرجة ${newValue}`;
        break;

      case 'impact_event':
        alertType = 'critical';
        title = 'حدث ذو تأثير عالي';
        message = `حدث "${metric}" بدرجة تأثير ${newValue}`;
        break;

      default:
        alertType = 'info';
        title = 'إشعار جديد';
        message = data.message || 'تم استقبال إشعار جديد';
    }

    const alert: CustomAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: alertType,
      title,
      message,
      timestamp: new Date(timestamp || Date.now()),
      dismissible: true,
      duration: alertType === 'critical' ? 0 : 8000
    };

    addAlert(alertType, title, message, {
      duration: alert.duration,
      dismissible: alert.dismissible
    });

    if (onAlertReceived) {
      onAlertReceived(alert);
    }
  }, [addAlert, onAlertReceived]);

  // Initialize WebSocket on mount
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Load initial alerts from history
  useEffect(() => {
    if (alertHistory?.data) {
      alertHistory.data.slice(0, 3).forEach(alert => {
        handleAlertMessage({
          type: alert.type,
          metric: alert.metric,
          oldValue: alert.oldValue,
          newValue: alert.newValue,
          severity: alert.severity,
          timestamp: alert.timestamp
        });
      });
    }
  }, [alertHistory, handleAlertMessage]);

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
          isConnected
            ? 'bg-green-100 text-green-700'
            : isConnecting
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الاتصال...
            </>
          ) : isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              متصل
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              غير متصل
            </>
          )}
        </div>
      </div>

      {/* Alerts Display */}
      <CustomAlerts
        alerts={alerts.slice(0, maxAlerts)}
        onDismiss={removeAlert}
        maxVisible={maxAlerts}
        position="top"
      />
    </>
  );
}

/**
 * Hook for using Live Alert System
 */
export function useLiveAlerts() {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback((userId: string) => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/notifications/ws`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({ type: 'subscribe', userId }));
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      setIsConnected(false);
    }
  }, []);

  const send = useCallback((message: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, [isConnected]);

  return {
    isConnected,
    connect,
    disconnect,
    send
  };
}
