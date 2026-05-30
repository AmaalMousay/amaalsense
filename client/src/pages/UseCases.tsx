/**
 * Use Cases Page
 * Showcases how different organizations can benefit from Amaalsense
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Building2, 
  Landmark, 
  Newspaper, 
  Heart, 
  TrendingUp, 
  Shield, 
  Target, 
  Bell,
  BarChart3,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  titleAr: string;
  description: string;
  benefits: string[];
  example: string;
  color: string;
}

function UseCaseCard({ icon, title, titleAr, description, benefits, example, color }: UseCaseCardProps) {
  return (
    <Card className={`border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`} style={{ borderColor: color + '40' }}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: color + '20' }}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{titleAr}</CardTitle>
            <CardDescription className="text-sm">{title}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
             Home
          </h4>
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" style={{ color }} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 rounded-lg bg-muted/50">
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color }} />
             
          </h4>
          <p className="text-sm text-muted-foreground">{example}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UseCases() {
  const [, navigate] = useLocation();

  const useCases: UseCaseCardProps[] = [
    {
      icon: <Landmark className="h-6 w-6 text-blue-500" />,
      title: "Governments & Public Sector",
      titleAr: "  ",
      description: "               .",
      benefits: [
        "    ",
        "      ",
        "     ",
        "       "
      ],
      example: "       Anger (CFI)             .",
      color: "#3B82F6"
    },
    {
      icon: <Building2 className="h-6 w-6 text-purple-500" />,
      title: "Corporations & Enterprises",
      titleAr: " ",
      description: "             .",
      benefits: [
        "     ",
        "     ",
        "      ",
        "   "
      ],
      example: "           Sadness      .",
      color: "#8B5CF6"
    },
    {
      icon: <Newspaper className="h-6 w-6 text-orange-500" />,
      title: "Media & News Organizations",
      titleAr: "  ",
      description: "             .",
      benefits: [
        "     ",
        "    ",
        "     ",
        "    "
      ],
      example: "                .",
      color: "#F97316"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "NGOs & Humanitarian Organizations",
      titleAr: "  ",
      description: "            .",
      benefits: [
        "     ",
        "   ",
        "   ",
        "   "
      ],
      example: "       Sadness           .",
      color: "#EF4444"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Financial Institutions",
      titleAr: "  ",
      description: "           .",
      benefits: [
        "     ",
        "      ",
        "      ",
        "   "
      ],
      example: "          Fear       .",
      color: "#22C55E"
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-500" />,
      title: "Security & Intelligence",
      titleAr: " ",
      description: "     Analysis       .",
      benefits: [
        "   ",
        "  ",
        "     ",
        "Analysis   "
      ],
      example: "       Anger       .",
      color: "#06B6D4"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container py-16 text-center">
        <Badge variant="outline" className="mb-4">
          <Globe className="h-3 w-3 ml-1" />
           
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
             <span className="text-primary">Amaalsense</span> 
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Analysis Emotions    
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/pricing")}>
            Get Started
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
             
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-6 bg-primary/5 border-primary/20">
            <div className="text-3xl font-bold text-primary">180+</div>
            <div className="text-sm text-muted-foreground"> </div>
          </Card>
          <Card className="text-center p-6 bg-green-500/5 border-green-500/20">
            <div className="text-3xl font-bold text-green-500">8+</div>
            <div className="text-sm text-muted-foreground"> </div>
          </Card>
          <Card className="text-center p-6 bg-purple-500/5 border-purple-500/20">
            <div className="text-3xl font-bold text-purple-500">24/7</div>
            <div className="text-sm text-muted-foreground"> </div>
          </Card>
          <Card className="text-center p-6 bg-orange-500/5 border-orange-500/20">
            <div className="text-3xl font-bold text-orange-500">70%</div>
            <div className="text-sm text-muted-foreground"> </div>
          </Card>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold text-center mb-8">   Amaalsense</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} {...useCase} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-center mb-8">  </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2"> </h3>
            <p className="text-sm text-muted-foreground">   8+   (  )</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-2">Analysis </h3>
            <p className="text-sm text-muted-foreground">  DCFT (70%) +   (30%)</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-2"> </h3>
            <p className="text-sm text-muted-foreground"> GMI, CFI, HRI   </p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">4</span>
            </div>
            <h3 className="font-semibold mb-2"> Reports</h3>
            <p className="text-sm text-muted-foreground">     </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4"> </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                   Amaalsense  Emotions    
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/pricing")}>
                 
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/analyzer")}>
                 
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
