/**
 * Enhanced Message Card with animations and better styling
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface EnhancedMessageCardProps {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  confidence?: number;
  metadata?: {
    region?: string;
    topic?: string;
    indices?: {
      GMI?: number;
      CFI?: number;
      HRI?: number;
    };
    emotions?: Record<string, number>;
    severity?: string;
  };
  onCopy?: (text: string) => void;
}

export function EnhancedMessageCard({
  type,
  content,
  timestamp,
  confidence,
  metadata,
  onCopy,
}: EnhancedMessageCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy?.(content);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = type === 'user';

  return (
    <div
      className={`flex gap-3 mb-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-2xl ${isUser ? 'order-2' : 'order-1'}`}>
        <Card
          className={`p-4 rounded-lg transition-all duration-300 hover:shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
              : 'bg-gradient-to-r from-slate-800 to-slate-900 text-slate-100 rounded-bl-none border border-slate-700'
          }`}
        >
          {/* Main Content */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>

          {/* Metadata for Assistant Messages */}
          {!isUser && metadata && (
            <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
              {/* Confidence Badge */}
              {confidence !== undefined && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-slate-400">
                    Confidence: {Math.round(confidence * 100)}%
                  </span>
                </div>
              )}

              {/* Topic & Region */}
              <div className="flex gap-2 flex-wrap">
                {metadata.topic && (
                  <Badge variant="secondary" className="text-xs">
                    {metadata.topic}
                  </Badge>
                )}
                {metadata.region && (
                  <Badge variant="outline" className="text-xs">
                    {metadata.region}
                  </Badge>
                )}
                {metadata.severity && (
                  <Badge
                    variant={
                      metadata.severity === 'high'
                        ? 'destructive'
                        : metadata.severity === 'medium'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {metadata.severity}
                  </Badge>
                )}
              </div>

              {/* Indices */}
              {metadata.indices && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {metadata.indices.GMI !== undefined && (
                    <div className="bg-slate-800 rounded px-2 py-1">
                      <span className="text-slate-400">GMI:</span>
                      <span className="ml-1 text-blue-400 font-bold">
                        {metadata.indices.GMI.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {metadata.indices.CFI !== undefined && (
                    <div className="bg-slate-800 rounded px-2 py-1">
                      <span className="text-slate-400">CFI:</span>
                      <span className="ml-1 text-cyan-400 font-bold">
                        {metadata.indices.CFI.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {metadata.indices.HRI !== undefined && (
                    <div className="bg-slate-800 rounded px-2 py-1">
                      <span className="text-slate-400">HRI:</span>
                      <span className="ml-1 text-green-400 font-bold">
                        {metadata.indices.HRI.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Timestamp & Actions */}
        <div className={`flex items-center gap-2 mt-2 text-xs text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {timestamp && (
            <span>{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          )}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="hover:text-slate-300 transition-colors p-1 hover:bg-slate-800 rounded"
              title="Copy message"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
