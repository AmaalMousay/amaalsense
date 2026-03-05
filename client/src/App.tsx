import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PageErrorBoundary from "./components/PageErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
// Analyzer page removed - analysis now works directly from Home page
import Dashboard from "./pages/Dashboard";
// Map, Live, Trends, Weather pages removed - functionality integrated into results pages
import Theory from "./pages/Theory";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import CaseStudies from "./pages/CaseStudies";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import NotificationSettings from "./pages/NotificationSettings";
import Checkout from "./pages/Checkout";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import TopicAnalysisResults from "./pages/TopicAnalysisResults";
import CountryResults from "./pages/CountryResults";
import UseCases from "./pages/UseCases";
import CompareCountries from "./pages/CompareCountries";
import CustomAlerts from "./pages/CustomAlerts";
import ApiDocs from "./pages/ApiDocs";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import TopicTimeline from "./pages/TopicTimeline";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import FollowedTopics from "./pages/FollowedTopics";
import JournalistDashboard from "./pages/JournalistDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
// Markets page removed - functionality integrated into Smart Analysis
import SmartAnalysis from "./pages/SmartAnalysis";
import MetacognitionDashboard from "./pages/MetacognitionDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import OnboardingTour, { useOnboarding } from "./components/OnboardingTour";
import { NewFeaturesDashboard } from "./pages/NewFeaturesDashboard";
import { LanguageProvider } from "./contexts/LanguageContext";
import SearchPageBound from "./pages/SearchPageBound";
import MapsBound from "./pages/MapsBound";
import AlertsBound from "./pages/AlertsBound";
import ComparisonBound from "./pages/ComparisonBound";
import LiveAnalysis from "./pages/LiveAnalysis";
import Markets from "./pages/Markets";
import SettingsPage from "./pages/SettingsPage";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import Chat from "./pages/Chat";
import Weather from "./pages/Weather";
import Indices from "./pages/Indices";
import SystemHealth from "./pages/SystemHealth";
import SourceMonitor from "./pages/SourceMonitor";
import EmotionalWeather from "./pages/EmotionalWeather";
import NotificationsPage from "./pages/NotificationsPage";
import { DCFTPage } from "./pages/DCFTPage";
import { EventVectorPage } from "./pages/EventVectorPage";
import { TopicAnalysisPage } from "./pages/TopicAnalysisPage";
import EmotionAnalysisPage from "./pages/EmotionAnalysisPage";
import RegionAnalysisPage from "./pages/RegionAnalysisPage";
import ImpactAnalysisPage from "./pages/ImpactAnalysisPage";
import FusionEngineAnalysisPage from "./pages/FusionEngineAnalysisPage";

function Router() {
  // Routes will be added here
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Analyzer route removed - analysis now works from Home page */}
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/system-health"} component={SystemHealth} />
      <Route path={"/source-monitor"} component={SourceMonitor} />
      
      {/* Results Pages - wrapped with PageErrorBoundary */}
      <Route path="/analysis-results">{() => <PageErrorBoundary pageName="TopicAnalysis"><TopicAnalysisResults /></PageErrorBoundary>}</Route>
      <Route path="/country/:code">{(params) => <PageErrorBoundary pageName="CountryResults"><CountryResults /></PageErrorBoundary>}</Route>
      <Route path={"/new-features"} component={NewFeaturesDashboard} />
      <Route path="/chat">{() => <PageErrorBoundary pageName="Chat"><Chat /></PageErrorBoundary>}</Route>
       <Route path={"/weather"} component={Weather} />
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
      <Route path={"/topic-analysis"} component={TopicAnalysisPage} />
      <Route path={"/emotion-analysis"} component={EmotionAnalysisPage} />
      <Route path={"/region-analysis"} component={RegionAnalysisPage} />
      <Route path={"/impact-analysis"} component={ImpactAnalysisPage} />
      <Route path={"/fusion-analysis"} component={FusionEngineAnalysisPage} />
      <Route path={"/notification-settings"} component={NotificationSettings} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/use-cases"} component={UseCases} />
      <Route path={"/compare"} component={CompareCountries} />
      <Route path={"/alerts"} component={CustomAlerts} />
      <Route path={"/api-docs"} component={ApiDocs} />
      <Route path={"/enterprise"} component={EnterpriseDashboard} />
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
      <Route path={"/journalist"} component={JournalistDashboard} />
      <Route path={"/researcher"} component={ResearcherDashboard} />
      {/* Markets route removed - use Smart Analysis instead */}
      
      {/* AI-Powered Smart Analysis - wrapped with PageErrorBoundary */}
      <Route path="/smart-analysis">{() => <PageErrorBoundary pageName="SmartAnalysis"><SmartAnalysis /></PageErrorBoundary>}</Route>
      
      {/* Search & Data Pages */}
      <Route path={"/search"} component={SearchPageBound} />
      <Route path={"/maps"} component={MapsBound} />
      <Route path={"/live-alerts"} component={AlertsBound} />
      <Route path={"/comparison"} component={ComparisonBound} />
      <Route path="/live-analysis">{() => <PageErrorBoundary pageName="LiveAnalysis"><LiveAnalysis /></PageErrorBoundary>}</Route>
      <Route path={"/markets"} component={Markets} />
      <Route path={"/settings"} component={SettingsPage} />
      
      {/* Metacognition Dashboard */}
      <Route path={"/metacognition"} component={MetacognitionDashboard} />
      
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
