import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
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

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Analyzer route removed - analysis now works from Home page */}
      <Route path={"/dashboard"} component={Dashboard} />
      
      {/* Results Pages */}
      <Route path={"/analysis-results"} component={TopicAnalysisResults} />
      <Route path={"/country/:code"} component={CountryResults} />
      <Route path={"/new-features"} component={NewFeaturesDashboard} />
      
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
      <Route path={"/notifications"} component={NotificationSettings} />
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
      
      {/* AI-Powered Smart Analysis */}
      <Route path={"/smart-analysis"} component={SmartAnalysis} />
      
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
    </ErrorBoundary>
  );
}

export default App;
