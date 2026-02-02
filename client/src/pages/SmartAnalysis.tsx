import { useState, useEffect, useRef } from 'react';
import { ContextMenu } from '@/components/ContextMenu';
import { useLocation, useSearch } from 'wouter';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Brain, Send, Loader2, ArrowLeft, TrendingUp, TrendingDown,
  AlertTriangle, Lightbulb, Target, MessageSquare, Sparkles,
  Globe, BarChart3, Activity, Zap, Maximize2, Minimize2,
  ChevronUp, ChevronDown, HelpCircle, TrendingUp as Trend
} from 'lucide-react';
import { StockStyleIndicator } from '@/components/StockStyleIndicator';
import { LogoIcon } from '@/components/Logo';
import { Streamdown } from 'streamdown';

// Types for conversation
interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface AnalysisContext {
  topic: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  emotionVector?: Record<string, number>;
  confidence: number;
  detectedCountry?: string;
}

// Quick question buttons
const quickQuestions = [
  { icon: Target, label: 'ما التوصية؟', question: 'ما هي توصيتك بناءً على هذا التحليل؟' },
  { icon: AlertTriangle, label: 'ما المخاطر؟', question: 'ما هي المخاطر المحتملة التي يجب الانتباه لها؟' },
  { icon: Trend, label: 'التوقعات', question: 'ما هي التوقعات للأيام القادمة؟' },
  { icon: HelpCircle, label: 'ماذا لو؟', question: 'ماذا لو تغيرت الظروف أو ظهرت أخبار جديدة؟' },
];

