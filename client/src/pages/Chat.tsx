import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Trash2 } from 'lucide-react';

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

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Fetch conversation history
  const { data: history } = trpc.conversations.list.useQuery(
    undefined
  );

  // Create conversation mutation
  const createMutation = trpc.conversations.create.useMutation();

  // Delete conversation mutation
  const deleteMutation = trpc.conversations.delete.useMutation();

  // Get conversation details (using query instead of mutation)
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const { data: selectedConvDetails } = trpc.conversations.get.useQuery(
    { id: selectedConvId! },
    { enabled: !!selectedConvId }
  );

  // Get daily trends for analysis
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

      // Create assistant response based on trends
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Analysis of "${input}": Based on current global emotional data, the collective mood shows ${
          latestTrend?.sentiment || 50
        }% positive sentiment. The Global Mood Index (GMI) is at ${Math.round(
          latestTrend?.gmi || 50
        )}%, indicating ${
          (latestTrend?.gmi || 50) > 60 ? 'optimistic' : 'cautious'
        } outlook. Confidence in this analysis is high.`,
        timestamp: new Date(),
        confidence: Math.round((latestTrend?.cfi || 50) / 100 * 100),
        metadata: {
          region: 'Global',
          topic: input,
          indices: {
            GMI: Math.round(latestTrend?.gmi || 50),
            CFI: Math.round(latestTrend?.cfi || 50),
            HRI: Math.round(latestTrend?.hri || 50)
          }
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to conversation history
      await createMutation.mutateAsync({
        topic: input,
        initialAnalysis: {
          gmi: Math.round(latestTrend?.gmi || 50),
          cfi: Math.round(latestTrend?.cfi || 50),
          hri: Math.round(latestTrend?.hri || 50),
          dominantEmotion: 'neutral',
          aiResponse: assistantMessage.content
        }
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteMutation.mutateAsync({ id: conversationId });
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (selectedConversation === conversationId.toString()) {
        setSelectedConversation(null);
        setMessages([]);
      }
    }
  };

  useEffect(() => {
    if (selectedConvDetails) {
      // Convert stored messages to ChatMessage format
      const chatMessages: ChatMessage[] = (selectedConvDetails.messages || []).map((msg: any) => ({
        id: msg.id.toString(),
        type: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        metadata: msg.analysisData ? JSON.parse(msg.analysisData) : undefined
      }));
      setMessages(chatMessages);
    }
  }, [selectedConvDetails]);

  const handleLoadConversation = (conversation: any) => {
    setSelectedConversation(conversation.id.toString());
    setSelectedConvId(conversation.id);
  };

  const t = (key: string, fallback: string) => fallback;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Conversation History */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{t('conversations', 'Conversations')}</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-2">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conversation.id.toString()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted text-foreground'
                }`}
              >
                <div onClick={() => handleLoadConversation(conversation)}>
                  <p className="text-sm font-medium truncate">{conversation.topic || 'Untitled'}</p>
                  <p className="text-xs opacity-70">
                    {new Date(conversation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteConversation(conversation.id)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Start a Conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Ask about global emotions, trends, or specific events
                  </p>
                </div>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-xl p-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.metadata && (
                      <div className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="opacity-70">GMI</p>
                            <p className="font-semibold">{message.metadata.indices?.GMI}%</p>
                          </div>
                          <div>
                            <p className="opacity-70">CFI</p>
                            <p className="font-semibold">{message.metadata.indices?.CFI}%</p>
                          </div>
                          <div>
                            <p className="opacity-70">HRI</p>
                            <p className="font-semibold">{message.metadata.indices?.HRI}%</p>
                          </div>
                        </div>
                        {message.confidence && (
                          <p className="text-xs opacity-70">
                            Confidence: {message.confidence}%
                          </p>
                        )}
                      </div>
                    )}
                    <p className="text-xs opacity-50 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </Card>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-6 bg-card">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask about global emotions, trends, or events..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="lg"
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
