import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Download, Trash2, Menu, Plus, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { skipToken } from '@tanstack/react-query';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  metadata?: {
    region?: string;
    topic?: string;
    indices?: {
      gmi?: number;
      cfi?: number;
      hri?: number;
    };
    emotions?: Record<string, number>;
    dominantEmotion?: string;
    sourceCount?: number;
    totalItems?: number;
  };
}

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the unified engine (engine.smartAnalyze) instead of old consciousness.analyze
  const smartAnalyze = trpc.engine.smartAnalyze.useMutation();

  // Conversations
  const { data: conversations, refetch: refetchConversations } = trpc.conversations.list.useQuery();
  const createConversation = trpc.conversations.create.useMutation({
    onSuccess: () => refetchConversations(),
  });
  const addMessage = trpc.conversations.addMessage.useMutation();
  const deleteConversation = trpc.conversations.delete.useMutation({
    onSuccess: () => refetchConversations(),
  });

  // Load conversation when selected
  const { data: loadedConversation } = trpc.conversations.get.useQuery(
    currentConversationId ? { id: currentConversationId } : skipToken,
    { enabled: !!currentConversationId }
  );

  // When a conversation is loaded from DB, populate messages
  useEffect(() => {
    if (loadedConversation?.messages) {
      const loaded: ChatMessage[] = loadedConversation.messages.map((msg: any) => {
        let metadata: ChatMessage['metadata'] = undefined;
        if (msg.analysisData) {
          try {
            const parsed = typeof msg.analysisData === 'string' ? JSON.parse(msg.analysisData) : msg.analysisData;
            metadata = {
              indices: {
                gmi: parsed.gmi,
                cfi: parsed.cfi,
                hri: parsed.hri,
              },
              dominantEmotion: parsed.dominantEmotion,
              emotions: parsed.emotions,
              sourceCount: parsed.sourceCount,
              totalItems: parsed.totalItems,
            };
          } catch { /* ignore parse errors */ }
        }
        return {
          id: String(msg.id),
          type: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          confidence: metadata?.indices?.gmi ? Math.abs(metadata.indices.gmi) : undefined,
          metadata,
        };
      });
      setMessages(loaded);
    }
  }, [loadedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id);
    // Messages will be loaded by the useQuery + useEffect above
  };

  const handleNewConversation = () => {
    setCurrentConversationId(undefined);
    setMessages([]);
    setInput('');
  };

  const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation.mutateAsync({ id });
      if (currentConversationId === id) {
        handleNewConversation();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();

    // Add user message to UI
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the unified network engine via engine.smartAnalyze
      const result = await smartAnalyze.mutateAsync({
        query: userInput,
        language: 'ar',
      });

      // Build assistant message from unified engine result
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date(),
        confidence: Math.round((result.confidence ?? 0) * 100),
        metadata: {
          dominantEmotion: result.dominantEmotion,
          indices: {
            gmi: result.gmi,
            cfi: result.cfi,
            hri: result.hri,
          },
          emotions: result.emotions as Record<string, number>,
          sourceCount: result.sourceCount,
          totalItems: result.totalItems,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save conversation to DB
      if (!currentConversationId) {
        // Create new conversation
        const created = await createConversation.mutateAsync({
          topic: userInput.substring(0, 200),
          initialAnalysis: {
            gmi: result.gmi ?? 0,
            cfi: result.cfi ?? 0,
            hri: result.hri ?? 0,
            dominantEmotion: result.dominantEmotion ?? 'neutral',
            aiResponse: result.response,
          },
        });
        setCurrentConversationId(created.id as number);
      } else {
        // Add messages to existing conversation
        await addMessage.mutateAsync({
          conversationId: currentConversationId,
          role: 'user',
          content: userInput,
        });
        await addMessage.mutateAsync({
          conversationId: currentConversationId,
          role: 'assistant',
          content: result.response,
          analysisData: {
            gmi: result.gmi ?? 0,
            cfi: result.cfi ?? 0,
            hri: result.hri ?? 0,
            dominantEmotion: result.dominantEmotion ?? 'neutral',
          },
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Analysis failed'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportChat = () => {
    const chatData = {
      messages,
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
    };
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${Date.now()}.json`;
    link.click();
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEmotionColor = (emotion?: string | null) => {
    const colors: Record<string, string> = {
      joy: 'text-green-400', hope: 'text-emerald-400', curiosity: 'text-yellow-400',
      fear: 'text-orange-400', anger: 'text-red-400', sadness: 'text-purple-400',
    };
    return colors[emotion || ''] || 'text-gray-400';
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 border-r border-white/10 overflow-hidden flex flex-col bg-[#111827]`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300">Chat History</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewConversation}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-white/5"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations?.map((conv: any) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`group p-3 rounded-lg cursor-pointer transition-all ${
                  currentConversationId === conv.id
                    ? 'bg-cyan-500/10 border border-cyan-500/30'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-gray-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-200 truncate">
                        {conv.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {conv.dominantEmotion && (
                        <span className={`text-[10px] capitalize ${getEmotionColor(conv.dominantEmotion)}`}>
                          {conv.dominantEmotion}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {formatDate(conv.lastActivityAt || conv.createdAt)}
                      </span>
                    </div>
                    {conv.lastGmi != null && (
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] text-blue-400">GMI: {conv.lastGmi}</span>
                        <span className="text-[9px] text-amber-400">CFI: {conv.lastCfi}</span>
                        <span className="text-[9px] text-emerald-400">HRI: {conv.lastHri}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              </div>
            ))}

            {(!conversations || conversations.length === 0) && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No conversations yet
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4 flex items-center justify-between bg-[#111827]/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
            <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Emotional Intelligence Chat
            </h1>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-[10px]">
              Unified Engine
            </Badge>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportChat}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Export chat"
            >
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">Emotional Intelligence Chat</h2>
                <p className="text-gray-400 max-w-md">
                  Ask any question about global emotions, country sentiment, or current events. 
                  Powered by the unified DCFT network engine.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {['How is Libya feeling today?', 'What emotions dominate the Middle East?', 'Global fear index analysis'].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-2xl rounded-2xl p-4 ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'bg-[#1a2236] border border-white/10 text-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                {msg.metadata && (
                  <div className="text-xs mt-3 pt-3 border-t border-white/10 space-y-2">
                    {msg.metadata.dominantEmotion && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Dominant:</span>
                        <span className={`capitalize font-medium ${getEmotionColor(msg.metadata.dominantEmotion)}`}>
                          {msg.metadata.dominantEmotion}
                        </span>
                      </div>
                    )}

                    {msg.metadata.indices && (
                      <div className="flex gap-3">
                        <span className="text-blue-400">GMI: {msg.metadata.indices.gmi?.toFixed(1)}</span>
                        <span className="text-amber-400">CFI: {msg.metadata.indices.cfi?.toFixed(1)}</span>
                        <span className="text-emerald-400">HRI: {msg.metadata.indices.hri?.toFixed(1)}</span>
                      </div>
                    )}

                    {msg.metadata.emotions && (
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(msg.metadata.emotions)
                          .filter(([, v]) => typeof v === 'number' && v > 0.05)
                          .sort(([, a], [, b]) => (b as number) - (a as number))
                          .slice(0, 6)
                          .map(([emotion, value]) => (
                            <Badge key={emotion} variant="outline" className="text-[10px] border-white/10 capitalize">
                              {emotion}: {((value as number) * 100).toFixed(0)}%
                            </Badge>
                          ))}
                      </div>
                    )}

                    {(msg.metadata.sourceCount != null || msg.confidence != null) && (
                      <div className="flex gap-3 text-gray-500">
                        {msg.metadata.sourceCount != null && <span>Sources: {msg.metadata.sourceCount}</span>}
                        {msg.confidence != null && <span>Confidence: {msg.confidence}%</span>}
                      </div>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-gray-500 mt-2">
                  {msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString() : new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1a2236] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-sm text-gray-400">Analyzing with unified engine...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 bg-[#111827]/50 backdrop-blur-xl">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Input
              placeholder="Ask about global emotions, country sentiment, or current events..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading}
              className="flex-1 bg-[#1a2236] border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
