import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useSearch } from 'wouter';
import { ContextMenu } from '@/components/ContextMenu';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { skipToken } from '@tanstack/react-query';
import { 
  Brain, Send, Loader2, ArrowLeft, TrendingUp, TrendingDown,
  AlertTriangle, Lightbulb, Target, MessageSquare, Sparkles,
  Globe, BarChart3, Activity, Zap, Maximize2, Minimize2,
  ChevronUp, ChevronDown, HelpCircle, TrendingUp as Trend
} from 'lucide-react';
import { StockStyleIndicator } from '@/components/StockStyleIndicator';
import { LogoIcon } from '@/components/Logo';
import { EmotionalIntelligenceCard } from '@/components/EmotionalIntelligenceCard';
import { QuestionClarificationDialog } from '@/components/QuestionClarificationDialog';
import { ContextualUnderstandingCard } from '@/components/ContextualUnderstandingCard';
import { FollowUpQuestionsUI } from '@/components/FollowUpQuestionsUI';
import { WhatIfScenariosUI } from '@/components/WhatIfScenariosUI';
import { PredictionsRecommendationsUI } from '@/components/PredictionsRecommendationsUI';
import { StructuredResponseUI } from '@/components/StructuredResponseUI';
import { AnalysisSkeleton } from '@/components/AnalysisSkeleton';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { Streamdown } from 'streamdown';
import ResultsPage from './ResultsPage';

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
  const [showResultsPage, setShowResultsPage] = useState(false);
  
  // Question Clarification Dialog state
  const [showClarificationDialog, setShowClarificationDialog] = useState(false);
  const [clarificationOptions, setClarificationOptions] = useState<Array<{ id: string; text: string; confidence?: number }>>([]);
  const [originalQuestion, setOriginalQuestion] = useState('');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Conversation ID for saving
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>();
  
  // tRPC mutations - using unified engine
  const analyzeWithAI = trpc.engine.smartAnalyze.useMutation();
  const askFollowUp = trpc.engine.smartAnalyze.useMutation();
  const createConversation = trpc.conversations.create.useMutation();
  const addMessage = trpc.conversations.addMessage.useMutation();
  const getConversation = trpc.conversations.get.useQuery(
    currentConversationId ? { id: currentConversationId } : skipToken,
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
  
  const runAnalysis = useCallback(async () => {
    if (!topic) return;
    
    setIsAnalyzing(true);
    setConversation([]);
    setCurrentConversationId(undefined);
    
    try {
      const result = await analyzeWithAI.mutateAsync({ 
        query: topic,
        language: 'ar'
      });
      
      // Extract response and metadata from the network engine
      const response = result.response || 'Analysis processing...';
      
      // Set context with real data from the network engine
      setContext({
        topic: topic,
        gmi: result.gmi || 0,
        cfi: result.cfi || 50,
        hri: result.hri || 50,
        dominantEmotion: result.dominantEmotion || 'neutral',
        emotionVector: result.emotions || {},
        confidence: result.confidence || 50,
        detectedCountry: 'Global',
      });
      setAnalysisData(result);
      
      // Add AI's initial response to conversation
      setConversation([{
        role: 'assistant',
        content: response || 'Analysis processing...',
        timestamp: Date.now(),
      }]);
      
      setAnalysisComplete(true);
      setShowResultsPage(true); // Show comprehensive results page
      
      // Save conversation to database
      try {
        const conv = await createConversation.mutateAsync({
          topic: topic,
          countryCode: 'LY',
          initialAnalysis: {
            gmi: 50,
            cfi: 50,
            hri: 50,
            dominantEmotion: 'neutral',
            aiResponse: response || '',
          },
        });
        setCurrentConversationId(conv.id);
      } catch (saveError) {
        console.warn('Failed to save conversation:', saveError);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
      
      let userFriendlyMessage: string;
      if (errorMessage.includes('usage exhausted') || errorMessage.includes('412') || errorMessage.includes('precondition')) {
        userFriendlyMessage = isRTL 
          ? '\u26a0\ufe0f تم الوصول للحد الأقصى من استخدام الذكاء الاصطناعي مؤقتاً. يرجى المحاولة بعد قليل.'
          : '\u26a0\ufe0f AI usage limit temporarily reached. Please try again shortly.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        userFriendlyMessage = isRTL
          ? '\u23f0 استغرق التحليل وقتاً أطول من المتوقع. جرب موضوعاً أبسط أو أعد المحاولة.'
          : '\u23f0 Analysis took longer than expected. Try a simpler topic or retry.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED')) {
        userFriendlyMessage = isRTL
          ? '\ud83d\udce1 خطأ في الاتصال. تحقق من اتصالك بالإنترنت وأعد المحاولة.'
          : '\ud83d\udce1 Connection error. Check your internet and try again.';
      } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        userFriendlyMessage = isRTL
          ? '\ud83d\udd0d لم يتم العثور على بيانات كافية لهذا الموضوع. جرب موضوعاً مختلفاً.'
          : '\ud83d\udd0d Not enough data found for this topic. Try a different one.';
      } else if (errorMessage.includes('500') || errorMessage.includes('internal server')) {
        userFriendlyMessage = isRTL
          ? '\ud83d\udee0\ufe0f حدث خطأ في الخادم. فريقنا يعمل على حل المشكلة. أعد المحاولة لاحقاً.'
          : '\ud83d\udee0\ufe0f Server error occurred. Our team is working on it. Try again later.';
      } else {
        userFriendlyMessage = isRTL
          ? '\u274c عذراً، حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.'
          : '\u274c Sorry, an error occurred during analysis. Please try again.';
      }
      
      setConversation([{
        role: 'assistant',
        content: userFriendlyMessage,
        timestamp: Date.now(),
      }]);
      setAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
    }
  }, [topic, analyzeWithAI, createConversation]);
  
  const handleClarificationSelect = (clarificationId: string) => {
    const selectedClarification = clarificationOptions.find(opt => opt.id === clarificationId);
    if (selectedClarification) {
      handleAskQuestion(selectedClarification.text);
    }
    setShowClarificationDialog(false);
  };
  
  const handleAskQuestion = useCallback(async (questionText?: string) => {
    const question = questionText || userQuestion.trim();
    if (!question || !context || isAskingFollowUp) return;
    
    setUserQuestion('');
    
    // Check if we need to show clarification dialog
    if (analysisData?.data?.questionUnderstanding?.needsClarification && 
        analysisData?.data?.questionUnderstanding?.clarifications &&
        !questionText) {
      setOriginalQuestion(question);
      setClarificationOptions(
        analysisData.data.questionUnderstanding.clarifications.map((clarif: any, idx: number) => ({
          id: `clarif-${idx}`,
          text: clarif.text || clarif,
          confidence: clarif.confidence,
        }))
      );
      setShowClarificationDialog(true);
      return;
    }
    
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
        query: question,
        language: 'ar',
      });
      
      // Add AI response to conversation
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: result.response || 'Processing...',
        timestamp: Date.now(),
      }]);
    } catch (error) {
      console.error('Follow-up failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
      
      let userFriendlyMessage: string;
      if (errorMessage.includes('usage exhausted') || errorMessage.includes('412') || errorMessage.includes('precondition')) {
        userFriendlyMessage = isRTL
          ? '\u26a0\ufe0f \u062a\u0645 \u0627\u0644\u0648\u0635\u0648\u0644 \u0644\u0644\u062d\u062f \u0627\u0644\u0623\u0642\u0635\u0649 \u0645\u0646 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0628\u0639\u062f \u0642\u0644\u064a\u0644.'
          : '\u26a0\ufe0f AI usage limit reached. Please try again shortly.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        userFriendlyMessage = isRTL
          ? '\u23f0 \u0627\u0633\u062a\u063a\u0631\u0642 \u0627\u0644\u0637\u0644\u0628 \u0648\u0642\u062a\u0627\u064b \u0637\u0648\u064a\u0644\u0627\u064b. \u062c\u0631\u0628 \u0633\u0624\u0627\u0644\u0627\u064b \u0623\u0642\u0635\u0631.'
          : '\u23f0 Request took too long. Try a shorter question.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userFriendlyMessage = isRTL
          ? '\ud83d\udce1 \u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644. \u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0625\u0646\u062a\u0631\u0646\u062a \u0648\u0623\u0639\u062f \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629.'
          : '\ud83d\udce1 Connection error. Check your internet and try again.';
      } else {
        userFriendlyMessage = isRTL
          ? '\u274c \u0639\u0630\u0631\u0627\u064b\u060c \u062d\u062f\u062b \u062e\u0637\u0623 \u0641\u064a \u0645\u0639\u0627\u0644\u062c\u0629 \u0633\u0624\u0627\u0644\u0643. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.'
          : '\u274c Sorry, I had trouble processing your question. Please try again.';
      }
      
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: userFriendlyMessage,
        timestamp: Date.now(),
      }]);
    } finally {
      setIsAskingFollowUp(false);
    }
  }, [context, userQuestion, analysisData, askFollowUp, isAskingFollowUp]);
  
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
      {/* Question Clarification Dialog */}
      <QuestionClarificationDialog
        isOpen={showClarificationDialog}
        originalQuestion={originalQuestion}
        clarifications={clarificationOptions}
        onSelect={handleClarificationSelect}
        onCancel={() => setShowClarificationDialog(false)}
        isLoading={isAskingFollowUp}
      />
      
      {/* Conversation Sidebar */}
      <ConversationSidebar
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
      
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 md:w-10 md:h-10"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <LogoIcon className="w-6 h-6 md:w-8 md:h-8" />
                <span className="font-bold text-base md:text-xl">AmalSense</span>
              </div>
            </div>
            {/* Hide subtitle on mobile */}
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Conversational Intelligence Agent</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Topic Banner */}
      {topic && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 md:py-3">
          <div className="container">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
              <span className="text-sm md:text-lg font-medium">
                <span className="hidden md:inline">Analyzing: </span>
                <span className="text-primary break-all">{topic}</span>
              </span>
              {context?.detectedCountry && (
                <span className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3 md:w-4 md:h-4" />
                  {context.detectedCountry}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content - Split Layout */}
      <main className="container py-4 md:py-6">
        <div className={`flex ${isChatExpanded ? 'flex-col' : 'flex-col md:flex-row'} gap-4 md:gap-0 min-h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]`}>
          
          {/* Left Panel - Metrics & Indicators (hidden when chat expanded) */}
          {!isChatExpanded && (
            <ContextMenu className="flex-1 space-y-3 md:space-y-4 overflow-y-auto p-3 md:p-4 md:pr-4 rounded-xl border-2 border-accent/30 bg-gradient-to-br from-card/80 to-card/40 shadow-lg shadow-accent/5 max-h-[40vh] md:max-h-none">
              <h2 className="text-base md:text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Analysis Results
              </h2>
              
              {isAnalyzing ? (
                <div className="space-y-4">
                  <AnalysisSkeleton variant="compact" />
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
          
          {/* Vertical Divider - Visible separator between panels (hidden on mobile) */}
          {!isChatExpanded && (
            <div className="hidden md:flex flex-col items-center justify-center px-2">
              <div className="w-1 h-full bg-gradient-to-b from-primary/30 via-primary/60 to-primary/30 rounded-full" />
            </div>
          )}
          
          {/* Right Panel - AI Chat */}
          <div 
            className={`flex flex-col rounded-xl border-2 border-primary/30 bg-gradient-to-br from-card/80 to-card/40 p-3 md:p-4 shadow-lg shadow-primary/5 transition-all duration-300 ${isChatExpanded ? 'w-full' : 'flex-1'}`}
            style={{ 
              minHeight: '300px'
            }}
          >
          <ContextMenu className="flex flex-col h-full">
            {/* Chat Header with Controls */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span className="hidden sm:inline">AmalSense AI</span>
                <span className="sm:hidden">AI</span>
              </h2>
              <div className="flex items-center gap-1 md:gap-2">
                {/* Height adjustment buttons - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/30 text-primary"
                    onClick={() => adjustChatHeight('up')}
                    title="توسيع الدردشة ↑"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </Button>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-sm font-bold text-primary">{chatHeight}%</span>
                    <span className="text-[10px] text-muted-foreground">حجم</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/30 text-primary"
                    onClick={() => adjustChatHeight('down')}
                    title="تصغير الدردشة ↓"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
                {/* Full expand toggle */}
                <Button
                  variant={isChatExpanded ? "default" : "outline"}
                  size="sm"
                  className="h-7 md:h-8 gap-1 text-xs"
                  onClick={toggleChatExpansion}
                  title={isChatExpanded ? "إظهار المؤشرات" : "ملء الشاشة"}
                >
                  {isChatExpanded ? <Minimize2 className="w-3 h-3 md:w-4 md:h-4" /> : <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />}
                  <span className="hidden sm:inline text-xs">{isChatExpanded ? 'إظهار المؤشرات' : 'ملء الشاشة'}</span>
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            >
              {isAnalyzing ? (
                <AnalysisSkeleton variant="chat" />
              ) : conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <Brain className="w-16 h-16 opacity-30" />
                  <p className="text-center">
                    I'm your Collective Emotional Intelligence Agent.<br />
                    I'll analyze the topic and explain what the data means.
                  </p>
                </div>
              ) : (
                <>
                  <ContextualUnderstandingCard 
                    contextual={analysisData?.data?.humanLikeAI?.contextualUnderstanding || analysisData?.data?.humanIntelligence?.contextualUnderstanding}
                  />
                  <EmotionalIntelligenceCard 
                    emotional={analysisData?.data?.emotionalIntelligence || analysisData?.data?.humanLikeAI?.emotionalIntelligence || analysisData?.data?.humanIntelligence?.emotionalIntelligence}
                    confidence={analysisData?.data?.confidence}
                  />
                  {conversation.map((msg, index) => (
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
                ))}
                </>
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
            
            {/* Structured Response */}
            {analysisComplete && analysisData?.data && (
              <StructuredResponseUI 
                analysis={analysisData.data} 
                isLoading={isAnalyzing} 
                error={undefined}
              />
            )}

            {/* Follow-up Questions */}
            {analysisComplete && (analysisData?.data?.humanLikeAI?.proactiveSuggestions?.followUpQuestions || analysisData?.data?.humanIntelligence?.proactiveSuggestions) && (
              <FollowUpQuestionsUI 
                initialQuestions={(analysisData.data.humanLikeAI?.proactiveSuggestions?.followUpQuestions || analysisData.data.humanIntelligence?.proactiveSuggestions || []).map((s: any) => ({ id: Math.random().toString(), text: typeof s === 'string' ? s : s.question || '', category: 'suggestion' as const }))}
                onAskQuestion={async (question: string) => { await handleAskQuestion(question); return ''; }}
                isLoading={isAskingFollowUp}
              />
            )}

            {/* Predictions & Recommendations */}
            {analysisComplete && analysisData?.data && (
              <PredictionsRecommendationsUI 
                predictions={analysisData.data.predictions || []}
                recommendations={analysisData.data.recommendations || []}
                isLoading={isAnalyzing}
              />
            )}

            {/* What-If Scenarios */}
            {analysisComplete && analysisData?.data && (
              <WhatIfScenariosUI 
                scenarios={analysisData.data.scenarios || []}
                onScenarioSelect={(scenarioId: string) => handleAskQuestion(`ماذا لو ${scenarioId}?`)}
                isLoading={isAskingFollowUp}
              />
            )}

            {/* Feedback Widget */}
            {analysisComplete && context && (
              <FeedbackWidget 
                question={context.topic || ''}
                response={conversation.filter(m => m.role === 'assistant').map(m => m.content).join('\n').substring(0, 5000)}
                topic={context.topic}
                dominantEmotion={analysisData?.data?.emotionAnalysis?.dominant}
                responseConfidence={analysisData?.data?.confidence?.overall}
              />
            )}

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
            
            {/* Smart Suggestions from AI */}
            {((analysisData?.data?.humanLikeAI?.proactiveSuggestions?.followUpQuestions?.length > 0) || (analysisData?.data?.humanIntelligence?.proactiveSuggestions?.length > 0)) && (
              <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Smart Suggestions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(analysisData.data.humanLikeAI?.proactiveSuggestions?.followUpQuestions || analysisData.data.humanIntelligence?.proactiveSuggestions || []).map((suggestion: any, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1 hover:bg-primary/20 hover:border-primary/50 bg-primary/10"
                      onClick={() => handleAskQuestion(typeof suggestion === 'string' ? suggestion : suggestion.question || '')}
                    >
                      <Lightbulb className="w-3 h-3" />
                      {(typeof suggestion === 'string' ? suggestion : suggestion.question || '').substring(0, 30)}...
                    </Button>
                  ))}
                </div>
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
                  disabled={isAskingFollowUp}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  onClick={() => handleAskQuestion()}
                  disabled={!userQuestion.trim() || isAskingFollowUp}
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
        </div>
      </main>
    </div>
    </>
  );
}
