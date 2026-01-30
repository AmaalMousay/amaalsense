import { useI18n } from '@/i18n';

interface DataSource {
  name: string;
  nameAr: string;
  icon: string;
  color: string;
}

const DATA_SOURCES: DataSource[] = [
  { name: 'News API', nameAr: 'الأخبار', icon: '📰', color: '#E63946' },
  { name: 'Reddit', nameAr: 'ريديت', icon: '🔴', color: '#FF4500' },
  { name: 'Mastodon', nameAr: 'ماستودون', icon: '🐘', color: '#6364FF' },
  { name: 'Bluesky', nameAr: 'بلوسكاي', icon: '🦋', color: '#0085FF' },
  { name: 'Telegram', nameAr: 'تيليجرام', icon: '✈️', color: '#0088CC' },
  { name: 'YouTube', nameAr: 'يوتيوب', icon: '▶️', color: '#FF0000' },
];

interface DataSourcesFooterProps {
  className?: string;
  compact?: boolean;
}

export function DataSourcesFooter({ className = '', compact = false }: DataSourcesFooterProps) {
  const { isRTL } = useI18n();

  if (compact) {
    return (
      <div className={`flex items-center justify-center gap-2 text-xs text-muted-foreground ${className}`}>
        <span>{isRTL ? 'مصادر البيانات:' : 'Data Sources:'}</span>
        <div className="flex items-center gap-1">
          {DATA_SOURCES.map((source, index) => (
            <span
              key={source.name}
              title={isRTL ? source.nameAr : source.name}
              className="cursor-default"
            >
              {source.icon}
              {index < DATA_SOURCES.length - 1 && <span className="mx-0.5">·</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`border-t border-border/30 pt-6 mt-8 ${className}`}>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {isRTL ? 'مصادر البيانات المستخدمة في التحليل' : 'Data Sources Used in Analysis'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {DATA_SOURCES.map((source) => (
            <div
              key={source.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/30 hover:border-border/50 transition-colors"
            >
              <span className="text-lg">{source.icon}</span>
              <span className="text-sm text-muted-foreground">
                {isRTL ? source.nameAr : source.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/60 mt-4">
          {isRTL 
            ? 'يتم جلب البيانات وتحليلها في الوقت الفعلي باستخدام محرك DCFT الهجين'
            : 'Data is fetched and analyzed in real-time using the Hybrid DCFT Engine'
          }
        </p>
      </div>
    </div>
  );
}

export default DataSourcesFooter;
