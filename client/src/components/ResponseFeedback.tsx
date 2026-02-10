import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, X } from 'lucide-react';

interface ResponseFeedbackProps {
  messageId: number;
  onSubmit?: (feedback: {
    messageId: number;
    rating: 'helpful' | 'not_helpful' | 'neutral';
    comment?: string;
  }) => void;
}

export const ResponseFeedback: React.FC<ResponseFeedbackProps> = ({
  messageId,
  onSubmit,
}) => {
  const [rating, setRating] = useState<'helpful' | 'not_helpful' | 'neutral' | null>(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRating = (newRating: 'helpful' | 'not_helpful' | 'neutral') => {
    setRating(newRating);
    if (newRating === 'neutral') {
      submitFeedback(newRating);
    } else {
      setShowCommentDialog(true);
    }
  };

  const submitFeedback = (feedbackRating: 'helpful' | 'not_helpful' | 'neutral') => {
    onSubmit?.({
      messageId,
      rating: feedbackRating,
      comment: comment || undefined,
    });
    setIsSubmitted(true);
    setComment('');
    setRating(null);
    setShowCommentDialog(false);

    // Reset after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 2000);
  };

  const handleSubmitComment = () => {
    if (rating) {
      submitFeedback(rating);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-500/50 bg-green-500/10">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-green-600">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">شكراً لتقييمك!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">هل كانت الإجابة مفيدة؟</CardTitle>
          <CardDescription className="text-xs">
            ساعدنا في تحسين النظام بتقييمك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={rating === 'helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRating('helpful')}
              className="flex-1"
            >
              <ThumbsUp className="h-4 w-4 ml-2" />
              نعم
            </Button>
            <Button
              variant={rating === 'not_helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRating('not_helpful')}
              className="flex-1"
            >
              <ThumbsDown className="h-4 w-4 ml-2" />
              لا
            </Button>
            <Button
              variant={rating === 'neutral' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRating('neutral')}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 ml-2" />
              محايد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {rating === 'helpful' ? 'ما الذي أعجبك؟' : 'كيف يمكننا التحسن؟'}
            </DialogTitle>
            <DialogDescription>
              {rating === 'helpful'
                ? 'شارك معنا ما أعجبك في هذه الإجابة'
                : 'أخبرنا كيف يمكننا تحسين التحليل'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="اكتب تعليقك هنا..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCommentDialog(false)}
              >
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
              <Button
                onClick={handleSubmitComment}
                className="ml-auto"
              >
                <Send className="h-4 w-4 ml-2" />
                إرسال التقييم
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
