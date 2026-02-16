import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Download, Share2, Trash2, Menu, Plus, Settings, Copy, CheckCircle } from 'lucide-react';

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
      GMI?: number;
      CFI?: number;
      HRI?: number;
    };
    emotions?: Record<string, number>;
    severity?: string;
  };
}

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'confidence' | 'topic'>('recent');
  const [confidenceFilter, setConfidenceFilter] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history, refetch: refetchHistory } = trpc.conversations.list.useQuery(undefined);
  const { data: trends } = trpc.analytics.getDailyTrends.useQuery({
    days: 7,
  });

  const createMutation = trpc.conversations.create.useMutation({
    onSuccess: () => refetchHistory(),
  });

  const deleteMutation = trpc.conversations.delete.useMutation({
    onSuccess: () => refetchHistory(),
  });

  const analyzeMutation = trpc.consciousness.analyze.useMutation();

  useEffect(() => {
    if (history) {
      setConversations(history);
    }
  }, [history]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getDateFilter = () => {
    const now = new Date();
    const filterMap: Record<string, Date> = {
      today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };
    return filterMap['month'] || new Date(0);
  };

  const filteredConversations = conversations
    .filter(conv => {
      const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.topic?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = filterTopic === 'all' || conv.topic === filterTopic;
      const matchesDate = new Date(conv.createdAt) >= getDateFilter();
      const matchesConfidence = (conv.confidence || 0) >= confidenceFilter;
      return matchesSearch && matchesTopic && matchesDate && matchesConfidence;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'confidence') {
        return (b.confidence || 0) - (a.confidence || 0);
      } else {
        return (a.topic || '').localeCompare(b.topic || '');
      }
    });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use Unified Consciousness Engine for intelligent analysis
      const analysisResult = await analyzeMutation.mutateAsync({
        question: userInput.trim(),
      });

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Analysis failed');
      }

      // Extract answer and details from unified result
      const answer = analysisResult.answer || 'Analysis processing...';
      const details = analysisResult.details || {};
      const eventVector = details.eventVector;
      const emotions = details.emotions;
      const indices = details.indices;

      // Create assistant response with full EventVector data
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: answer,
        timestamp: new Date(),
        confidence: eventVector ? Math.round(eventVector.topicConfidence * 100) : 50,
        metadata: eventVector ? {
          region: eventVector.region || 'Global',
          topic: eventVector.topic,
          indices: {
            GMI: Math.round(eventVector.impactScore * 100),
            CFI: Math.round((eventVector.emotions.fear || 0) * 100),
            HRI: Math.round((eventVector.emotions.hope || 0) * 100)
          },
          emotions: Object.entries(eventVector.emotions).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: Math.round((value as number) * 100),
            }),
            {} as Record<string, number>
          ),
          severity: eventVector.severity,
        } : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save conversation
      if (messages.length === 0 && eventVector) {
        await createMutation.mutateAsync({
          topic: eventVector.topic || userInput.substring(0, 50),
          countryCode: 'LY',
          initialAnalysis: {
            gmi: Math.round(eventVector.impactScore * 100),
            cfi: Math.round((eventVector.emotions.fear || 0) * 100),
            hri: Math.round((eventVector.emotions.hope || 0) * 100),
            dominantEmotion: eventVector.dominantEmotion,
            aiResponse: answer,
          }
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

  const handleDeleteConversation = async (id: number) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleExportChat = () => {
    const chatData = {
      messages,
      exportedAt: new Date().toISOString(),
      messageCount: messages.length
    };
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r border-border overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
        </div>

        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {/* Search */}
          <Input
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          {/* Filters */}
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
          >
            <option value="all">All Topics</option>
            <option value="politics">Politics</option>
            <option value="economy">Economy</option>
            <option value="health">Health</option>
            <option value="technology">Technology</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="confidence">Highest Confidence</option>
            <option value="topic">By Topic</option>
          </select>

          {/* Confidence Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Min Confidence: {confidenceFilter}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conv.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="font-medium truncate text-sm">{conv.title}</div>
                <div className="text-xs opacity-75 mt-1">{conv.topic}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs">{conv.confidence}% confidence</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="text-xs hover:opacity-75"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Emotional Intelligence Chat</h1>
          <div className="flex gap-2">
            <button
              onClick={handleExportChat}
              className="p-2 hover:bg-muted rounded-lg"
              title="Export chat"
            >
              <Download size={20} />
            </button>
            <button
              className="p-2 hover:bg-muted rounded-lg"
              title="Share chat"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{'Welcome to Chat'}</h2>
                <p>{'Start analyzing emotional data...'}</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-2xl p-4 ${
                msg.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm mb-2">{msg.content}</p>
                
                {msg.metadata && (
                  <div className="text-xs opacity-75 space-y-1 mt-3 pt-3 border-t border-current/20">
                    <div><strong>Topic:</strong> {msg.metadata.topic}</div>
                    <div><strong>Region:</strong> {msg.metadata.region}</div>
                    {msg.confidence && <div><strong>Confidence:</strong> {msg.confidence}%</div>}
                    
                    {msg.metadata.indices && (
                      <div className="mt-2">
                        <strong>Indices:</strong>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <div>GMI: {msg.metadata.indices.GMI}%</div>
                          <div>CFI: {msg.metadata.indices.CFI}%</div>
                          <div>HRI: {msg.metadata.indices.HRI}%</div>
                        </div>
                      </div>
                    )}

                    {msg.metadata.emotions && (
                      <div className="mt-2">
                        <strong>Emotions:</strong>
                        <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                          {Object.entries(msg.metadata.emotions).map(([emotion, value]) => (
                            <div key={emotion}>{emotion}: {value}%</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs opacity-50 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-muted p-4">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">{'Analyzing...'}</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              placeholder={'Enter your message...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
