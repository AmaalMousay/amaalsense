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
import SocialAnalysis from "./pages/SocialAnalysis";
import Theory from "./pages/Theory";
import Weather from "./pages/Weather";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/analyzer"} component={Analyzer} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/map"} component={Map} />
      <Route path={"/live"} component={LiveAnalysis} />
      <Route path={"/social"} component={SocialAnalysis} />
      <Route path={"/theory"} component={Theory} />
      <Route path={"/weather"} component={Weather} />
      <Route path={"/about"} component={About} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/contact"} component={Contact} />
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
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
