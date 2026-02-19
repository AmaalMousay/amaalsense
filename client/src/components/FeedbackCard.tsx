import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, Send, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface FeedbackCardProps {
  conversationId: number;
  onSubmit?: () => void;
}

export function FeedbackCard({ conversationId, onSubmit }: FeedbackCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<'accuracy' | 'clarity' | 'helpfulness' | 'tone' | 'other'>('accuracy');
  const [isPositive, setIsPositive] = useState(true);

  const submitFeedback = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      // Call feedback API
      // await submitFeedbackMutation.mutateAsync({
      //   conversationId,
      //   rating,
      //   comment,
      //   category,
      //   isPositive,
      // });

      setRating(0);
      setComment('');
      setCategory('accuracy');
      setIsPositive(true);
      setIsOpen(false);
      onSubmit?.();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full animate-fade-in"
      >
        💬 Share Feedback
      </Button>
    );
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 animate-card-slide-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-blue-400">Share Your Feedback</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            How helpful was this response?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`transition-all ${
                  rating >= star
                    ? 'text-yellow-400 scale-110'
                    : 'text-muted-foreground hover:text-yellow-300'
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Sentiment */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Was this response helpful?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPositive(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                isPositive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              Yes
            </button>
            <button
              onClick={() => setIsPositive(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                !isPositive
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              No
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground"
          >
            <option value="accuracy">Accuracy</option>
            <option value="clarity">Clarity</option>
            <option value="helpfulness">Helpfulness</option>
            <option value="tone">Tone</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Comment */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Comment (optional)
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what could be improved..."
            className="min-h-20 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={submitFeedback}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}
