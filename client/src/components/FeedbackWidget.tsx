import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface FeedbackWidgetProps {
  question: string;
  response: string;
  topic?: string;
  dominantEmotion?: string;
  responseConfidence?: number;
}

export function FeedbackWidget({ question, response, topic, dominantEmotion, responseConfidence }: FeedbackWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [wasHelpful, setWasHelpful] = useState<"yes" | "no" | "partial" | null>(null);
  const [wasAccurate, setWasAccurate] = useState<"yes" | "no" | "unsure" | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.metaLearning.submitResponseFeedback.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = () => {
    if (rating === 0) return;
    
    submitMutation.mutate({
      question: question.substring(0, 5000),
      response: response.substring(0, 5000),
      rating,
      wasHelpful: wasHelpful || undefined,
      wasAccurate: wasAccurate || undefined,
      comment: comment || undefined,
      topic: topic || undefined,
      dominantEmotion: dominantEmotion || undefined,
      responseConfidence: responseConfidence || undefined,
    });
  };

  if (submitted) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-400 text-sm font-medium">شكراً لتقييمك! يساعدنا هذا في تحسين دقة التحليل</span>
        </CardContent>
      </Card>
    );
  }

  if (!isExpanded) {
    return (
      <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setIsExpanded(true)}>
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>هل كان هذا التحليل مفيداً؟ قيّم لتحسين الدقة</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); setWasHelpful("yes"); setRating(5); setIsExpanded(true); }}>
              <ThumbsUp className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); setWasHelpful("no"); setRating(2); setIsExpanded(true); }}>
              <ThumbsDown className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">تقييم التحليل</h4>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setIsExpanded(false)}>إغلاق</Button>
        </div>

        {/* Star Rating */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">التقييم العام</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-0.5 transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs text-muted-foreground mr-2 self-center">
              {rating > 0 ? ['', 'ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'][rating] : ''}
            </span>
          </div>
        </div>

        {/* Quick Feedback Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">هل كان مفيداً؟</label>
            <div className="flex gap-1">
              {[
                { value: "yes" as const, label: "نعم", icon: ThumbsUp, color: "text-green-500" },
                { value: "partial" as const, label: "جزئياً", icon: null, color: "text-yellow-500" },
                { value: "no" as const, label: "لا", icon: ThumbsDown, color: "text-red-500" },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  variant={wasHelpful === opt.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs flex-1"
                  onClick={() => setWasHelpful(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">هل كان دقيقاً؟</label>
            <div className="flex gap-1">
              {[
                { value: "yes" as const, label: "نعم" },
                { value: "unsure" as const, label: "غير متأكد" },
                { value: "no" as const, label: "لا" },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  variant={wasAccurate === opt.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs flex-1"
                  onClick={() => setWasAccurate(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">ملاحظات إضافية (اختياري)</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="أخبرنا كيف يمكننا تحسين التحليل..."
            className="h-16 text-sm resize-none"
            maxLength={1000}
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || submitMutation.isPending}
          className="w-full"
          size="sm"
        >
          {submitMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              جاري الإرسال...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              إرسال التقييم
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
