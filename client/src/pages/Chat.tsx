'use client';

import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Trash2, Search, Download, Share2, MessageSquare } from 'lucide-react';

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
      GMI: number;
      CFI: number;
      HRI: number;
    };
  };
}

interface Conversation {
  id: number;
  title: string;
  topic?: string;
  createdAt: Date;
  messageCount: number;
  lastMessage?: string;
  confidence?: number;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'confidence' | 'topic'>('recent');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<number>(0);

  // Fetch conversation history
  const { data: history, refetch: refetchHistory } = trpc.conversations.list.useQuery(undefined);

  // Create conversation mutation
  const createMutation = trpc.conversations.create.useMutation({
    onSuccess: () => refetchHistory()
  });

  // Delete conversation mutation
  const deleteMutation = trpc.conversations.delete.useMutation({
    onSuccess: () => refetchHistory()
  });

  // Get daily trends for context
  const { data: trends } = trpc.analytics.getDailyTrends.useQuery({
    days: 7,
    countryCode: 'LY'
  });

  useEffect(() => {
    if (history) {
      setConversations(history);
    }
  }, [history]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Filter and sort conversations
  const getDateFilter = () => {
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return monthAgo;
      default:
        return new Date(0);
    }
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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get latest trends for context
      const latestTrend = trends?.[trends.length - 1];

      // Create assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Analysis of "${input}": Based on current global emotional data, the collective mood shows ${
          latestTrend?.sentiment || 50
        }% positive sentiment. The Global Mood Index (GMI) is at ${
          Math.round(latestTrend?.gmi || 50)
        }%, indicating ${
          (latestTrend?.gmi || 50) > 60 ? 'optimistic' : 'cautious'
        } outlook. Confidence in this analysis is ${
          Math.round(latestTrend?.cfi || 50)
        }%.`,
        timestamp: new Date(),
        confidence: Math.round(latestTrend?.cfi || 50),
        metadata: {
          region: 'Global',
          topic: 'General Analysis',
          indices: {
            GMI: Math.round(latestTrend?.gmi || 50),
            CFI: Math.round(latestTrend?.cfi || 50),
            HRI: Math.round(latestTrend?.hri || 50)
          }
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save conversation
      if (messages.length === 0) {
        await createMutation.mutateAsync({
          topic: 'General Analysis',
          countryCode: 'LY'
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

  const uniqueTopics = Array.from(new Set(conversations.map(c => c.topic).filter(Boolean)));

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} border-r border-border transition-all duration-300 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
              >
                ✕
              </Button>
            </div>

            {/* New Chat Button */}
            <Button
              className="w-full mb-4"
              onClick={() => {
                setMessages([]);
                setSelectedConversation(null);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              New Chat
            </Button>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm font-medium">Topic</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                >
                  <option value="all">All Topics</option>
                  {uniqueTopics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Date Range</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Min Confidence</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidenceFilter}
                    onChange={(e) => setConfidenceFilter(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs font-medium min-w-[2rem]">{confidenceFilter}%</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Sort By</label>
                <select
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="confidence">Highest Confidence</option>
                  <option value="topic">By Topic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-2">
                    No conversations found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery || filterTopic !== 'all' || dateFilter !== 'all' || confidenceFilter > 0
                      ? 'Try adjusting your filters'
                      : 'Start a new conversation to begin'}
                  </p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <Card
                    key={conv.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedConversation === conv.id.toString()
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedConversation(conv.id.toString())}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{conv.title}</p>
                        {conv.topic && (
                          <p className="text-xs opacity-70">{conv.topic}</p>
                        )}
                        <p className="text-xs opacity-50 mt-1">
                          {new Date(conv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!showSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
              >
                ☰
              </Button>
            )}
            <h1 className="text-xl font-semibold">
              {selectedConversation ? 'Conversation' : 'New Chat'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportChat}
              disabled={messages.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={messages.length === 0}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Start a Conversation</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Ask about global emotions, trends, or get analysis on any topic
                </p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-2xl p-4 ${
                      msg.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.metadata && (
                      <div className="mt-3 pt-3 border-t border-current border-opacity-20 text-xs space-y-1">
                        {msg.metadata.topic && (
                          <p>📌 Topic: {msg.metadata.topic}</p>
                        )}
                        {msg.metadata.indices && (
                          <p>📊 GMI: {msg.metadata.indices.GMI}% | CFI: {msg.metadata.indices.CFI}% | HRI: {msg.metadata.indices.HRI}%</p>
                        )}
                        {msg.confidence && (
                          <p>✓ Confidence: {msg.confidence}%</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs opacity-50 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </Card>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              placeholder="Ask about global emotions, trends, or any topic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="sm"
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
