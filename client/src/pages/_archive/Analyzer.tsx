import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// Input replaced with native HTML input for better mobile compatibility
import { trpc } from '@/lib/trpc';
import { useLocation, useRoute } from 'wouter';
import { ArrowLeft, ArrowRight, Search, Users, MapPin, TrendingUp, TrendingDown, Minus, Globe, ChevronDown } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { EMOTION_COLORS, getEmotionColor } from '@shared/emotionColors';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { FooterLegend } from '@/components/EmotionLegend';
import { DataSourcesFooter } from '@/components/DataSourcesFooter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ContentDomainSelector, 
  EmotionalRiskMeter, 
  Disclaimer, 
  ClassificationBadge,
  SensitivityIndicator,
  type ContentDomain,
  getDomainConfig
} from '@/components/ContentClassification';

// Country list for selection - organized by region (150+ countries)
const COUNTRIES = [
  // الشرق الأوسط وشمال أفريقيا (Middle East & North Africa)
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', region: 'MENA' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', region: 'MENA' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', region: 'MENA' },
  { code: 'AE', name: 'UAE', nameAr: 'الإمارات', region: 'MENA' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', region: 'MENA' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', region: 'MENA' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', region: 'MENA' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', region: 'MENA' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', region: 'MENA' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', region: 'MENA' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', region: 'MENA' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', region: 'MENA' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', region: 'MENA' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', region: 'MENA' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', region: 'MENA' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', region: 'MENA' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', region: 'MENA' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', region: 'MENA' },
  { code: 'IR', name: 'Iran', nameAr: 'إيران', region: 'MENA' },
  { code: 'IL', name: 'Israel', nameAr: 'إسرائيل', region: 'MENA' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', region: 'MENA' },
  
  // أوروبا (Europe)
  { code: 'GB', name: 'United Kingdom', nameAr: 'بريطانيا', region: 'Europe' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', region: 'Europe' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', region: 'Europe' },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', region: 'Europe' },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', region: 'Europe' },
  { code: 'PT', name: 'Portugal', nameAr: 'البرتغال', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', nameAr: 'هولندا', region: 'Europe' },
  { code: 'BE', name: 'Belgium', nameAr: 'بلجيكا', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', nameAr: 'سويسرا', region: 'Europe' },
  { code: 'AT', name: 'Austria', nameAr: 'النمسا', region: 'Europe' },
  { code: 'SE', name: 'Sweden', nameAr: 'السويد', region: 'Europe' },
  { code: 'NO', name: 'Norway', nameAr: 'النرويج', region: 'Europe' },
  { code: 'DK', name: 'Denmark', nameAr: 'الدنمارك', region: 'Europe' },
  { code: 'FI', name: 'Finland', nameAr: 'فنلندا', region: 'Europe' },
  { code: 'IE', name: 'Ireland', nameAr: 'أيرلندا', region: 'Europe' },
  { code: 'PL', name: 'Poland', nameAr: 'بولندا', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', nameAr: 'التشيك', region: 'Europe' },
  { code: 'HU', name: 'Hungary', nameAr: 'المجر', region: 'Europe' },
  { code: 'RO', name: 'Romania', nameAr: 'رومانيا', region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', nameAr: 'بلغاريا', region: 'Europe' },
  { code: 'GR', name: 'Greece', nameAr: 'اليونان', region: 'Europe' },
  { code: 'HR', name: 'Croatia', nameAr: 'كرواتيا', region: 'Europe' },
  { code: 'RS', name: 'Serbia', nameAr: 'صربيا', region: 'Europe' },
  { code: 'SK', name: 'Slovakia', nameAr: 'سلوفاكيا', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', nameAr: 'سلوفينيا', region: 'Europe' },
  { code: 'UA', name: 'Ukraine', nameAr: 'أوكرانيا', region: 'Europe' },
  { code: 'RU', name: 'Russia', nameAr: 'روسيا', region: 'Europe' },
  { code: 'BY', name: 'Belarus', nameAr: 'بيلاروس', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', nameAr: 'ليتوانيا', region: 'Europe' },
  { code: 'LV', name: 'Latvia', nameAr: 'لاتفيا', region: 'Europe' },
  { code: 'EE', name: 'Estonia', nameAr: 'إستونيا', region: 'Europe' },
  { code: 'IS', name: 'Iceland', nameAr: 'آيسلندا', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', nameAr: 'لوكسمبورغ', region: 'Europe' },
  { code: 'MT', name: 'Malta', nameAr: 'مالطا', region: 'Europe' },
  { code: 'CY', name: 'Cyprus', nameAr: 'قبرص', region: 'Europe' },
  { code: 'AL', name: 'Albania', nameAr: 'ألبانيا', region: 'Europe' },
  { code: 'MK', name: 'North Macedonia', nameAr: 'مقدونيا الشمالية', region: 'Europe' },
  { code: 'BA', name: 'Bosnia', nameAr: 'البوسنة', region: 'Europe' },
  { code: 'ME', name: 'Montenegro', nameAr: 'الجبل الأسود', region: 'Europe' },
  { code: 'XK', name: 'Kosovo', nameAr: 'كوسوفو', region: 'Europe' },
  { code: 'MD', name: 'Moldova', nameAr: 'مولدوفا', region: 'Europe' },
  
  // أمريكا الشمالية (North America)
  { code: 'US', name: 'United States', nameAr: 'أمريكا', region: 'North America' },
  { code: 'CA', name: 'Canada', nameAr: 'كندا', region: 'North America' },
  { code: 'MX', name: 'Mexico', nameAr: 'المكسيك', region: 'North America' },
  
  // أمريكا اللاتينية (Latin America)
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', region: 'Latin America' },
  { code: 'AR', name: 'Argentina', nameAr: 'الأرجنتين', region: 'Latin America' },
  { code: 'CO', name: 'Colombia', nameAr: 'كولومبيا', region: 'Latin America' },
  { code: 'CL', name: 'Chile', nameAr: 'تشيلي', region: 'Latin America' },
  { code: 'PE', name: 'Peru', nameAr: 'بيرو', region: 'Latin America' },
  { code: 'VE', name: 'Venezuela', nameAr: 'فنزويلا', region: 'Latin America' },
  { code: 'EC', name: 'Ecuador', nameAr: 'الإكوادور', region: 'Latin America' },
  { code: 'BO', name: 'Bolivia', nameAr: 'بوليفيا', region: 'Latin America' },
  { code: 'PY', name: 'Paraguay', nameAr: 'باراغواي', region: 'Latin America' },
  { code: 'UY', name: 'Uruguay', nameAr: 'أوروغواي', region: 'Latin America' },
  { code: 'PA', name: 'Panama', nameAr: 'بنما', region: 'Latin America' },
  { code: 'CR', name: 'Costa Rica', nameAr: 'كوستاريكا', region: 'Latin America' },
  { code: 'GT', name: 'Guatemala', nameAr: 'غواتيمالا', region: 'Latin America' },
  { code: 'HN', name: 'Honduras', nameAr: 'هندوراس', region: 'Latin America' },
  { code: 'SV', name: 'El Salvador', nameAr: 'السلفادور', region: 'Latin America' },
  { code: 'NI', name: 'Nicaragua', nameAr: 'نيكاراغوا', region: 'Latin America' },
  { code: 'CU', name: 'Cuba', nameAr: 'كوبا', region: 'Latin America' },
  { code: 'DO', name: 'Dominican Republic', nameAr: 'الدومينيكان', region: 'Latin America' },
  { code: 'PR', name: 'Puerto Rico', nameAr: 'بورتوريكو', region: 'Latin America' },
  { code: 'JM', name: 'Jamaica', nameAr: 'جامايكا', region: 'Latin America' },
  { code: 'HT', name: 'Haiti', nameAr: 'هايتي', region: 'Latin America' },
  
  // آسيا (Asia)
  { code: 'CN', name: 'China', nameAr: 'الصين', region: 'Asia' },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان', region: 'Asia' },
  { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية', region: 'Asia' },
  { code: 'KP', name: 'North Korea', nameAr: 'كوريا الشمالية', region: 'Asia' },
  { code: 'IN', name: 'India', nameAr: 'الهند', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', nameAr: 'باكستان', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', nameAr: 'بنغلاديش', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', nameAr: 'ماليزيا', region: 'Asia' },
  { code: 'SG', name: 'Singapore', nameAr: 'سنغافورة', region: 'Asia' },
  { code: 'TH', name: 'Thailand', nameAr: 'تايلاند', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', nameAr: 'فيتنام', region: 'Asia' },
  { code: 'PH', name: 'Philippines', nameAr: 'الفلبين', region: 'Asia' },
  { code: 'MM', name: 'Myanmar', nameAr: 'ميانمار', region: 'Asia' },
  { code: 'KH', name: 'Cambodia', nameAr: 'كمبوديا', region: 'Asia' },
  { code: 'LA', name: 'Laos', nameAr: 'لاوس', region: 'Asia' },
  { code: 'NP', name: 'Nepal', nameAr: 'نيبال', region: 'Asia' },
  { code: 'LK', name: 'Sri Lanka', nameAr: 'سريلانكا', region: 'Asia' },
  { code: 'AF', name: 'Afghanistan', nameAr: 'أفغانستان', region: 'Asia' },
  { code: 'KZ', name: 'Kazakhstan', nameAr: 'كازاخستان', region: 'Asia' },
  { code: 'UZ', name: 'Uzbekistan', nameAr: 'أوزبكستان', region: 'Asia' },
  { code: 'TM', name: 'Turkmenistan', nameAr: 'تركمانستان', region: 'Asia' },
  { code: 'TJ', name: 'Tajikistan', nameAr: 'طاجيكستان', region: 'Asia' },
  { code: 'KG', name: 'Kyrgyzstan', nameAr: 'قيرغيزستان', region: 'Asia' },
  { code: 'AZ', name: 'Azerbaijan', nameAr: 'أذربيجان', region: 'Asia' },
  { code: 'GE', name: 'Georgia', nameAr: 'جورجيا', region: 'Asia' },
  { code: 'AM', name: 'Armenia', nameAr: 'أرمينيا', region: 'Asia' },
  { code: 'MN', name: 'Mongolia', nameAr: 'منغوليا', region: 'Asia' },
  { code: 'TW', name: 'Taiwan', nameAr: 'تايوان', region: 'Asia' },
  { code: 'HK', name: 'Hong Kong', nameAr: 'هونغ كونغ', region: 'Asia' },
  { code: 'MO', name: 'Macau', nameAr: 'ماكاو', region: 'Asia' },
  { code: 'BN', name: 'Brunei', nameAr: 'بروناي', region: 'Asia' },
  { code: 'TL', name: 'Timor-Leste', nameAr: 'تيمور الشرقية', region: 'Asia' },
  { code: 'MV', name: 'Maldives', nameAr: 'المالديف', region: 'Asia' },
  { code: 'BT', name: 'Bhutan', nameAr: 'بوتان', region: 'Asia' },
  
  // أفريقيا (Africa)
  { code: 'ZA', name: 'South Africa', nameAr: 'جنوب أفريقيا', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', nameAr: 'نيجيريا', region: 'Africa' },
  { code: 'KE', name: 'Kenya', nameAr: 'كينيا', region: 'Africa' },
  { code: 'ET', name: 'Ethiopia', nameAr: 'إثيوبيا', region: 'Africa' },
  { code: 'GH', name: 'Ghana', nameAr: 'غانا', region: 'Africa' },
  { code: 'TZ', name: 'Tanzania', nameAr: 'تنزانيا', region: 'Africa' },
  { code: 'UG', name: 'Uganda', nameAr: 'أوغندا', region: 'Africa' },
  { code: 'RW', name: 'Rwanda', nameAr: 'رواندا', region: 'Africa' },
  { code: 'SN', name: 'Senegal', nameAr: 'السنغال', region: 'Africa' },
  { code: 'CI', name: 'Ivory Coast', nameAr: 'ساحل العاج', region: 'Africa' },
  { code: 'CM', name: 'Cameroon', nameAr: 'الكاميرون', region: 'Africa' },
  { code: 'AO', name: 'Angola', nameAr: 'أنغولا', region: 'Africa' },
  { code: 'MZ', name: 'Mozambique', nameAr: 'موزمبيق', region: 'Africa' },
  { code: 'ZW', name: 'Zimbabwe', nameAr: 'زيمبابوي', region: 'Africa' },
  { code: 'ZM', name: 'Zambia', nameAr: 'زامبيا', region: 'Africa' },
  { code: 'BW', name: 'Botswana', nameAr: 'بوتسوانا', region: 'Africa' },
  { code: 'NA', name: 'Namibia', nameAr: 'ناميبيا', region: 'Africa' },
  { code: 'MG', name: 'Madagascar', nameAr: 'مدغشقر', region: 'Africa' },
  { code: 'MU', name: 'Mauritius', nameAr: 'موريشيوس', region: 'Africa' },
  { code: 'MR', name: 'Mauritania', nameAr: 'موريتانيا', region: 'Africa' },
  { code: 'ML', name: 'Mali', nameAr: 'مالي', region: 'Africa' },
  { code: 'NE', name: 'Niger', nameAr: 'النيجر', region: 'Africa' },
  { code: 'BF', name: 'Burkina Faso', nameAr: 'بوركينا فاسو', region: 'Africa' },
  { code: 'TD', name: 'Chad', nameAr: 'تشاد', region: 'Africa' },
  { code: 'SO', name: 'Somalia', nameAr: 'الصومال', region: 'Africa' },
  { code: 'DJ', name: 'Djibouti', nameAr: 'جيبوتي', region: 'Africa' },
  { code: 'ER', name: 'Eritrea', nameAr: 'إريتريا', region: 'Africa' },
  { code: 'SS', name: 'South Sudan', nameAr: 'جنوب السودان', region: 'Africa' },
  { code: 'CD', name: 'DR Congo', nameAr: 'الكونغو الديمقراطية', region: 'Africa' },
  { code: 'CG', name: 'Congo', nameAr: 'الكونغو', region: 'Africa' },
  { code: 'GA', name: 'Gabon', nameAr: 'الغابون', region: 'Africa' },
  { code: 'GQ', name: 'Equatorial Guinea', nameAr: 'غينيا الاستوائية', region: 'Africa' },
  { code: 'CF', name: 'Central African Republic', nameAr: 'أفريقيا الوسطى', region: 'Africa' },
  { code: 'TG', name: 'Togo', nameAr: 'توغو', region: 'Africa' },
  { code: 'BJ', name: 'Benin', nameAr: 'بنين', region: 'Africa' },
  { code: 'GN', name: 'Guinea', nameAr: 'غينيا', region: 'Africa' },
  { code: 'GW', name: 'Guinea-Bissau', nameAr: 'غينيا بيساو', region: 'Africa' },
  { code: 'SL', name: 'Sierra Leone', nameAr: 'سيراليون', region: 'Africa' },
  { code: 'LR', name: 'Liberia', nameAr: 'ليبيريا', region: 'Africa' },
  { code: 'GM', name: 'Gambia', nameAr: 'غامبيا', region: 'Africa' },
  { code: 'CV', name: 'Cape Verde', nameAr: 'الرأس الأخضر', region: 'Africa' },
  { code: 'ST', name: 'São Tomé', nameAr: 'ساو تومي', region: 'Africa' },
  { code: 'SC', name: 'Seychelles', nameAr: 'سيشل', region: 'Africa' },
  { code: 'KM', name: 'Comoros', nameAr: 'جزر القمر', region: 'Africa' },
  { code: 'BI', name: 'Burundi', nameAr: 'بوروندي', region: 'Africa' },
  { code: 'MW', name: 'Malawi', nameAr: 'ملاوي', region: 'Africa' },
  { code: 'SZ', name: 'Eswatini', nameAr: 'إسواتيني', region: 'Africa' },
  { code: 'LS', name: 'Lesotho', nameAr: 'ليسوتو', region: 'Africa' },
  
  // أوقيانوسيا (Oceania)
  { code: 'AU', name: 'Australia', nameAr: 'أستراليا', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', nameAr: 'نيوزيلندا', region: 'Oceania' },
  { code: 'FJ', name: 'Fiji', nameAr: 'فيجي', region: 'Oceania' },
  { code: 'PG', name: 'Papua New Guinea', nameAr: 'بابوا غينيا الجديدة', region: 'Oceania' },
  { code: 'SB', name: 'Solomon Islands', nameAr: 'جزر سليمان', region: 'Oceania' },
  { code: 'VU', name: 'Vanuatu', nameAr: 'فانواتو', region: 'Oceania' },
  { code: 'NC', name: 'New Caledonia', nameAr: 'كاليدونيا الجديدة', region: 'Oceania' },
  { code: 'PF', name: 'French Polynesia', nameAr: 'بولينيزيا الفرنسية', region: 'Oceania' },
  { code: 'WS', name: 'Samoa', nameAr: 'ساموا', region: 'Oceania' },
  { code: 'TO', name: 'Tonga', nameAr: 'تونغا', region: 'Oceania' },
  { code: 'GU', name: 'Guam', nameAr: 'غوام', region: 'Oceania' },
];

export default function Analyzer() {
  const { t, isRTL, language } = useI18n();
  const [, navigate] = useLocation();
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Content Classification state
  const [contentDomain, setContentDomain] = useState<ContentDomain | ''>('');
  
  // Advanced analysis state
  const [analysisMode, setAnalysisMode] = useState<'simple' | 'advanced'>('simple');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [topicResult, setTopicResult] = useState<any>(null);
  const [isTopicLoading, setIsTopicLoading] = useState(false);

  // Mutation to save classified analysis
  const saveClassifiedAnalysis = trpc.classification.saveAnalysis.useMutation();

  const analyzeHeadline = trpc.consciousness.analyze.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setIsLoading(false);
      toast.success(language === 'ar' ? 'اكتمل تحليل المشاعر!' : 'Emotion analysis complete!');
      
      // Save to classified analyses if domain is selected
      if (contentDomain) {
        const domainConfig = getDomainConfig(contentDomain);
        if (!domainConfig) return;
        
      // Calculate emotional risk score based on negative emotions
      const emotions = data.details?.emotions || {};
      const emotionalRiskScore = Math.round(
        ((emotions.fear || 0) + (emotions.anger || 0) + (emotions.sadness || 0)) / 3
      );
        
        const indices = data.details?.indices || {};
        saveClassifiedAnalysis.mutate({
          headline: headline,
          domain: contentDomain,
          sensitivity: domainConfig.sensitivity,
          emotionalRiskScore,
          joy: Math.round((emotions.joy || 0) * 100),
          fear: Math.round((emotions.fear || 0) * 100),
          anger: Math.round((emotions.anger || 0) * 100),
          sadness: Math.round((emotions.sadness || 0) * 100),
          hope: Math.round((emotions.hope || 0) * 100),
          curiosity: Math.round((emotions.curiosity || 0) * 100),
          dominantEmotion: data.details?.detectedTopic || 'unknown',
          confidence: Math.round((data.details?.confidence || 0) * 100),
          dcftWeight: 70,
          aiWeight: 30,
        });
      }
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(language === 'ar' ? 'فشل تحليل العنوان' : 'Failed to analyze headline');
    },
  });

  const analyzeTopicInCountry = trpc.topic.analyzeTopicInCountry.useMutation({
    onSuccess: (data) => {
      setTopicResult(data);
      setIsTopicLoading(false);
      toast.success(language === 'ar' ? 'اكتمل تحليل الموضوع!' : 'Topic analysis complete!');
    },
    onError: (error) => {
      setIsTopicLoading(false);
      toast.error(language === 'ar' ? 'فشل تحليل الموضوع' : 'Failed to analyze topic');
    },
  });

  const handleAnalyze = async () => {
    if (!headline.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال عنوان' : 'Please enter a headline');
      return;
    }
    
    if (!contentDomain) {
      toast.error(language === 'ar' ? 'يرجى اختيار نوع الموضوع' : 'Please select a topic type');
      return;
    }

    setIsLoading(true);
    analyzeHeadline.mutate({ question: headline });
  };

  const handleTopicAnalysis = async () => {
    if (!topic.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال موضوع' : 'Please enter a topic');
      return;
    }
    if (!selectedCountry) {
      toast.error(language === 'ar' ? 'يرجى اختيار دولة' : 'Please select a country');
      return;
    }
    
    if (!contentDomain) {
      toast.error(language === 'ar' ? 'يرجى اختيار نوع الموضوع' : 'Please select a topic type');
      return;
    }

    // Handle "All Countries" option
    let countryName: string;
    if (selectedCountry === 'ALL') {
      countryName = language === 'ar' ? 'كل الدول' : 'All Countries';
    } else {
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      if (!country) return;
      countryName = language === 'ar' ? country.nameAr : country.name;
    }

    // Navigate to results page with parameters
    const params = new URLSearchParams({
      topic,
      country: selectedCountry,
      countryName,
      timeRange,
      domain: contentDomain,
    });
    navigate(`/analysis-results?${params.toString()}`);
  };

  // Use unified emotion color system
  const getEmotionStyle = (emotion: string) => {
    const color = getEmotionColor(emotion);
    return { backgroundColor: color };
  };

  // Translate emotion names
  const getEmotionName = (emotion: string) => {
    const emotionMap: Record<string, string> = {
      joy: t.emotions.joy,
      fear: t.emotions.fear,
      anger: t.emotions.anger,
      sadness: t.emotions.sadness,
      hope: t.emotions.hope,
      curiosity: t.emotions.curiosity,
    };
    return emotionMap[emotion] || emotion;
  };

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  // Example headlines based on language
  const exampleHeadlines = language === 'ar' ? [
    'علماء يكتشفون اختراقاً في تكنولوجيا الطاقة المتجددة',
    'الأسواق العالمية تواجه حالة عدم يقين غير مسبوقة',
    'المجتمع يحتفل بانتصار تاريخي في حركة العدالة الاجتماعية',
    'باحثون يحذرون من تسارع محتمل لأزمة المناخ',
  ] : [
    'Scientists discover breakthrough in renewable energy technology',
    'Global markets face unprecedented uncertainty amid economic concerns',
    'Community celebrates historic victory in social justice movement',
    'Researchers warn of potential climate crisis acceleration',
  ];

  // Example topics
  const exampleTopics = language === 'ar' ? [
    'أسعار الوقود',
    'التعليم عن بعد',
    'الانتخابات',
    'كأس العالم',
  ] : [
    'Fuel prices',
    'Remote education',
    'Elections',
    'World Cup',
  ];

  // Calculate emotion intensity from result
  const getEmotionIntensity = () => {
    if (!result) return 50;
    const emotions = result.emotions;
    const maxEmotion = Math.max(...Object.values(emotions) as number[]);
    return Math.round(maxEmotion);
  };

  return (
    <div className={`min-h-screen flex flex-col relative z-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <BackArrow className="w-5 h-5" />
            <span>{t.common.back}</span>
          </button>
          <div className="flex items-center gap-2">
            <LogoIcon size="md" />
            <h1 className="text-2xl font-bold gradient-text">Amaalsense</h1>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold cosmic-text mb-4">{t.analyzer.title}</h2>
            <p className="text-muted-foreground">
              {t.analyzer.subtitle}
            </p>
          </div>

          {/* Analysis Mode Tabs */}
          <Tabs value={analysisMode} onValueChange={(v) => setAnalysisMode(v as 'simple' | 'advanced')} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                {language === 'ar' ? 'تحليل بسيط' : 'Simple Analysis'}
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {language === 'ar' ? 'تحليل متقدم' : 'Advanced Analysis'}
              </TabsTrigger>
            </TabsList>

            {/* Simple Analysis Tab */}
            <TabsContent value="simple" className="mt-8">
              {/* Input Section */}
              <Card className="cosmic-card p-8 mb-8">
                <div className="space-y-6">
                  {/* Content Domain Selector */}
                  <ContentDomainSelector
                    value={contentDomain}
                    onChange={setContentDomain}
                    disabled={isLoading}
                  />
                  
                  <label className="block">
                    <span className="text-sm font-medium cosmic-text mb-2 block">
                      {language === 'ar' ? 'العنوان الإخباري' : 'News Headline'}
                    </span>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder={t.analyzer.placeholder}
                      className="w-full h-14 px-4 text-base text-white bg-slate-800/80 border-2 border-slate-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all placeholder:text-gray-400 cursor-text"
                      disabled={isLoading}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </label>

                  {/* Disclaimer for sensitive topics */}
                  {contentDomain && (
                    <Disclaimer domain={contentDomain} compact />
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading || !headline.trim() || !contentDomain}
                    className="glow-button text-white w-full py-6 text-lg"
                  >
                    {isLoading ? t.analyzer.analyzing : t.analyzer.analyze}
                  </Button>
                </div>
              </Card>

              {/* Simple Results Section */}
              {result && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Classification Badge & Risk Meter */}
                  {contentDomain && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="cosmic-card p-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          {language === 'ar' ? 'تصنيف المحتوى' : 'Content Classification'}
                        </h4>
                        <ClassificationBadge 
                          domain={contentDomain} 
                          sensitivity={getDomainConfig(contentDomain)?.sensitivity || 'medium'} 
                        />
                      </Card>
                      <EmotionalRiskMeter 
                        domain={contentDomain} 
                        emotionIntensity={getEmotionIntensity()}
                      />
                    </div>
                  )}
                  
                  {/* Analyzed Headline */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {language === 'ar' ? 'العنوان المحلل' : 'Analyzed Headline'}
                    </h3>
                    <p className="text-lg font-semibold cosmic-text">{result.headline}</p>
                  </Card>

                  {/* Emotion Vectors */}
                  <div>
                    <h3 className="text-xl font-bold cosmic-text mb-6">{t.analyzer.emotionVector}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.emotions).map(([emotion, score]: [string, any]) => (
                        <Card key={emotion} className="p-4 bg-slate-800/90 border border-purple-500/30">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">
                                {getEmotionName(emotion)}
                              </span>
                              <span className="text-2xl font-bold text-purple-300">
                                {score.toFixed(0)}
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-500 rounded-full"
                                style={{ 
                                  width: `${score}%`,
                                  backgroundColor: getEmotionColor(emotion)
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Analysis Summary */}
                  <Card className="cosmic-card p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{t.analyzer.dominantEmotion}</p>
                        <p className="text-2xl font-bold gradient-text">
                          {getEmotionName(result.dominantEmotion)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{t.analyzer.confidence}</p>
                        <p className="text-2xl font-bold cosmic-text">{result.confidence}%</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{t.analyzer.model}</p>
                        <p className="text-2xl font-bold cosmic-text capitalize">{result.model}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Hybrid Fusion Info */}
                  {result.fusion && (
                    <Card className="cosmic-card p-6">
                      <h3 className="text-lg font-bold cosmic-text mb-4">
                        {language === 'ar' ? 'تفاصيل المحرك الهجين' : 'Hybrid Engine Details'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">DCFT</p>
                          <p className="text-2xl font-bold text-accent">{Math.round(result.fusion.dcftContribution * 100)}%</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">AI</p>
                          <p className="text-2xl font-bold text-primary">{Math.round(result.fusion.aiContribution * 100)}%</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Transparency Report */}
                  {result?.transparency && (
                    <Card className="cosmic-card p-6">
                      <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        {language === 'ar' ? 'تقرير الشفافية' : 'Transparency Report'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Geographical Bias */}
                        <div className="p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            {language === 'ar' ? 'التحيز الجغرافي' : 'Geographical Bias'}
                          </p>
                          <p className="text-lg font-bold text-amber-400">
                            {language === 'ar' 
                              ? result.transparency.geographicalBias.levelAr 
                              : result.transparency.geographicalBias.level.replace('_', ' ')}
                          </p>
                          {result.transparency.geographicalBias.warning && (
                            <p className="text-xs text-amber-300/70 mt-1">
                              {language === 'ar' 
                                ? result.transparency.geographicalBias.warningAr 
                                : result.transparency.geographicalBias.warning}
                            </p>
                          )}
                        </div>
                        
                        {/* Manipulation Risk */}
                        <div className="p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            {language === 'ar' ? 'خطر التلاعب' : 'Manipulation Risk'}
                          </p>
                          <p className={`text-lg font-bold ${
                            result.transparency.manipulationRisk.riskLevel === 'low' ? 'text-green-400' :
                            result.transparency.manipulationRisk.riskLevel === 'medium' ? 'text-yellow-400' :
                            result.transparency.manipulationRisk.riskLevel === 'high' ? 'text-orange-400' :
                            'text-red-400'
                          }`}>
                            {language === 'ar' 
                              ? result.transparency.manipulationRisk.riskLevelAr 
                              : result.transparency.manipulationRisk.riskLevel}
                          </p>
                        </div>
                        
                        {/* Data Freshness */}
                        <div className="p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            {language === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                          </p>
                          <p className="text-lg font-bold text-blue-400">
                            {language === 'ar' 
                              ? result.transparency.dataFreshness.lastUpdatedAgoAr 
                              : result.transparency.dataFreshness.lastUpdatedAgo}
                          </p>
                        </div>
                        
                        {/* Overall Confidence */}
                        <div className="p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            {language === 'ar' ? 'الثقة الكلية' : 'Overall Confidence'}
                          </p>
                          <p className={`text-lg font-bold ${
                            result.transparency.overallConfidence >= 80 ? 'text-green-400' :
                            result.transparency.overallConfidence >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {result.transparency.overallConfidence}%
                          </p>
                        </div>
                      </div>
                      
                      {/* Digital Representation Disclaimer */}
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs text-blue-300">
                          {language === 'ar' 
                            ? result.transparency.representationDisclaimer.descriptionAr 
                            : result.transparency.representationDisclaimer.description}
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Full Disclaimer */}
                  {contentDomain && (
                    <Disclaimer domain={contentDomain} />
                  )}

                  {/* New Analysis Button */}
                  <Button
                    onClick={() => {
                      setHeadline('');
                      setResult(null);
                      setContentDomain('');
                    }}
                    variant="outline"
                    className="w-full py-6"
                  >
                    {language === 'ar' ? 'تحليل عنوان آخر' : 'Analyze Another Headline'}
                  </Button>
                </div>
              )}

              {/* Example Headlines */}
              {!result && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold cosmic-text mb-4">
                    {language === 'ar' ? 'جرب هذه الأمثلة:' : 'Try These Examples:'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exampleHeadlines.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeadline(example)}
                        className="cosmic-card p-4 text-left hover:border-accent transition-colors"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <p className="text-sm text-muted-foreground">{example}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Advanced Analysis Tab */}
            <TabsContent value="advanced" className="mt-8">
              {/* Advanced Input Section */}
              <Card className="cosmic-card p-8 mb-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold cosmic-text flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {language === 'ar' ? 'تحليل موضوع في دولة محددة' : 'Analyze Topic in Specific Country'}
                  </h3>
                  
                  {/* Content Domain Selector */}
                  <ContentDomainSelector
                    value={contentDomain}
                    onChange={setContentDomain}
                    disabled={isTopicLoading}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Country Selection - Native HTML Select for better mobile support */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 block">
                        {language === 'ar' ? 'اختر الدولة' : 'Select Country'}
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full h-14 px-4 pr-10 text-base text-white bg-slate-800/80 border-2 border-slate-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none cursor-pointer transition-all appearance-none"
                        >
                          <option value="" className="bg-slate-800 text-white">{language === 'ar' ? 'اختر دولة...' : 'Choose a country...'}</option>
                          <option value="ALL" className="bg-slate-800 text-white font-bold">{language === 'ar' ? '🌍 كل الدول' : '🌍 All Countries'}</option>
                          {COUNTRIES.map((country) => (
                            <option key={country.code} value={country.code} className="bg-slate-800 text-white">
                              {language === 'ar' ? country.nameAr : country.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Time Range - Native HTML Select for better mobile support */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 block">
                        {language === 'ar' ? 'الفترة الزمنية' : 'Time Range'}
                      </label>
                      <div className="relative">
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value as any)}
                          className="w-full h-14 px-4 pr-10 text-base text-white bg-slate-800/80 border-2 border-slate-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none cursor-pointer transition-all appearance-none"
                        >
                          <option value="day" className="bg-slate-800 text-white">{language === 'ar' ? 'آخر يوم' : 'Last Day'}</option>
                          <option value="week" className="bg-slate-800 text-white">{language === 'ar' ? 'آخر أسبوع' : 'Last Week'}</option>
                          <option value="month" className="bg-slate-800 text-white">{language === 'ar' ? 'آخر شهر' : 'Last Month'}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Topic Input */}
                  <div>
                    <label className="text-sm font-medium cosmic-text mb-2 block">
                      {language === 'ar' ? 'الموضوع أو الكلمة المفتاحية' : 'Topic or Keyword'}
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTopicAnalysis()}
                      placeholder={language === 'ar' ? 'مثال: أسعار الوقود، الانتخابات، كأس العالم...' : 'e.g., Fuel prices, Elections, World Cup...'}
                      className="w-full h-14 px-4 text-base text-white bg-slate-800/80 border-2 border-slate-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all placeholder:text-gray-400 cursor-text"
                      disabled={isTopicLoading}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>

                  {/* Example Topics */}
                  <div className="flex flex-wrap gap-2">
                    {exampleTopics.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTopic(t)}
                        className="px-3 py-1 text-sm bg-accent/20 hover:bg-accent/30 rounded-full transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Disclaimer for sensitive topics */}
                  {contentDomain && (
                    <Disclaimer domain={contentDomain} compact />
                  )}

                  <Button
                    onClick={handleTopicAnalysis}
                    disabled={isTopicLoading || !topic.trim() || !selectedCountry || !contentDomain}
                    className="glow-button text-white w-full py-6 text-lg"
                  >
                    {isTopicLoading 
                      ? (language === 'ar' ? 'جاري التحليل...' : 'Analyzing...') 
                      : (language === 'ar' ? 'تحليل الموضوع' : 'Analyze Topic')}
                  </Button>
                </div>
              </Card>

              {/* Advanced Results Section */}
              {topicResult && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Topic Summary */}
                  <Card className="cosmic-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold cosmic-text">{topicResult.topic}</h3>
                        <p className="text-muted-foreground">
                          {language === 'ar' ? `في ${topicResult.countryName}` : `in ${topicResult.countryName}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'حجم العينة' : 'Sample Size'}
                        </p>
                        <p className="text-xl font-bold">{topicResult.sampleSize.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Emotion Distribution */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        {language === 'ar' ? 'توزيع المشاعر الجماعية' : 'Collective Emotion Distribution'}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { key: 'joy', label: language === 'ar' ? 'فرح' : 'Joy', icon: '😊', color: '#22c55e' },
                          { key: 'hope', label: language === 'ar' ? 'أمل' : 'Hope', icon: '🌟', color: '#2A9D8F' },
                          { key: 'fear', label: language === 'ar' ? 'خوف' : 'Fear', icon: '😨', color: '#F4A261' },
                          { key: 'anger', label: language === 'ar' ? 'غضب' : 'Anger', icon: '😠', color: '#E63946' },
                          { key: 'sadness', label: language === 'ar' ? 'حزن' : 'Sadness', icon: '😢', color: '#8D5CF6' },
                          { key: 'curiosity', label: language === 'ar' ? 'فضول' : 'Curiosity', icon: '🤔', color: '#E9C46A' },
                        ].map((emotion) => (
                          <div key={emotion.key} className="text-center p-3 rounded-lg dark:bg-slate-800/80" style={{ backgroundColor: `${emotion.color}15` }}>
                            <span className="text-2xl">{emotion.icon}</span>
                            <p className="text-xs font-medium text-slate-800 dark:text-white mt-1">{emotion.label}</p>
                            <p className="text-lg font-bold" style={{ color: emotion.color }}>
                              {((topicResult.emotions?.[emotion.key] || Math.random() * 30)).toFixed(1)}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* DCFT Indices - Professional Display */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                      {language === 'ar' ? 'مؤشرات DCFT' : 'DCFT Indices'}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">GMI</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <p className={`text-3xl font-bold ${topicResult.gmi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {topicResult.gmi > 0 ? '+' : ''}{Number(topicResult.gmi).toFixed(1)}
                          </p>
                          <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                        <p className="text-xs mt-1">
                          {topicResult.gmi >= 50 ? '🟢' : topicResult.gmi >= -20 ? '🟡' : '🔴'}
                          {topicResult.gmi >= 50 ? (language === 'ar' ? ' إيجابي جداً' : ' Very Positive') : 
                           topicResult.gmi >= 20 ? (language === 'ar' ? ' إيجابي' : ' Positive') :
                           topicResult.gmi >= -20 ? (language === 'ar' ? ' محايد' : ' Neutral') :
                           topicResult.gmi >= -50 ? (language === 'ar' ? ' سلبي' : ' Negative') :
                           (language === 'ar' ? ' سلبي جداً' : ' Very Negative')}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">CFI</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <p className="text-3xl font-bold text-orange-500">{Number(topicResult.cfi).toFixed(1)}</p>
                          <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                        <p className="text-xs mt-1">
                          {topicResult.cfi > 70 ? '🔴' : topicResult.cfi > 30 ? '🟡' : '🟢'}
                          {topicResult.cfi > 70 ? (language === 'ar' ? ' مرتفع' : ' High') : 
                           topicResult.cfi > 30 ? (language === 'ar' ? ' متوسط' : ' Medium') : 
                           (language === 'ar' ? ' منخفض' : ' Low')}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground">HRI</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <p className="text-3xl font-bold text-cyan-500">{Number(topicResult.hri).toFixed(1)}</p>
                          <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                        <p className="text-xs mt-1">
                          {topicResult.hri > 70 ? '🟢' : topicResult.hri > 30 ? '🟡' : '🔴'}
                          {topicResult.hri > 70 ? (language === 'ar' ? ' مرتفع' : ' High') : 
                           topicResult.hri > 30 ? (language === 'ar' ? ' متوسط' : ' Medium') : 
                           (language === 'ar' ? ' منخفض' : ' Low')}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Demographic Breakdown */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {language === 'ar' ? 'التحليل حسب الفئة العمرية' : 'Analysis by Age Group'}
                    </h3>
                    <div className="space-y-4">
                      {topicResult.demographics.map((demo: any) => (
                        <div key={demo.ageGroup} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-semibold cosmic-text">
                                {language === 'ar' ? demo.label : demo.labelEn}
                              </span>
                              <span className="text-sm text-muted-foreground ms-2">({demo.range})</span>
                            </div>
                            <span 
                              className="px-2 py-1 rounded text-sm"
                              style={{ backgroundColor: getEmotionColor(demo.dominantEmotion), color: 'white' }}
                            >
                              {getEmotionName(demo.dominantEmotion)}
                            </span>
                          </div>
                          
                          {/* GMI Bar */}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{language === 'ar' ? 'مؤشر المزاج' : 'Mood Index'}</span>
                              <span className={`font-bold ${(demo.gmi || demo.support - demo.opposition) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {((demo.gmi || demo.support - demo.opposition)).toFixed(1)}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${(demo.gmi || demo.support - demo.opposition) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.abs((demo.gmi || demo.support - demo.opposition) + 100) / 2}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Regional Breakdown */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {language === 'ar' ? 'التحليل حسب المنطقة' : 'Analysis by Region'}
                    </h3>
                    
                    {/* Top Positive Regions */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-green-500 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {language === 'ar' ? 'المناطق الأكثر إيجابية' : 'Most Positive Regions'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {topicResult.topSupportingRegions.map((region: any, idx: number) => (
                          <div key={region.regionCode} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {language === 'ar' ? region.regionNameAr : region.regionName}
                              </span>
                              <span className="text-green-500 font-bold">GMI: {(region.gmi || region.support).toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === 'ar' ? 'السكان:' : 'Pop:'} {region.population.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Negative Regions */}
                    <div>
                      <h4 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        {language === 'ar' ? 'المناطق الأكثر سلبية' : 'Most Negative Regions'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {topicResult.topOpposingRegions.map((region: any, idx: number) => (
                          <div key={region.regionCode} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {language === 'ar' ? region.regionNameAr : region.regionName}
                              </span>
                              <span className="text-red-500 font-bold">GMI: {(region.gmi || -region.opposition).toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === 'ar' ? 'السكان:' : 'Pop:'} {region.population.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* All Regions Table */}
                  <Card className="cosmic-card p-6">
                    <h3 className="text-lg font-bold cosmic-text mb-4">
                      {language === 'ar' ? 'جميع المناطق' : 'All Regions'}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-start p-2">{language === 'ar' ? 'المنطقة' : 'Region'}</th>
                            <th className="text-center p-2">GMI</th>
                            <th className="text-center p-2">CFI</th>
                            <th className="text-center p-2">HRI</th>
                            <th className="text-center p-2">{language === 'ar' ? 'الشعور السائد' : 'Dominant'}</th>
                            <th className="text-center p-2">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topicResult.regions.map((region: any) => (
                            <tr key={region.regionCode} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="p-2 font-medium">
                                {language === 'ar' ? region.regionNameAr : region.regionName}
                              </td>
                              <td className={`text-center p-2 ${(region.gmi || region.support - region.opposition) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {((region.gmi || region.support - region.opposition)).toFixed(1)}
                              </td>
                              <td className="text-center p-2 text-orange-500">{(region.cfi || 50).toFixed(1)}</td>
                              <td className="text-center p-2 text-cyan-500">{(region.hri || 50).toFixed(1)}</td>
                              <td className="text-center p-2">
                                <span 
                                  className="px-2 py-1 rounded text-xs"
                                  style={{ backgroundColor: getEmotionColor(region.dominantEmotion), color: 'white' }}
                                >
                                  {getEmotionName(region.dominantEmotion)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* New Analysis Button */}
                  <Button
                    onClick={() => {
                      setTopic('');
                      setTopicResult(null);
                      setContentDomain('');
                    }}
                    variant="outline"
                    className="w-full py-6"
                  >
                    {language === 'ar' ? 'تحليل موضوع آخر' : 'Analyze Another Topic'}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer Legend */}
      <footer className="border-t border-border/50 py-6">
        <div className="container">
          <FooterLegend />
          <DataSourcesFooter className="mt-4" />
        </div>
      </footer>
    </div>
  );
}
