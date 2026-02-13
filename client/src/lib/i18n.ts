/**
 * i18n Configuration
 * 
 * Supports 7 languages:
 * - Arabic (ar) - RTL
 * - English (en)
 * - French (fr)
 * - Spanish (es)
 * - German (de)
 * - Chinese Simplified (zh)
 * - Japanese (ja)
 */

export type Language = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja';

export const LANGUAGES: Record<Language, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  zh: { name: 'Chinese', nativeName: '中文', dir: 'ltr' },
  ja: { name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
};

export const DEFAULT_LANGUAGE: Language = 'en';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.chat': 'الدردشة',
    'nav.dashboard': 'لوحة التحكم',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',

    // Home Page
    'home.title': 'مرحباً بك في AmalSense',
    'home.subtitle': 'محلل الذكاء العاطفي الجماعي',
    'home.description': 'AmalSense هو وكيل ذكاء عاطفي جماعي يحلل ويفسر المشاعر من المصادر الرقمية في جميع أنحاء العالم.',
    'home.cta': 'ابدأ الآن',
    'home.features': 'الميزات',

    // Chat Page
    'chat.title': 'محلل المشاعر',
    'chat.placeholder': 'أدخل النص للتحليل...',
    'chat.analyze': 'تحليل',
    'chat.clear': 'مسح',
    'chat.history': 'السجل',
    'chat.search': 'البحث...',
    'chat.filter': 'تصفية',
    'chat.export': 'تصدير',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.analytics': 'التحليلات',
    'dashboard.reports': 'التقارير',
    'dashboard.settings': 'الإعدادات',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.close': 'إغلاق',
    'common.language': 'اللغة',

    // Emotions
    'emotion.joy': 'فرح',
    'emotion.sadness': 'حزن',
    'emotion.anger': 'غضب',
    'emotion.fear': 'خوف',
    'emotion.surprise': 'مفاجأة',
    'emotion.disgust': 'اشمئزاز',
    'emotion.neutral': 'محايد',

    // Analysis Results
    'result.topic': 'الموضوع',
    'result.emotion': 'المشاعر',
    'result.region': 'المنطقة',
    'result.impact': 'التأثير',
    'result.severity': 'الشدة',
    'result.confidence': 'الثقة',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    // Home Page
    'home.title': 'Welcome to AmalSense',
    'home.subtitle': 'Collective Emotional Intelligence Analyzer',
    'home.description': 'AmalSense is a Collective Emotional Intelligence Agent that analyzes and interprets emotions from digital sources worldwide.',
    'home.cta': 'Get Started',
    'home.features': 'Features',

    // Chat Page
    'chat.title': 'Emotion Analyzer',
    'chat.placeholder': 'Enter text to analyze...',
    'chat.analyze': 'Analyze',
    'chat.clear': 'Clear',
    'chat.history': 'History',
    'chat.search': 'Search...',
    'chat.filter': 'Filter',
    'chat.export': 'Export',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.analytics': 'Analytics',
    'dashboard.reports': 'Reports',
    'dashboard.settings': 'Settings',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.language': 'Language',

    // Emotions
    'emotion.joy': 'Joy',
    'emotion.sadness': 'Sadness',
    'emotion.anger': 'Anger',
    'emotion.fear': 'Fear',
    'emotion.surprise': 'Surprise',
    'emotion.disgust': 'Disgust',
    'emotion.neutral': 'Neutral',

    // Analysis Results
    'result.topic': 'Topic',
    'result.emotion': 'Emotions',
    'result.region': 'Region',
    'result.impact': 'Impact',
    'result.severity': 'Severity',
    'result.confidence': 'Confidence',
  },

  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.chat': 'Chat',
    'nav.dashboard': 'Tableau de bord',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',

    // Home Page
    'home.title': 'Bienvenue sur AmalSense',
    'home.subtitle': 'Analyseur d\'intelligence émotionnelle collective',
    'home.description': 'AmalSense est un agent d\'intelligence émotionnelle collective qui analyse et interprète les émotions provenant de sources numériques dans le monde entier.',
    'home.cta': 'Commencer',
    'home.features': 'Caractéristiques',

    // Chat Page
    'chat.title': 'Analyseur d\'émotions',
    'chat.placeholder': 'Entrez le texte à analyser...',
    'chat.analyze': 'Analyser',
    'chat.clear': 'Effacer',
    'chat.history': 'Historique',
    'chat.search': 'Rechercher...',
    'chat.filter': 'Filtrer',
    'chat.export': 'Exporter',

    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.overview': 'Aperçu',
    'dashboard.analytics': 'Analytique',
    'dashboard.reports': 'Rapports',
    'dashboard.settings': 'Paramètres',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur s\'est produite',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
    'common.language': 'Langue',

    // Emotions
    'emotion.joy': 'Joie',
    'emotion.sadness': 'Tristesse',
    'emotion.anger': 'Colère',
    'emotion.fear': 'Peur',
    'emotion.surprise': 'Surprise',
    'emotion.disgust': 'Dégoût',
    'emotion.neutral': 'Neutre',

    // Analysis Results
    'result.topic': 'Sujet',
    'result.emotion': 'Émotions',
    'result.region': 'Région',
    'result.impact': 'Impact',
    'result.severity': 'Gravité',
    'result.confidence': 'Confiance',
  },

  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.chat': 'Chat',
    'nav.dashboard': 'Panel de control',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar sesión',

    // Home Page
    'home.title': 'Bienvenido a AmalSense',
    'home.subtitle': 'Analizador de inteligencia emocional colectiva',
    'home.description': 'AmalSense es un agente de inteligencia emocional colectiva que analiza e interpreta emociones de fuentes digitales en todo el mundo.',
    'home.cta': 'Comenzar',
    'home.features': 'Características',

    // Chat Page
    'chat.title': 'Analizador de emociones',
    'chat.placeholder': 'Ingrese el texto a analizar...',
    'chat.analyze': 'Analizar',
    'chat.clear': 'Limpiar',
    'chat.history': 'Historial',
    'chat.search': 'Buscar...',
    'chat.filter': 'Filtrar',
    'chat.export': 'Exportar',

    // Dashboard
    'dashboard.title': 'Panel de control',
    'dashboard.overview': 'Descripción general',
    'dashboard.analytics': 'Análisis',
    'dashboard.reports': 'Informes',
    'dashboard.settings': 'Configuración',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.language': 'Idioma',

    // Emotions
    'emotion.joy': 'Alegría',
    'emotion.sadness': 'Tristeza',
    'emotion.anger': 'Ira',
    'emotion.fear': 'Miedo',
    'emotion.surprise': 'Sorpresa',
    'emotion.disgust': 'Asco',
    'emotion.neutral': 'Neutral',

    // Analysis Results
    'result.topic': 'Tema',
    'result.emotion': 'Emociones',
    'result.region': 'Región',
    'result.impact': 'Impacto',
    'result.severity': 'Gravedad',
    'result.confidence': 'Confianza',
  },

  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.chat': 'Chat',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Einstellungen',
    'nav.logout': 'Abmelden',

    // Home Page
    'home.title': 'Willkommen bei AmalSense',
    'home.subtitle': 'Analysator für kollektive emotionale Intelligenz',
    'home.description': 'AmalSense ist ein Agent für kollektive emotionale Intelligenz, der Emotionen aus digitalen Quellen weltweit analysiert und interpretiert.',
    'home.cta': 'Jetzt starten',
    'home.features': 'Funktionen',

    // Chat Page
    'chat.title': 'Emotionsanalysator',
    'chat.placeholder': 'Text zur Analyse eingeben...',
    'chat.analyze': 'Analysieren',
    'chat.clear': 'Löschen',
    'chat.history': 'Verlauf',
    'chat.search': 'Suchen...',
    'chat.filter': 'Filtern',
    'chat.export': 'Exportieren',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Übersicht',
    'dashboard.analytics': 'Analytik',
    'dashboard.reports': 'Berichte',
    'dashboard.settings': 'Einstellungen',

    // Common
    'common.loading': 'Wird geladen...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.close': 'Schließen',
    'common.language': 'Sprache',

    // Emotions
    'emotion.joy': 'Freude',
    'emotion.sadness': 'Traurigkeit',
    'emotion.anger': 'Wut',
    'emotion.fear': 'Angst',
    'emotion.surprise': 'Überraschung',
    'emotion.disgust': 'Ekel',
    'emotion.neutral': 'Neutral',

    // Analysis Results
    'result.topic': 'Thema',
    'result.emotion': 'Emotionen',
    'result.region': 'Region',
    'result.impact': 'Auswirkung',
    'result.severity': 'Schweregrad',
    'result.confidence': 'Vertrauen',
  },

  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.chat': '聊天',
    'nav.dashboard': '仪表板',
    'nav.settings': '设置',
    'nav.logout': '登出',

    // Home Page
    'home.title': '欢迎来到 AmalSense',
    'home.subtitle': '集体情感智能分析器',
    'home.description': 'AmalSense 是一个集体情感智能代理，分析和解释来自全球数字来源的情感。',
    'home.cta': '开始使用',
    'home.features': '功能',

    // Chat Page
    'chat.title': '情感分析器',
    'chat.placeholder': '输入要分析的文本...',
    'chat.analyze': '分析',
    'chat.clear': '清除',
    'chat.history': '历史记录',
    'chat.search': '搜索...',
    'chat.filter': '筛选',
    'chat.export': '导出',

    // Dashboard
    'dashboard.title': '仪表板',
    'dashboard.overview': '概览',
    'dashboard.analytics': '分析',
    'dashboard.reports': '报告',
    'dashboard.settings': '设置',

    // Common
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.close': '关闭',
    'common.language': '语言',

    // Emotions
    'emotion.joy': '快乐',
    'emotion.sadness': '悲伤',
    'emotion.anger': '愤怒',
    'emotion.fear': '恐惧',
    'emotion.surprise': '惊讶',
    'emotion.disgust': '厌恶',
    'emotion.neutral': '中立',

    // Analysis Results
    'result.topic': '主题',
    'result.emotion': '情感',
    'result.region': '地区',
    'result.impact': '影响',
    'result.severity': '严重程度',
    'result.confidence': '信心',
  },

  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.chat': 'チャット',
    'nav.dashboard': 'ダッシュボード',
    'nav.settings': '設定',
    'nav.logout': 'ログアウト',

    // Home Page
    'home.title': 'AmalSenseへようこそ',
    'home.subtitle': '集団的感情知能アナライザー',
    'home.description': 'AmalSenseは、世界中のデジタルソースから感情を分析および解釈する集団的感情知能エージェントです。',
    'home.cta': '開始する',
    'home.features': '機能',

    // Chat Page
    'chat.title': '感情分析器',
    'chat.placeholder': '分析するテキストを入力...',
    'chat.analyze': '分析',
    'chat.clear': 'クリア',
    'chat.history': '履歴',
    'chat.search': '検索...',
    'chat.filter': 'フィルター',
    'chat.export': 'エクスポート',

    // Dashboard
    'dashboard.title': 'ダッシュボード',
    'dashboard.overview': '概要',
    'dashboard.analytics': '分析',
    'dashboard.reports': 'レポート',
    'dashboard.settings': '設定',

    // Common
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.success': '成功',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.close': '閉じる',
    'common.language': '言語',

    // Emotions
    'emotion.joy': '喜び',
    'emotion.sadness': '悲しみ',
    'emotion.anger': '怒り',
    'emotion.fear': '恐れ',
    'emotion.surprise': '驚き',
    'emotion.disgust': '嫌悪',
    'emotion.neutral': 'ニュートラル',

    // Analysis Results
    'result.topic': 'トピック',
    'result.emotion': '感情',
    'result.region': '地域',
    'result.impact': '影響',
    'result.severity': '重大度',
    'result.confidence': '信頼度',
  },
};

/**
 * Get translated string
 */
export function t(key: string, language: Language = DEFAULT_LANGUAGE): string {
  const langTranslations = translations[language];
  return langTranslations[key] || translations[DEFAULT_LANGUAGE][key] || key;
}

/**
 * Get all translations for a language
 */
export function getTranslations(language: Language): Record<string, string> {
  return translations[language];
}

/**
 * Check if language is RTL
 */
export function isRTL(language: Language): boolean {
  return LANGUAGES[language].dir === 'rtl';
}

/**
 * Get language direction
 */
export function getLanguageDir(language: Language): 'ltr' | 'rtl' {
  return LANGUAGES[language].dir;
}
