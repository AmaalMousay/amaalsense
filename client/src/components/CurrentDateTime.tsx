import { useState, useEffect } from 'react';
import { Clock, Calendar, RefreshCw } from 'lucide-react';

interface CurrentDateTimeProps {
  showDate?: boolean;
  showTime?: boolean;
  showSeconds?: boolean;
  showTimezone?: boolean;
  isRTL?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'full';
}

// Format date in Arabic
function formatDateArabic(date: Date): string {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}، ${day} ${month} ${year}`;
}

// Format date in English
function formatDateEnglish(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

// Format time
function formatTime(date: Date, showSeconds: boolean = false): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  if (showSeconds) {
    return `${displayHours}:${minutes}:${seconds} ${ampm}`;
  }
  return `${displayHours}:${minutes} ${ampm}`;
}

// Format time in Arabic
function formatTimeArabic(date: Date, showSeconds: boolean = false): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'مساءً' : 'صباحاً';
  const displayHours = hours % 12 || 12;
  
  if (showSeconds) {
    return `${displayHours}:${minutes}:${seconds} ${ampm}`;
  }
  return `${displayHours}:${minutes} ${ampm}`;
}

// Get relative time (e.g., "منذ 5 دقائق")
export function getRelativeTime(timestamp: number, isRTL: boolean = false): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (isRTL) {
    if (seconds < 60) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
    if (hours < 24) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
  } else {
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
}

export function CurrentDateTime({ 
  showDate = true, 
  showTime = true, 
  showSeconds = false,
  showTimezone = false,
  isRTL = false,
  className = '',
  variant = 'default'
}: CurrentDateTimeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, showSeconds ? 1000 : 60000);
    
    return () => clearInterval(interval);
  }, [showSeconds]);
  
  const dateStr = isRTL ? formatDateArabic(currentTime) : formatDateEnglish(currentTime);
  const timeStr = isRTL ? formatTimeArabic(currentTime, showSeconds) : formatTime(currentTime, showSeconds);
  const timezone = showTimezone ? (isRTL ? '(توقيت ليبيا GMT+2)' : '(Libya Time GMT+2)') : '';
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <Clock className="w-3 h-3" />
        <span>{timeStr}</span>
        {showTimezone && <span className="opacity-70">{timezone}</span>}
      </div>
    );
  }
  
  if (variant === 'full') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {showDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium">{dateStr}</span>
          </div>
        )}
        {showTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{timeStr}</span>
            {showTimezone && <span className="text-xs opacity-70">{timezone}</span>}
          </div>
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showDate && (
        <div className="flex items-center gap-1.5 text-sm">
          <Calendar className="w-4 h-4 text-primary/70" />
          <span>{dateStr}</span>
        </div>
      )}
      {showTime && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{timeStr}</span>
        </div>
      )}
      {showTimezone && <span className="text-xs text-muted-foreground/70">{timezone}</span>}
    </div>
  );
}

// Last Updated component
interface LastUpdatedProps {
  timestamp: number;
  isRTL?: boolean;
  showIcon?: boolean;
  className?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function LastUpdated({ 
  timestamp, 
  isRTL = false, 
  showIcon = true,
  className = '',
  onRefresh,
  isRefreshing = false
}: LastUpdatedProps) {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(timestamp, isRTL));
  
  useEffect(() => {
    setRelativeTime(getRelativeTime(timestamp, isRTL));
    
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(timestamp, isRTL));
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [timestamp, isRTL]);
  
  return (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      {showIcon && <Clock className="w-3 h-3" />}
      <span>{isRTL ? 'آخر تحديث:' : 'Last updated:'}</span>
      <span className="font-medium">{relativeTime}</span>
      {onRefresh && (
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-accent/20 rounded transition-colors disabled:opacity-50"
          title={isRTL ? 'تحديث' : 'Refresh'}
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}

// Real-time indicator pulse
export function RealTimePulse({ isRTL = false }: { isRTL?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-xs text-green-500 font-medium">
        {isRTL ? 'مباشر' : 'LIVE'}
      </span>
    </div>
  );
}

export default CurrentDateTime;
