import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface RealtimeSubscription {
  type: 'weather' | 'indices' | 'dashboard' | 'alerts';
  userId?: string;
  region?: string;
}

interface RealtimeData {
  type: string;
  timestamp: Date;
  data: Record<string, any>;
}

class RealtimeDataManager {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, Set<RealtimeSubscription>> = new Map();
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/api/realtime' });
    this.setupWebSocket();
    this.startDataBroadcast();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[WebSocket] New client connected');
      this.clients.set(ws, new Set());

      ws.on('message', (message: string) => {
        try {
          const { action, subscription } = JSON.parse(message);

          if (action === 'subscribe') {
            const subscriptions = this.clients.get(ws);
            if (subscriptions) {
              subscriptions.add(subscription);
              ws.send(JSON.stringify({
                type: 'subscription_confirmed',
                subscription
              }));
            }
          } else if (action === 'unsubscribe') {
            const subscriptions = this.clients.get(ws);
            if (subscriptions) {
              subscriptions.delete(subscription);
            }
          }
        } catch (error) {
          console.error('[WebSocket] Message parse error:', error);
        }
      });

      ws.on('close', () => {
        console.log('[WebSocket] Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error: Error) => {
        console.error('[WebSocket] Error:', error);
      });
    });
  }

  private startDataBroadcast() {
    // Broadcast real-time data every 5 seconds
    this.updateInterval = setInterval(async () => {
      const realtimeData = await this.generateRealtimeData();
      this.broadcast(realtimeData);
    }, 5000);
  }

  private async generateRealtimeData(): Promise<RealtimeData[]> {
    const { getDb } = await import('./db');
    const db = await getDb();
    const schema = await import('../drizzle/schema');
    const emotionIndex = (schema as any).emotionIndex;

    try {
      // Get latest emotion data
      if (!db) return [];
      const latest = await db.select().from(emotionIndex).orderBy((t: any) => t.createdAt).limit(1);

      const data: RealtimeData[] = [];

      if (latest && latest.length > 0) {
        const record = latest[0] as any;

        // Weather data
        data.push({
          type: 'weather',
          timestamp: new Date(),
          data: {
            hope: Math.round((record.gmi || 50) * 0.8),
            fear: Math.round((record.cfi || 50) * 0.6),
            stability: Math.round((record.hri || 50) * 0.9),
            condition: this.getWeatherCondition(record.gmi || 50),
            riskLevel: this.getRiskLevel(record.cfi || 50),
          }
        });

        // Indices data
        data.push({
          type: 'indices',
          timestamp: new Date(),
          data: {
            gmi: Math.round(record.gmi || 50),
            cfi: Math.round(record.cfi || 50),
            hri: Math.round(record.hri || 50),
            stability: Math.round((record.confidence || 50) * 0.95),
            confidence: Math.round(record.confidence || 50),
          }
        });

        // Dashboard stats
        data.push({
          type: 'dashboard',
          timestamp: new Date(),
          data: {
            totalAnalyses: Math.floor(Math.random() * 1000) + 500,
            activeUsers: Math.floor(Math.random() * 100) + 20,
            averageConfidence: Math.round(record.confidence || 50),
            topTopic: 'Global Events',
          }
        });
      }

      return data;
    } catch (error) {
      console.error('[WebSocket] Error generating realtime data:', error);
      return [];
    }
  }

  private getWeatherCondition(gmi: number): string {
    if (gmi > 70) return 'sunny';
    if (gmi > 50) return 'cloudy';
    if (gmi > 30) return 'rainy';
    return 'stormy';
  }

  private getRiskLevel(cfi: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (cfi < 30) return 'low';
    if (cfi < 50) return 'moderate';
    if (cfi < 70) return 'high';
    return 'critical';
  }

  private broadcast(dataArray: RealtimeData[]) {
    this.clients.forEach((subscriptions, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        subscriptions.forEach((subscription) => {
          const matchingData = dataArray.find(d => d.type === subscription.type);
          if (matchingData) {
            ws.send(JSON.stringify(matchingData));
          }
        });
      }
    });
  }

  public stop() {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
    }
    this.wss.close();
  }
}

export { RealtimeDataManager };
