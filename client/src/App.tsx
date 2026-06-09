import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./features/misc/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PageErrorBoundary from "./components/PageErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./features/analysis/Home";
import Analysis from "./features/analysis/Analysis";
// Analyzer page removed - analysis now works directly from Home page
// Map, Live, Trends, Weather pages removed - functionality integrated into results pages
import Theory from "./features/marketing/Theory";
import About from "./features/marketing/About";
import Pricing from "./features/marketing/Pricing";
import Contact from "./features/marketing/Contact";
import HowItWorks from "./features/marketing/HowItWorks";
import CaseStudies from "./features/marketing/CaseStudies";
import FAQ from "./features/marketing/FAQ";
import Blog from "./features/marketing/Blog";
import BlogPost from "./features/marketing/BlogPost";
import Admin from "./features/admin/Admin";
import NotificationSettings from "./features/alerts/NotificationSettings";
import Checkout from "./features/misc/Checkout";
import Terms from "./features/misc/Terms";
import Privacy from "./features/misc/Privacy";
import CountryResults from "./features/results/CountryResults";
import UseCases from "./features/marketing/UseCases";
import CompareCountries from "./features/maps/CompareCountries";
import CustomAlerts from "./features/alerts/CustomAlerts";
import ApiDocs from "./features/misc/ApiDocs";
import TopicTimeline from "./features/results/TopicTimeline";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";
import UserDashboard from "./features/dashboard/UserDashboard";
import Profile from "./features/settings/Profile";
import Reports from "./features/dashboard/Reports";
import FollowedTopics from "./features/dashboard/FollowedTopics";
// Markets page removed - functionality integrated into Smart Analysis
import { AdminDashboard } from "./features/admin/AdminDashboard";
import { ApiManagement } from "./features/admin/ApiManagement";
import OnboardingTour, { useOnboarding } from "./components/OnboardingTour";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useI18n } from "@/i18n";
import SearchPageBound from "./features/misc/SearchPageBound";
import MapsBound from "./features/maps/MapsBound";
import AlertsBound from "./features/alerts/AlertsBound";
import ComparisonBound from "./features/maps/ComparisonBound";
import LiveAnalysis from "./features/analysis/LiveAnalysis";
import Markets from "./features/misc/Markets";
import SettingsPage from "./features/settings/SettingsPage";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import Chat from "./features/misc/Chat";
import Indices from "./features/misc/Indices";
import SystemHealth from "./features/admin/SystemHealth";
import SourceMonitor from "./features/admin/SourceMonitor";
import EmotionalWeather from "./features/analysis/EmotionalWeather";
import NotificationsPage from "./features/dashboard/NotificationsPage";
import { DCFTPage } from "./features/analysis/DCFTPage";
import { EventVectorPage } from "./features/analysis/EventVectorPage";
import EngineDashboard from "./features/analysis/EngineDashboard";
import HistoricalEvents from "./features/results/HistoricalEvents";
import EventComparison from "./features/results/EventComparison";
import EventPrediction from "./features/analysis/EventPrediction";

function LanguageSyncer() {
  const { language: i18nLang } = useI18n();
  const { setLanguage: setLang } = useLanguage();
  React.useEffect(() => {
    setLang(i18nLang as any);
  }, [i18nLang, setLang]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/analysis"} component={Analysis} />
      <Route path={"/system-health"} component={SystemHealth} />
      <Route path={"/source-monitor"} component={SourceMonitor} />
      
      {/* Results Pages - wrapped with PageErrorBoundary */}
      <Route path="/chat">{() => <PageErrorBoundary pageName="Chat"><Chat /></PageErrorBoundary>}</Route>
      <Route path="/country/:code">{(params) => <PageErrorBoundary pageName="CountryResults"><CountryResults /></PageErrorBoundary>}</Route>
      <Route path={"/emotional-weather"} component={EmotionalWeather} />
      <Route path={"/indices"} component={Indices} />
      
      {/* Information Pages */}
      <Route path={"/theory"} component={Theory} />
      <Route path={"/about"} component={About} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/case-studies"} component={CaseStudies} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:id"} component={BlogPost} />
      
      {/* User Pages */}
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/notifications"} component={NotificationsPage} />
      <Route path={"/dcft"} component={DCFTPage} />
      <Route path={"/event-vectors"} component={EventVectorPage} />
      <Route path={"/engine-dashboard"} component={EngineDashboard} />
      <Route path={"/notification-settings"} component={NotificationSettings} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/use-cases"} component={UseCases} />
      <Route path={"/compare"} component={CompareCountries} />
      <Route path={"/alerts"} component={CustomAlerts} />
      <Route path={"/api-docs"} component={ApiDocs} />
      <Route path={"/topic-timeline"} component={TopicTimeline} />
      
      {/* Auth Pages */}
      <Route path={"/register"} component={Register} />
      <Route path={"/login"} component={Login} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      
      {/* User Dashboard Pages */}
      <Route path={"/user-dashboard"} component={UserDashboard} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/followed-topics"} component={FollowedTopics} />
      
      {/* Professional Dashboards */}
      {/* Professional Dashboards Removed */}
      <Route path={"/api-management"} component={ApiManagement} />
      
      {/* Search & Data Pages */}
      <Route path={"/search"} component={SearchPageBound} />
      <Route path={"/maps"} component={MapsBound} />
      <Route path={"/live-alerts"} component={AlertsBound} />
      <Route path={"/comparison"} component={ComparisonBound} />
      <Route path="/live-analysis">{() => <PageErrorBoundary pageName="LiveAnalysis"><LiveAnalysis /></PageErrorBoundary>}</Route>
      <Route path={"/markets"} component={Markets} />
      <Route path={"/settings"} component={SettingsPage} />
      
      {/* Metacognition Dashboard */}
      {/* Advanced Predictions */}
      <Route path={"/historical-events"} component={HistoricalEvents} />
      <Route path={"/event-comparison"} component={EventComparison} />
      <Route path={"/event-prediction"} component={EventPrediction} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { showTour, setShowTour } = useOnboarding();

  return (
    <ErrorBoundary>
      <AnalyticsProvider>
    <LanguageProvider>
      <LanguageSyncer />
            <ThemeProvider
            defaultTheme="dark"
            switchable
          >
        <TooltipProvider>
          <Toaster />
          <Router />
          {showTour && (
                <OnboardingTour
                  onComplete={() => setShowTour(false)}
                  language="en"
                />
              )}
        </TooltipProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
}

export default App;
