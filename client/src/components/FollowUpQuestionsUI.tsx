/**
 * Follow-Up Questions UI Component
 * Allows users to ask follow-up questions about predictions, recommendations, and scenarios
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, CheckCircle2, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  category: 'predictions' | 'recommendations' | 'what-if';
  question: string;
  answer?: string;
  isAnswered: boolean;
  suggestedFollowUp?: string[];
}

interface FollowUpQuestionsUIProps {
  initialQuestions?: Question[];
  onAskQuestion?: (question: string, category: string) => Promise<string>;
  isLoading?: boolean;
}

export function FollowUpQuestionsUI({ 
  initialQuestions = [], 
  onAskQuestion,
  isLoading = false 
}: FollowUpQuestionsUIProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'predictions' | 'recommendations' | 'what-if'>('predictions');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const suggestedQuestions: Record<string, Question[]> = {
    predictions: [
      {
        id: 'pred-1',
        category: 'predictions',
        question: 'What are the key indicators to watch for in the next week?',
        isAnswered: false,
        suggestedFollowUp: ['What could trigger a sudden change?', 'How reliable are these indicators?']
      },
      {
        id: 'pred-2',
        category: 'predictions',
        question: 'What is the probability of a major shift in sentiment?',
        isAnswered: false,
        suggestedFollowUp: ['What would cause such a shift?', 'How would it affect the economy?']
      },
      {
        id: 'pred-3',
        category: 'predictions',
        question: 'Which regions are most likely to be affected by these trends?',
        isAnswered: false,
        suggestedFollowUp: ['Why these regions specifically?', 'What are the consequences?']
      },
      {
        id: 'pred-4',
        category: 'predictions',
        question: 'How confident are you in these predictions?',
        isAnswered: false,
        suggestedFollowUp: ['What could make you more confident?', 'What data is missing?']
      },
      {
        id: 'pred-5',
        category: 'predictions',
        question: 'What historical precedents support these predictions?',
        isAnswered: false,
        suggestedFollowUp: ['How similar were those situations?', 'What was different?']
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        category: 'recommendations',
        question: 'Who should take action first and why?',
        isAnswered: false,
        suggestedFollowUp: ['What if they don\'t act?', 'What are the consequences?']
      },
      {
        id: 'rec-2',
        category: 'recommendations',
        question: 'What are the resource requirements for these recommendations?',
        isAnswered: false,
        suggestedFollowUp: ['How much will it cost?', 'How long will it take?']
      },
      {
        id: 'rec-3',
        category: 'recommendations',
        question: 'What are the potential side effects of these recommendations?',
        isAnswered: false,
        suggestedFollowUp: ['How can we mitigate them?', 'Are they worth it?']
      },
      {
        id: 'rec-4',
        category: 'recommendations',
        question: 'How should we measure success?',
        isAnswered: false,
        suggestedFollowUp: ['What are the KPIs?', 'How often should we review?']
      },
      {
        id: 'rec-5',
        category: 'recommendations',
        question: 'What is the timeline for implementation?',
        isAnswered: false,
        suggestedFollowUp: ['What are the milestones?', 'What could delay this?']
      }
    ],
    'what-if': [
      {
        id: 'whatif-1',
        category: 'what-if',
        question: 'What if the opposite happens?',
        isAnswered: false,
        suggestedFollowUp: ['How likely is that?', 'What would we do then?']
      },
      {
        id: 'whatif-2',
        category: 'what-if',
        question: 'What if external factors change dramatically?',
        isAnswered: false,
        suggestedFollowUp: ['Which factors are most critical?', 'How would we adapt?']
      },
      {
        id: 'whatif-3',
        category: 'what-if',
        question: 'What if we take no action?',
        isAnswered: false,
        suggestedFollowUp: ['What are the consequences?', 'How long until impact?']
      },
      {
        id: 'whatif-4',
        category: 'what-if',
        question: 'What if resources are limited?',
        isAnswered: false,
        suggestedFollowUp: ['What\'s the minimum viable action?', 'What should we prioritize?']
      },
      {
        id: 'whatif-5',
        category: 'what-if',
        question: 'What if we had more data?',
        isAnswered: false,
        suggestedFollowUp: ['What data is most critical?', 'How would it change our analysis?']
      }
    ]
  };

  const handleAskQuestion = async (question: string, category: string) => {
    if (!question.trim()) return;

    setIsSubmitting(true);
    try {
      let answer = '';
      if (onAskQuestion) {
        answer = await onAskQuestion(question, category);
      } else {
        // Simulate API call
        answer = `This is a simulated answer to: "${question}". In a real implementation, this would be powered by the AI analysis engine.`;
      }

      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        category: category as any,
        question,
        answer,
        isAnswered: true
      };

      setQuestions([...questions, newQuestion]);
      setCustomQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestedQuestion = async (question: Question) => {
    await handleAskQuestion(question.question, question.category);
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Ask Follow-Up Questions
          </CardTitle>
          <CardDescription>
            Explore predictions, recommendations, and alternative scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['predictions', 'recommendations', 'what-if'] as const).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'what-if' ? 'What-If' : category}
              </Button>
            ))}
          </div>

          {/* Custom Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Ask a custom question</label>
            <div className="flex gap-2">
              <Textarea
                placeholder={`Ask about ${selectedCategory}...`}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="min-h-20"
              />
              <Button
                onClick={() => handleAskQuestion(customQuestion, selectedCategory)}
                disabled={!customQuestion.trim() || isSubmitting}
                className="h-20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suggested Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedQuestions[selectedCategory].map(question => (
            <div
              key={question.id}
              className="border rounded-lg p-3 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleSuggestedQuestion(question)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">{question.question}</p>
                  {question.suggestedFollowUp && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {question.suggestedFollowUp.map((followUp, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {followUp}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Asked Questions & Answers */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Your Questions ({questions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions.map(question => (
              <div key={question.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                  className="w-full p-3 text-left hover:bg-accent transition-colors flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{question.question}</p>
                    <Badge variant="outline" className="mt-2 text-xs capitalize">
                      {question.category}
                    </Badge>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                </button>

                {expandedQuestion === question.id && question.answer && (
                  <div className="border-t p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {question.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isSubmitting && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Analyzing your question...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
