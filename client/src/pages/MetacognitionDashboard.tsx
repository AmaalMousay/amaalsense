/**
 * Metacognition Dashboard
 * 
 * Displays system health, errors, and recommendations from the Metacognition Layer
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function MetacognitionDashboard() {
  const { data: systemHealth, isLoading } = trpc.engine.getSystemHealth.useQuery();
  const { data: recentErrors } = trpc.engine.getRecentErrors.useQuery();
  const { data: recommendations } = trpc.engine.getRecommendations.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل لوحة الوعي الذاتي...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8" />
            لوحة الوعي الذاتي
          </h1>
          <p className="text-muted-foreground mt-2">
            مراقبة صحة النظام المعرفي واكتشاف الأخطاء والتوصيات
          </p>
        </div>
        <Badge variant={systemHealth?.status === 'healthy' ? 'default' : 'destructive'} className="text-lg px-4 py-2">
          {systemHealth?.status === 'healthy' ? 'صحي' : 'يحتاج انتباه'}
        </Badge>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">معدل النجاح</p>
              <p className="text-3xl font-bold">{systemHealth?.successRate || 0}%</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">الأخطاء الأخيرة</p>
              <p className="text-3xl font-bold">{recentErrors?.length || 0}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">التوصيات</p>
              <p className="text-3xl font-bold">{recommendations?.length || 0}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Recent Errors */}
      {recentErrors && recentErrors.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            الأخطاء الأخيرة
          </h2>
          <div className="space-y-3">
            {recentErrors.map((error: any, index: number) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{error.type}</p>
                      <p className="text-sm mt-1">{error.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(error.timestamp).toLocaleString('ar-EG')}
                      </p>
                    </div>
                    <Badge variant="outline">{error.severity}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            التوصيات
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec: any, index: number) => (
              <Alert key={index}>
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{rec.title}</p>
                      <p className="text-sm mt-1">{rec.description}</p>
                      {rec.action && (
                        <Button size="sm" className="mt-2">
                          {rec.action}
                        </Button>
                      )}
                    </div>
                    <Badge variant="outline">{rec.priority}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* Cognitive Layers Status */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">حالة الطبقات المعرفية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemHealth?.layersStatus?.map((layer: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">{layer.name}</p>
                <p className="text-sm text-muted-foreground">{layer.description}</p>
              </div>
              <Badge variant={layer.status === 'active' ? 'default' : 'secondary'}>
                {layer.status === 'active' ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
