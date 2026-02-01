import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import LiveAnalysis from "./pages/LiveAnalysis";
// Social media data is now fetched in the background, no dedicated page needed
import Theory from "./pages/Theory";
import Weather from "./pages/Weather";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import CaseStudies from "./pages/CaseStudies";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Trends from "./pages/Trends";
import Admin from "./pages/Admin";
import NotificationSettings from "./pages/NotificationSettings";
import Checkout from "./pages/Checkout";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import TopicAnalysisResults from "./pages/TopicAnalysisResults";
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
import OnboardingTour, { useOnboarding } from "./components/OnboardingTour";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/analyzer"} component={Analyzer} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/map"} component={Map} />
      <Route path={"/live"} component={LiveAnalysis} />

      <Route path={"/theory"} component={Theory} />
      <Route path={"/weather"} component={Weather} />
      <Route path={"/about"} component={About} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/case-studies"} component={CaseStudies} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/trends"} component={Trends} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/notifications"} component={NotificationSettings} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/analysis-results"} component={TopicAnalysisResults} />
      <Route path={"/use-cases"} component={UseCases} />
      <Route path={"/compare"} component={CompareCountries} />
      <Route path={"/alerts"} component={CustomAlerts} />
      <Route path={"/api-docs"} component={ApiDocs} />
      <Route path={"/enterprise"} component={EnterpriseDashboard} />
      <Route path={"/topic-timeline"} component={TopicTimeline} />
      <Route path={"/register"} component={Register} />
      <Route path={"/login"} component={Login} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/user-dashboard"} component={UserDashboard} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/followed-topics"} component={FollowedTopics} />
      <Route path={"/journalist"} component={JournalistDashboard} />
      <Route path={"/researcher"} component={ResearcherDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

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
