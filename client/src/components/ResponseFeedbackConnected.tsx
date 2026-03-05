// @ts-nocheck
/**
 * RESPONSE FEEDBACK - CONNECTED VERSION
 * 
 * يعرض تقييمات الاستجابة مع بيانات حقيقية من الخادم
 * - يستخدم explainabilityRouter.getResponseFeedback للحصول على البيانات
 * - يسمح بإرسال تقييمات جديدة
 * - يعرض إحصائيات الجودة
 */

import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Feedback {
  id: string;
  responseId: string;
  rating: number;
  helpful: boolean;
  accurate: boolean;
  complete: boolean;
  comment: string;
  userRole: string;
  timestamp: Date;
}

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  helpfulCount: number;
  accurateCount: number;
  completeCount: number;
  ratingsDistribution: Record<number, number>;
}

interface ResponseFeedbackConnectedProps {
  responseId: string;
  onFeedbackSubmitted?: (feedback: Feedback) => void;
}

export function ResponseFeedbackConnected({
  responseId,
  onFeedbackSubmitted
}: ResponseFeedbackConnectedProps) {
  const [userRating, setUserRating] = React.useState<number>(0);
  const [isHelpful, setIsHelpful] = React.useState<boolean | null>(null);
  const [isAccurate, setIsAccurate] = React.useState<boolean | null>(null);
  const [isComplete, setIsComplete] = React.useState<boolean | null>(null);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  // Fetch feedback data
  const { data: feedbackData, isLoading, error } = trpc.explainability.getResponseFeedback.useQuery({
    responseId
  });

  const feedbackStats = feedbackData?.stats;
  const existingFeedback = feedbackData?.feedback || [];

  // Submit feedback mutation
  const submitFeedbackMutation = trpc.explainability.submitResponseFeedback.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(data);
      }
      // Reset form after 2 seconds
      setTimeout(() => {
        setUserRating(0);
        setIsHelpful(null);
        setIsAccurate(null);
        setIsComplete(null);
        setComment('');
        setSubmitted(false);
      }, 2000);
    }
  });

  const handleSubmitFeedback = () => {
    if (userRating === 0) {
      alert('يرجى تقييم الاستجابة');
      return;
    }

    submitFeedbackMutation.mutate({
      responseId,
      rating: userRating,
      helpful: isHelpful,
      accurate: isAccurate,
      complete: isComplete,
      comment
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#000000';
    if (rating >= 3) return '#333333';
    if (rating >= 2) return '#666666';
    return '#999999';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'ممتاز جداً';
    if (rating >= 3.5) return 'ممتاز';
    if (rating >= 2.5) return 'جيد';
    if (rating >= 1.5) return 'مقبول';
    return 'ضعيف';
  };

  if (isLoading) {
    return (
      <Card className="w-full p-8 bg-white border border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">جاري تحميل التقييمات...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-8 bg-white border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>خطأ في تحميل التقييمات</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Feedback Statistics */}
      {feedbackStats && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">إحصائيات التقييمات</h4>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">متوسط التقييم</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold" style={{ color: getRatingColor(feedbackStats.averageRating) }}>
                  {feedbackStats.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">/5</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{getRatingLabel(feedbackStats.averageRating)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">عدد التقييمات</p>
              <p className="text-3xl font-bold text-gray-900">{feedbackStats.totalFeedback}</p>
              <p className="text-xs text-gray-500 mt-1">تقييم</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">الموثوقية</p>
              <p className="text-3xl font-bold text-gray-900">
                {((feedbackStats.accurateCount / feedbackStats.totalFeedback) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">دقيقة</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = feedbackStats.ratingsDistribution[rating] || 0;
              const percentage = feedbackStats.totalFeedback > 0 ? (count / feedbackStats.totalFeedback) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-semibold text-gray-900">{rating}⭐</span>
                  <div className="flex-1 bg-gray-200 rounded h-2">
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getRatingColor(rating)
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold text-gray-900">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* User Feedback Form */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">قيّم هذه الاستجابة</h4>

        {submitted && (
          <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg mb-4">
            <p className="text-sm font-semibold text-gray-900">شكراً لتقييمك! تم حفظ تقييمك بنجاح.</p>
          </div>
        )}

        {/* Rating Stars */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">التقييم العام:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                className={`text-3xl transition-all ${
                  star <= userRating ? 'opacity-100' : 'opacity-30 hover:opacity-60'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              تقييمك: {userRating} نجوم - {getRatingLabel(userRating)}
            </p>
          )}
        </div>

        {/* Feedback Options */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isHelpful === true}
                onChange={(e) => setIsHelpful(e.target.checked ? true : null)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">هذه الاستجابة مفيدة</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAccurate === true}
                onChange={(e) => setIsAccurate(e.target.checked ? true : null)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">هذه الاستجابة دقيقة</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isComplete === true}
                onChange={(e) => setIsComplete(e.target.checked ? true : null)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">هذه الاستجابة شاملة</span>
            </label>
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 mb-2 block">تعليق (اختياري):</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شارك رأيك حول هذه الاستجابة..."
            className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitFeedback}
          disabled={submitFeedbackMutation.isPending || submitted}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition-all"
        >
          {submitFeedbackMutation.isPending ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </Button>
      </Card>

      {/* Existing Feedback */}
      {existingFeedback.length > 0 && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">تقييمات المستخدمين</h4>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {existingFeedback.map((feedback, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < feedback.rating ? 'text-gray-900' : 'text-gray-300'}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(feedback.timestamp).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {feedback.helpful && (
                      <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded font-semibold">
                        مفيد
                      </span>
                    )}
                    {feedback.accurate && (
                      <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded font-semibold">
                        دقيق
                      </span>
                    )}
                  </div>
                </div>

                {feedback.comment && (
                  <p className="text-sm text-gray-700 mt-2">{feedback.comment}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