export default function SmartAnalysis() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const topic = params.get('topic') || '';
  
  // State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [context, setContext] = useState<AnalysisContext | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);
  
  // Chat expansion state
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatHeight, setChatHeight] = useState(50); // percentage
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Conversation ID for saving
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>();
  
  // tRPC mutations
  const analyzeWithAI = trpc.conversationalAI.analyzeWithAI.useMutation();
  const askFollowUp = trpc.conversationalAI.askFollowUp.useMutation();
  const createConversation = trpc.conversations.create.useMutation();
  const addMessage = trpc.conversations.addMessage.useMutation();
  const getConversation = trpc.conversations.get.useQuery(
    { id: currentConversationId! },
    { enabled: !!currentConversationId && !topic }
  );
  
  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);
  
  // Start analysis when page loads with topic
  useEffect(() => {
    if (topic && !analysisComplete && !isAnalyzing) {
      runAnalysis();
    }
  }, [topic]);
  
  const runAnalysis = async () => {
    if (!topic) return;
    
    setIsAnalyzing(true);
    setConversation([]);
    setCurrentConversationId(undefined);
    
    try {
      const result = await analyzeWithAI.mutateAsync({ topic });
      
      setContext(result.context);
      setAnalysisData(result.analysis);
      
      // Add AI's initial response to conversation
      setConversation([{
        role: 'assistant',
        content: result.aiResponse as string,
        timestamp: Date.now(),
      }]);
      
      setAnalysisComplete(true);
      
      // Save conversation to database
      try {
        const conv = await createConversation.mutateAsync({
          topic,
          countryCode: result.context.detectedCountry,
          initialAnalysis: {
            gmi: result.context.gmi,
            cfi: result.context.cfi,
            hri: result.context.hri,
            dominantEmotion: result.context.dominantEmotion,
            aiResponse: result.aiResponse as string,
          },
        });
        setCurrentConversationId(conv.id);
      } catch (saveError) {
        console.warn('Failed to save conversation:', saveError);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setConversation([{
        role: 'assistant',
        content: 'Sorry, I encountered an error while analyzing this topic. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleAskQuestion = async (questionText?: string) => {
    const question = questionText || userQuestion.trim();
    if (!question || !context || isAskingFollowUp) return;
    
    setUserQuestion('');
    
    // Add user message to conversation
    const userMessage: ConversationMessage = {
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };
    setConversation(prev => [...prev, userMessage]);
    
    setIsAskingFollowUp(true);
    
    try {
      const result = await askFollowUp.mutateAsync({
        question,
        context,
        conversationHistory: conversation,
      });
      
      // Add AI response to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: result.aiResponse as string,
        timestamp: result.timestamp,
      }]);
    } catch (error) {
      console.error('Follow-up failed:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble processing your question. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsAskingFollowUp(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  // Handle quick question click
  const handleQuickQuestion = (question: string) => {
    handleAskQuestion(question);
  };
  
  // Toggle chat expansion
  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
    setChatHeight(isChatExpanded ? 50 : 80);
  };

  // Adjust chat height
  const adjustChatHeight = (direction: 'up' | 'down') => {
    setChatHeight(prev => {
      if (direction === 'up') return Math.min(90, prev + 15);
      return Math.max(30, prev - 15);
    });
  };
  
  // Get emotion color
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joy: 'text-yellow-400',
      hope: 'text-green-400',
      fear: 'text-orange-400',
      anger: 'text-red-400',
      sadness: 'text-blue-400',
      curiosity: 'text-purple-400',
      neutral: 'text-gray-400',
    };
    return colors[emotion.toLowerCase()] || 'text-gray-400';
  };
  
  // Get GMI color
  const getGMIColor = (gmi: number): string => {
    if (gmi > 30) return 'text-green-400';
    if (gmi > 0) return 'text-emerald-400';
    if (gmi > -30) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Get CFI color
  const getCFIColor = (cfi: number): string => {
    if (cfi > 70) return 'text-red-400';
    if (cfi > 50) return 'text-orange-400';
    if (cfi > 30) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  // Get HRI color
  const getHRIColor = (hri: number): string => {
    if (hri > 70) return 'text-green-400';
    if (hri > 50) return 'text-emerald-400';
    if (hri > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Handle selecting a conversation from sidebar
  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id);
    // Clear current state and load the conversation
    setAnalysisComplete(false);
    setIsAnalyzing(false);
    setContext(null);
    setAnalysisData(null);
    setConversation([]);
    // Navigate without topic to load from conversation
    navigate('/smart-analysis');
  };

  // Handle new conversation
  const handleNewConversation = () => {
    setCurrentConversationId(undefined);
    setAnalysisComplete(false);
    setIsAnalyzing(false);
    setContext(null);
    setAnalysisData(null);
    setConversation([]);
    navigate('/');
  };

  // Load conversation when ID changes (from sidebar)
  useEffect(() => {
    if (getConversation.data && !topic) {
      const conv = getConversation.data;
      // Restore context from conversation
      setContext({
        topic: conv.topic,
        gmi: conv.lastGmi || 0,
        cfi: conv.lastCfi || 0,
        hri: conv.lastHri || 0,
        dominantEmotion: conv.dominantEmotion || 'neutral',
        confidence: 80,
        detectedCountry: conv.countryCode || undefined,
      });
      // Restore messages
      const messages: ConversationMessage[] = conv.messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
        timestamp: new Date(m.createdAt).getTime(),
      }));
      setConversation(messages);
      setAnalysisComplete(true);
    }
  }, [getConversation.data, topic]);

  return (
    <>
      {/* Conversation Sidebar */}
      <ConversationSidebar
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
      
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <LogoIcon className="w-8 h-8" />
                <span className="font-bold text-xl">AmalSense AI</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Conversational Intelligence Agent</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Topic Banner */}
      {topic && (
        <div className="bg-primary/10 border-b border-primary/20 py-3">
          <div className="container">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-lg font-medium">Analyzing: <span className="text-primary">{topic}</span></span>
              {context?.detectedCountry && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {context.detectedCountry}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content - Split Layout */}
      <main className="container py-6">
        <div className={`grid grid-cols-1 ${isChatExpanded ? '' : 'lg:grid-cols-2'} gap-6 h-[calc(100vh-200px)]`}>
          
          {/* Left Panel - Metrics & Indicators (hidden when chat expanded) */}
          {!isChatExpanded && (
            <ContextMenu className="space-y-4 overflow-y-auto pr-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analysis Results
              </h2>
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Analyzing collective emotions...</p>
                </div>
              ) : context ? (
                <>
                  {/* Main Indices */}
                  <div className="grid grid-cols-1 gap-4">
                    <StockStyleIndicator
                      title="Global Mood Index"
                      shortName="GMI"
                      value={context.gmi}
                      previousValue={0}
                      min={-100}
                      max={100}
                      description="Overall collective sentiment"
                      indexType="gmi"
                      historicalData={[]}
                      isLoading={false}
                    />
                    <StockStyleIndicator
                      title="Collective Fear Index"
                      shortName="CFI"
                      value={context.cfi}
                      previousValue={50}
                      min={0}
                      max={100}
                      description="Level of collective anxiety"
                      indexType="cfi"
                      historicalData={[]}
                      isLoading={false}
                    />
                    <StockStyleIndicator
                      title="Hope Resilience Index"
                      shortName="HRI"
                      value={context.hri}
                      previousValue={50}
                      min={0}
                      max={100}
                      description="Societal optimism & resilience"
                      indexType="hri"
                      historicalData={[]}
                      isLoading={false}
                    />
                  </div>
                  
                  {/* Quick Stats */}
                  <Card className="p-4 bg-card/50">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Quick Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Dominant Emotion:</span>
                        <span className={`font-medium capitalize ${getEmotionColor(context.dominantEmotion)}`}>
                          {context.dominantEmotion}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-medium">{context.confidence}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Overall Mood:</span>
                        <span className={`font-medium ${getGMIColor(context.gmi)}`}>
                          {context.gmi > 30 ? 'Positive' : context.gmi > 0 ? 'Slightly Positive' : context.gmi > -30 ? 'Neutral' : 'Negative'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Fear Level:</span>
                        <span className={`font-medium ${getCFIColor(context.cfi)}`}>
                          {context.cfi > 70 ? 'High' : context.cfi > 50 ? 'Elevated' : context.cfi > 30 ? 'Moderate' : 'Low'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Hope Level:</span>
                        <span className={`font-medium ${getHRIColor(context.hri)}`}>
                          {context.hri > 70 ? 'Strong' : context.hri > 50 ? 'Moderate' : context.hri > 30 ? 'Weak' : 'Very Low'}
                        </span>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Emotion Vector */}
                  {context.emotionVector && Object.keys(context.emotionVector).length > 0 && (
                    <Card className="p-4 bg-card/50">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Emotion Distribution
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(context.emotionVector).map(([emotion, value]) => (
                          <div key={emotion} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground capitalize w-20">{emotion}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  emotion === 'joy' ? 'bg-yellow-400' :
                                  emotion === 'hope' ? 'bg-green-400' :
                                  emotion === 'fear' ? 'bg-orange-400' :
                                  emotion === 'anger' ? 'bg-red-400' :
                                  emotion === 'sadness' ? 'bg-blue-400' :
                                  'bg-purple-400'
                                }`}
                                style={{ width: `${Math.abs(value as number) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-12 text-right">
                              {((value as number) * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 opacity-50" />
                  <p>Enter a topic to start analysis</p>
                </div>
              )}
            </ContextMenu>
          )}
          
          {/* Right Panel - AI Chat */}
          <ContextMenu className={`flex flex-col h-full ${!isChatExpanded ? 'border-l border-border/50 pl-6' : ''}`}>
            {/* Chat Header with Controls */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                AmalSense AI
              </h2>
              <div className="flex items-center gap-1">
                {/* Height adjustment buttons */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => adjustChatHeight('up')}
                  title="Expand chat"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => adjustChatHeight('down')}
                  title="Shrink chat"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {/* Full expand toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleChatExpansion}
                  title={isChatExpanded ? "Show metrics" : "Full screen chat"}
                >
                  {isChatExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4"
              style={{ maxHeight: `${chatHeight}vh` }}
            >
              {isAnalyzing ? (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-muted-foreground">Analyzing and preparing insights...</span>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <Brain className="w-16 h-16 opacity-30" />
                  <p className="text-center">
                    I'm your Collective Emotional Intelligence Agent.<br />
                    I'll analyze the topic and explain what the data means.
                  </p>
                </div>
              ) : (
                conversation.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-accent' : 'bg-primary/20'
                    }`}>
                      {msg.role === 'user' ? (
                        <span className="text-sm font-medium">You</span>
                      ) : (
                        <Brain className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <Card className={`p-4 ${
                        msg.role === 'user' 
                          ? 'bg-accent/50 border-accent/50' 
                          : 'bg-primary/5 border-primary/20'
                      }`}>
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </Card>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
              
              {/* Loading indicator for follow-up */}
              {isAskingFollowUp && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-muted-foreground">Thinking...</span>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            {/* Quick Question Buttons */}
            {analysisComplete && !isAskingFollowUp && (
              <div className="flex flex-wrap gap-2 mb-3">
                {quickQuestions.map((q, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1 hover:bg-primary/10 hover:border-primary/50"
                    onClick={() => handleQuickQuestion(q.question)}
                  >
                    <q.icon className="w-3 h-3" />
                    {q.label}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Input Area */}
            <div className="border-t border-border/50 pt-4">
              <div className="flex gap-2">
                <Input
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a follow-up question..."
                  disabled={!analysisComplete || isAskingFollowUp}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleAskQuestion()}
                  disabled={!userQuestion.trim() || !analysisComplete || isAskingFollowUp}
                  className="glow-button text-white"
                >
                  {isAskingFollowUp ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                اسأل عن التوقعات، التوصيات، أو سيناريوهات "ماذا لو"
              </p>
            </div>
          </ContextMenu>
        </div>
      </main>
    </div>
    </>
  );
}
