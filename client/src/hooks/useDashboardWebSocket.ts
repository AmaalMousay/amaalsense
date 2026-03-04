import { useEffect, useState, useCallback } from 'react';

interface IndicatorUpdate {
  gmi: number;
  cfi: number;
  hri: number;
  timestamp: string;
  trend?: 'improving' | 'stable' | 'declining';
  confidence?: number;
}

interface WebSocketMessage {
  type: 'indicator_update' | 'alert' | 'connection' | 'pong';
  data?: any;
  timestamp: string;
}

/**
 * Hook for Dashboard WebSocket Real-time Updates
 * Connects to WebSocket server and broadcasts indicator updates
 */
export function useDashboardWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [indicators, setIndicators] = useState<IndicatorUpdate | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    setConnectionStatus('connecting');
    
    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/updates`;

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let pingInterval: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('[Dashboard WebSocket] Connected');
          setIsConnected(true);
          setConnectionStatus('connected');
          setError(null);

          // Subscribe to indicator updates
          ws?.send(JSON.stringify({
            type: 'subscribe',
            indicators: ['gmi', 'cfi', 'hri']
          }));

          // Send ping every 30 seconds to keep connection alive
          pingInterval = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000);
        };

        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);

            switch (message.type) {
              case 'indicator_update':
                setIndicators(message.data);
                setLastUpdate(message.timestamp);
                break;

              case 'alert':
                console.log('[Dashboard] Alert received:', message.data);
                // Handle alert notification
                break;

              case 'connection':
                console.log('[Dashboard WebSocket] Connection confirmed');
                break;

              case 'pong':
                // Pong received, connection is alive
                break;

              default:
                console.log('[Dashboard WebSocket] Unknown message type:', message.type);
            }
          } catch (error) {
            console.error('[Dashboard WebSocket] Error parsing message:', error);
          }
        };

        ws.onerror = (event) => {
          console.error('[Dashboard WebSocket] Error:', event);
          setError('WebSocket connection error');
          setConnectionStatus('disconnected');
        };

        ws.onclose = () => {
          console.log('[Dashboard WebSocket] Disconnected');
          setIsConnected(false);
          setConnectionStatus('disconnected');

          // Clear ping interval
          if (pingInterval) {
            clearInterval(pingInterval);
          }

          // Attempt to reconnect after 5 seconds
          reconnectTimeout = setTimeout(() => {
            console.log('[Dashboard WebSocket] Attempting to reconnect...');
            connect();
          }, 5000);
        };
      } catch (error) {
        console.error('[Dashboard WebSocket] Connection error:', error);
        setError('Failed to connect to WebSocket');
        setConnectionStatus('disconnected');

        // Retry connection after 5 seconds
        reconnectTimeout = setTimeout(() => {
          connect();
        }, 5000);
      }
    };

    // Initial connection
    connect();

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    };
  }, []);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    setConnectionStatus('connecting');
    // Trigger reconnection by updating state
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    indicators,
    lastUpdate,
    connectionStatus,
    error,
    reconnect
  };
}

/**
 * Hook for monitoring WebSocket connection health
 */
export function useWebSocketHealth() {
  const [latency, setLatency] = useState<number | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    let messageCounter = 0;
    const countInterval = setInterval(() => {
      setMessageCount(messageCounter);
      messageCounter = 0;
    }, 60000); // Count messages per minute

    return () => clearInterval(countInterval);
  }, []);

  return {
    latency,
    messageCount,
    isHealthy: messageCount > 0 // Healthy if receiving messages
  };
}
