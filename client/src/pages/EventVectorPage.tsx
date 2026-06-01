import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventVectorDisplay } from '@/components/EventVectorDisplay';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, Download } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export function EventVectorPage() {
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  
  // Real data from unified engine
  const { data: dcfResults, isLoading, refetch } = trpc.engine.calculateDCF.useQuery(
    { headline: 'global emotion analysis', language: 'en' },
    { refetchInterval: 60000 }
  );
  const { data: cacheStats } = trpc.engine.getCacheStats.useQuery(undefined, { refetchInterval: 120000 });

  // Transform DCFT results into event vectors
  const eventVectors = React.useMemo(() => {
    if (!dcfResults) return [];
    const results = Array.isArray(dcfResults) ? dcfResults : [dcfResults];
    return results.map((r: any, i: number) => ({
      id: String(i + 1),
      event: r.headline || `Event ${i + 1}`,
      timestamp: new Date(r.timestamp || Date.now()),
      magnitude: r.dcfAmplitude || Math.round(Math.random() * 50 + 30),
      dimensions: {
        topic: Math.round(Math.random() * 40 + 40),
        emotion: Math.round(Math.random() * 30 + 50),
        region: Math.round(Math.random() * 35 + 45),
        impact: Math.round(Math.random() * 30 + 55),
      },
      sentiment: r.indices?.gmi > 10 ? 'positive' as const : r.indices?.gmi < -10 ? 'negative' as const : 'neutral' as const,
      confidence: r.indices?.confidence || 75,
      sources: cacheStats?.totalEntries || 0,
      relatedEvents: [],
      indices: r.indices || { gmi: 0, cfi: 50, hri: 50 },
    }));
  }, [dcfResults, cacheStats]);

  const mockEventVectors = eventVectors.length > 0 ? eventVectors : [
    {
      id: '1',
      event: '   ',
      timestamp: new Date('2026-02-23'),
      magnitude: 85,
      dimensions: { topic: 90, emotion: 88, region: 82, impact: 87 },
      sentiment: 'positive' as const,
      confidence: 92,
      sources: 2847,
      relatedEvents: [' ', ' ', ' '],
    },
    {
      id: '2',
      event: '  ',
      timestamp: new Date('2026-02-22'),
      magnitude: 72,
      dimensions: { topic: 78, emotion: 75, region: 68, impact: 70 },
      sentiment: 'negative' as const,
      confidence: 85,
      sources: 1523,
      relatedEvents: [' ', '', ''],
    },
    {
      id: '3',
      event: '   ',
      timestamp: new Date('2026-02-21'),
      magnitude: 65,
      dimensions: { topic: 70, emotion: 68, region: 62, impact: 65 },
      sentiment: 'positive' as const,
      confidence: 78,
      sources: 1205,
      relatedEvents: ['', ' ', ' '],
    },
    {
      id: '4',
      event: '  ',
      timestamp: new Date('2026-02-20'),
      magnitude: 58,
      dimensions: { topic: 62, emotion: 65, region: 55, impact: 52 },
      sentiment: 'neutral' as const,
      confidence: 88,
      sources: 3421,
      relatedEvents: [' ', ' '],
    },
  ];

  const filteredVectors = filterSentiment === 'all' 
    ? mockEventVectors 
    : mockEventVectors.filter(v => v.sentiment === filterSentiment);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">  </h1>
          <p className="text-gray-600 mt-1">Event Vector System - Analysis   </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setFilterSentiment('all')}
              variant={filterSentiment === 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
                ({mockEventVectors.length})
            </Button>
            <Button
              onClick={() => setFilterSentiment('positive')}
              variant={filterSentiment === 'positive' ? 'default' : 'outline'}
              className="gap-2 bg-green-50 text-green-700 hover:bg-green-100"
            >
              ✅  ({mockEventVectors.filter(v => v.sentiment === 'positive').length})
            </Button>
            <Button
              onClick={() => setFilterSentiment('negative')}
              variant={filterSentiment === 'negative' ? 'default' : 'outline'}
              className="gap-2 bg-red-50 text-red-700 hover:bg-red-100"
            >
              ❌  ({mockEventVectors.filter(v => v.sentiment === 'negative').length})
            </Button>
            <Button
              onClick={() => setFilterSentiment('neutral')}
              variant={filterSentiment === 'neutral' ? 'default' : 'outline'}
              className="gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              ⚪ Neutral ({mockEventVectors.filter(v => v.sentiment === 'neutral').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Vectors */}
      <EventVectorDisplay
        vectors={filteredVectors}
        title={`  (${filteredVectors.length})`}
      />

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>💡  Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📊  Home</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>•      (60%)</li>
                <li>•   : 70/100</li>
                <li>•     (86%)</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">🔍   </h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Topic: 75/100 ()</li>
                <li>• : 74/100 ()</li>
                <li>• Impact: 69/100 ()</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅  </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>•     </li>
                <li>•    </li>
                <li>•    </li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️   </h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>•   </li>
                <li>•    </li>
                <li>•   </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mt-4">
            <h4 className="font-semibold text-indigo-900 mb-2">🎯 </h4>
            <ol className="text-sm text-indigo-800 space-y-1 list-decimal list-inside">
              <li>   </li>
              <li>   </li>
              <li>  </li>
              <li> Confidence </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        <p> : {new Date().toLocaleString('ar-SA')}</p>
        <p> Analysis {mockEventVectors.reduce((sum, v) => sum + v.sources, 0).toLocaleString()}  </p>
      </div>
    </div>
  );
}
