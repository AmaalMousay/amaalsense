/**
 * Enhanced Input Box with suggestions and animations
 */

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface EnhancedInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  'ما الأخبار الأخيرة عن الأزمة الاقتصادية؟',
  'كيف تشعر الناس تجاه السياسة الحالية؟',
  'ما تأثير التضخم على الشباب؟',
  'هل هناك تحسن في المشاعر العامة؟',
];

export function EnhancedInputBox({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = 'اسأل عن أي موضوع...',
  suggestions = DEFAULT_SUGGESTIONS,
}: EnhancedInputBoxProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      {/* Suggestions */}
      {showSuggestions && !value && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-fade-in">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-3 text-left text-sm bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-all duration-300 group"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative flex gap-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors p-1 group">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none resize-none p-3 text-sm"
            rows={1}
            style={{ maxHeight: '120px' }}
          />
          
          <Button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md m-1 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-slate-500 text-center">
        اضغط Shift + Enter للسطر الجديد
      </p>
    </div>
  );
}
