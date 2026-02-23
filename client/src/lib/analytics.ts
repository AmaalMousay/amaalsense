/**
 * تحليلات وتتبع الأداء
 * Analytics & Performance Tracking
 * 
 * يتضمن:
 * - Google Analytics
 * - Mixpanel
 * - Custom Events
 * - Performance Monitoring
 */

// ============================================================================
// GOOGLE ANALYTICS
// ============================================================================

export const initializeGoogleAnalytics = (measurementId: string) => {
  // Load Google Analytics script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", measurementId);

  return gtag;
};

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "GA_MEASUREMENT_ID", {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

export const trackEvent = (
  eventName: string,
  eventParams: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// ============================================================================
// MIXPANEL
// ============================================================================

export const initializeMixpanel = (token: string) => {
  // Load Mixpanel script
  const script = document.createElement("script");
  script.textContent = `(function(f){if(!f.__SV){var e,b,g,a;window.mixpanel=f;f._i=[];f.init=function(e,b,g){function c(b,f){var a=f.split(".");2==a.length&&(b=b[a[0]],f=a[1]);b[f]=function(){b.push([f].concat(Array.prototype.slice.call(arguments,0)))}}var a=f;"undefined"!=typeof g?a=f[g]=[]:g="mixpanel";a.people=a.people||[];a.toString=function(b){var a="mixpanel";"undefined"!=typeof g&&(a+="."+g);b||(a+=" (stub)");return a};a.people.toString=function(){return a.toString(1)+".people (stub)"};b="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_out opt_out has_opted_in_out clear_opt_in_out start_batch_senders people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(c=0;c<b.length;c++)d(a,b[c]);f._i.push([e,b,g])};f.__SV=1.2}})(document.createElement("script").parentElement);
  mixpanel.init("${token}");`;
  document.head.appendChild(script);
};

export const trackMixpanelEvent = (
  eventName: string,
  eventProperties?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.mixpanel) {
    window.mixpanel.track(eventName, eventProperties);
  }
};

export const setMixpanelUser = (userId: string, userProperties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.mixpanel) {
    window.mixpanel.identify(userId);
    window.mixpanel.people.set(userProperties);
  }
};

// ============================================================================
// CUSTOM EVENTS
// ============================================================================

export interface CustomEvent {
  name: string;
  category: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

const eventQueue: CustomEvent[] = [];

export const trackCustomEvent = (event: Omit<CustomEvent, "timestamp">) => {
  const customEvent: CustomEvent = {
    ...event,
    timestamp: Date.now(),
  };

  eventQueue.push(customEvent);

  // Send to Google Analytics
  trackEvent(event.name, {
    event_category: event.category,
    event_value: event.value,
    ...event.metadata,
  });

  // Send to Mixpanel
  trackMixpanelEvent(event.name, {
    category: event.category,
    value: event.value,
    ...event.metadata,
  });

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics] Event tracked:", customEvent);
  }
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

const performanceMetrics: PerformanceMetric[] = [];

export const trackPerformanceMetric = (
  name: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  const metric: PerformanceMetric = {
    name,
    duration,
    timestamp: Date.now(),
    metadata,
  };

  performanceMetrics.push(metric);

  // Track as custom event
  trackCustomEvent({
    name: "performance_metric",
    category: "performance",
    value: duration,
    metadata: {
      metric_name: name,
      ...metadata,
    },
  });

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${duration}ms`, metadata);
  }
};

export const measureFunctionPerformance = async <T>(
  functionName: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    trackPerformanceMetric(functionName, duration, metadata);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    trackPerformanceMetric(functionName, duration, {
      ...metadata,
      error: true,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};

// ============================================================================
// USER BEHAVIOR TRACKING
// ============================================================================

export interface UserBehaviorEvent {
  type:
    | "page_view"
    | "search"
    | "filter"
    | "result_click"
    | "save"
    | "share"
    | "error";
  page: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export const trackUserBehavior = (event: UserBehaviorEvent) => {
  trackCustomEvent({
    name: `user_${event.type}`,
    category: "user_behavior",
    metadata: {
      page: event.page,
      userId: event.userId,
      ...event.metadata,
    },
  });
};

// ============================================================================
// SEARCH ANALYTICS
// ============================================================================

export interface SearchAnalytics {
  query: string;
  resultsCount: number;
  filters: Record<string, any>;
  timeToResults: number;
  userId?: string;
}

export const trackSearch = (analytics: SearchAnalytics) => {
  trackCustomEvent({
    name: "search",
    category: "search",
    value: analytics.resultsCount,
    metadata: {
      query: analytics.query,
      filters: JSON.stringify(analytics.filters),
      timeToResults: analytics.timeToResults,
      userId: analytics.userId,
    },
  });
};

// ============================================================================
// EMOTION ANALYSIS ANALYTICS
// ============================================================================

export interface EmotionAnalyticsEvent {
  topic: string;
  emotion: string;
  intensity: number;
  region: string;
  userId?: string;
}

export const trackEmotionAnalysis = (event: EmotionAnalyticsEvent) => {
  trackCustomEvent({
    name: "emotion_analysis",
    category: "analysis",
    value: event.intensity,
    metadata: {
      topic: event.topic,
      emotion: event.emotion,
      region: event.region,
      userId: event.userId,
    },
  });
};

// ============================================================================
// CONVERSION TRACKING
// ============================================================================

export interface ConversionEvent {
  type: "signup" | "login" | "upgrade" | "purchase" | "feature_used";
  userId?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export const trackConversion = (event: ConversionEvent) => {
  trackCustomEvent({
    name: `conversion_${event.type}`,
    category: "conversion",
    value: event.value,
    metadata: {
      userId: event.userId,
      ...event.metadata,
    },
  });
};

// ============================================================================
// ERROR TRACKING
// ============================================================================

export interface ErrorEvent {
  message: string;
  stack?: string;
  page: string;
  userId?: string;
  severity: "low" | "medium" | "high" | "critical";
}

export const trackError = (error: ErrorEvent) => {
  trackCustomEvent({
    name: "error",
    category: "error",
    metadata: {
      message: error.message,
      stack: error.stack,
      page: error.page,
      userId: error.userId,
      severity: error.severity,
    },
  });
};

// ============================================================================
// ANALYTICS DASHBOARD
// ============================================================================

export const getAnalyticsSummary = () => {
  return {
    totalEvents: eventQueue.length,
    totalMetrics: performanceMetrics.length,
    averagePerformance:
      performanceMetrics.length > 0
        ? performanceMetrics.reduce((sum, m) => sum + m.duration, 0) /
          performanceMetrics.length
        : 0,
    events: eventQueue,
    metrics: performanceMetrics,
  };
};

export const clearAnalyticsData = () => {
  eventQueue.length = 0;
  performanceMetrics.length = 0;
};

// ============================================================================
// TYPE DEFINITIONS FOR WINDOW
// ============================================================================

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    mixpanel: any;
  }
}
