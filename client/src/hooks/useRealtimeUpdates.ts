/**
 * REAL-TIME UPDATES HOOK
 * 
 * يوفر تحديثات فورية عبر WebSocket
 * Provides real-time updates via WebSocket connection
 */

import { useEffect, useState, useCallback, useRef } from 'react';

export interface RealtimeUpdate {
  type: 'gmi' | 'cfi' | 'hri' | 'emotions' | 'alert' | 'prediction';
  data: any;
  timestamp: Date;
  source: string;
}

interface UseRealtimeUpdatesOptions {
  enabled?: boolean;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useRealtimeUpdates(options: UseRealtimeUpdatesOptions = {}) {
  const {
    enabled = true,
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      // Determine WebSocket URL based on current location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/api/realtime`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('✓ WebSocket connected');
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const update: RealtimeUpdate = JSON.parse(event.data);
          setUpdates(prev => [...prev.slice(-99), update]); // Keep last 100 updates
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);

        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, reconnectInterval);
        } else {
          setError('Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    }
  }, [enabled, reconnectAttempts, maxReconnectAttempts, reconnectInterval]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnected(false);
    setReconnectAttempts(0);
  }, []);

  // Send message to server
  const send = useCallback((message: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }, [isConnected]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, enabled, connect, disconnect]);

  // Subscribe to specific update types
  const subscribe = useCallback((type: RealtimeUpdate['type'], callback: (update: RealtimeUpdate) => void) => {
    const unsubscribe = () => {
      // Remove listener
    };

    return unsubscribe;
  }, []);

  return {
    isConnected,
    updates,
    error,
    reconnectAttempts,
    connect,
    disconnect,
    send,
    subscribe
  };
}

/**
 * Hook for auto-refreshing data at intervals
 */
export function useAutoRefresh(callback: () => void, interval: number = 30000, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(callback, interval);
    return () => clearInterval(timer);
  }, [callback, interval, enabled]);
}

/**
 * Hook for monitoring connection status
 */
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook combining WebSocket and auto-refresh for optimal real-time updates
 */
export function useOptimizedRealtimeUpdates(
  fetchCallback: () => Promise<void>,
  options: UseRealtimeUpdatesOptions & { fallbackInterval?: number } = {}
) {
  const { fallbackInterval = 30000, ...wsOptions } = options;

  const { isConnected } = useRealtimeUpdates(wsOptions);
  const isOnline = useConnectionStatus();

  // Use WebSocket if available, fall back to polling
  useAutoRefresh(
    fetchCallback,
    fallbackInterval,
    enabled = !isConnected && isOnline
  );

  return {
    isConnected,
    isOnline,
    isOptimal: isConnected && isOnline
  };
}
