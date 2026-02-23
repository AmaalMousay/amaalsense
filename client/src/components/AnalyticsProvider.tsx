/**
 * مزود التحليلات
 * Analytics Provider Component
 * 
 * يتم تهيئة جميع خدمات التحليلات هنا
 */

import React, { useEffect } from "react";
import { useLocation } from "wouter";
import {
  initializeGoogleAnalytics,
  initializeMixpanel,
  trackPageView,
  trackUserBehavior,
} from "@/lib/analytics";
import { useAuth } from "@/_core/hooks/useAuth";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  // Initialize analytics on mount
  useEffect(() => {
    // Initialize Google Analytics
    const gaId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
    if (gaId) {
      initializeGoogleAnalytics(gaId);
    }

    // Initialize Mixpanel (if available)
    const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (mixpanelToken) {
      initializeMixpanel(mixpanelToken);
    }
  }, []);

  // Track page views
  useEffect(() => {
    const pageTitle = document.title || "AmalSense";
    trackPageView(location, pageTitle);

    trackUserBehavior({
      type: "page_view",
      page: location,
      userId: user?.id,
    });
  }, [location, user?.id]);

  return <>{children}</>;
}
