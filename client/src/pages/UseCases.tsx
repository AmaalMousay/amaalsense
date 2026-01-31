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
            الفوائد الرئيسية
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
            مثال عملي
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
      titleAr: "الحكومات والقطاع العام",
      description: "مراقبة المزاج العام للمواطنين والتنبؤ بالأزمات قبل حدوثها، مما يتيح اتخاذ قرارات استباقية وتحسين السياسات العامة.",
      benefits: [
        "التنبؤ بالاضطرابات الاجتماعية قبل تفاقمها",
        "قياس رضا المواطنين عن القرارات الحكومية فوراً",
        "تحديد أفضل توقيت لإعلان السياسات الجديدة",
        "مراقبة الأمن الوطني من خلال رصد التغيرات العاطفية"
      ],
      example: "وزارة الداخلية ترصد ارتفاعاً مفاجئاً في مؤشر الغضب (CFI) في منطقة معينة، فتتخذ إجراءات وقائية قبل تحول الاحتجاجات السلمية إلى أعمال عنف.",
      color: "#3B82F6"
    },
    {
      icon: <Building2 className="h-6 w-6 text-purple-500" />,
      title: "Corporations & Enterprises",
      titleAr: "الشركات والمؤسسات",
      description: "فهم مشاعر السوق والجمهور لاتخاذ قرارات تسويقية واستثمارية ذكية، وإدارة سمعة العلامة التجارية بفعالية.",
      benefits: [
        "إطلاق الحملات التسويقية في الوقت المثالي",
        "رصد سمعة العلامة التجارية وردود الفعل",
        "تقييم المخاطر قبل الاستثمار في أسواق جديدة",
        "فهم احتياجات العملاء العاطفية"
      ],
      example: "شركة اتصالات تؤجل إطلاق حملة إعلانية بعد رصد ارتفاع في مؤشر الحزن بسبب كارثة طبيعية، وتستبدلها برسالة تضامنية.",
      color: "#8B5CF6"
    },
    {
      icon: <Newspaper className="h-6 w-6 text-orange-500" />,
      title: "Media & News Organizations",
      titleAr: "وسائل الإعلام والصحافة",
      description: "معرفة ما يهم الجمهور الآن وتوقع المواضيع الرائجة، لإنتاج محتوى يتفاعل معه القراء والمشاهدون.",
      benefits: [
        "اختيار المواضيع التي تهم الجمهور حالياً",
        "تحديد أفضل توقيت لنشر الأخبار",
        "فهم ردود الفعل على التغطية الإعلامية",
        "توقع الأخبار الرائجة قبل انتشارها"
      ],
      example: "قناة إخبارية ترصد ارتفاعاً في مؤشر الفضول حول موضوع معين، فتُعد تقريراً معمقاً يحقق أعلى نسبة مشاهدة.",
      color: "#F97316"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "NGOs & Humanitarian Organizations",
      titleAr: "المنظمات الإنسانية والخيرية",
      description: "توجيه المساعدات والدعم النفسي للمناطق الأكثر حاجة، وقياس تأثير البرامج الإنسانية على المجتمعات.",
      benefits: [
        "تحديد المناطق الأكثر حاجة للدعم النفسي",
        "قياس تأثير البرامج الإنسانية",
        "رصد الأزمات الإنسانية مبكراً",
        "تقديم تقارير مقنعة للمانحين"
      ],
      example: "منظمة إغاثة ترصد ارتفاعاً حاداً في مؤشر الحزن في منطقة متضررة من زلزال، فتوجه فرق الدعم النفسي إليها فوراً.",
      color: "#EF4444"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Financial Institutions",
      titleAr: "المؤسسات المالية والبنوك",
      description: "تقييم المخاطر الاستثمارية بناءً على الاستقرار العاطفي للأسواق، واتخاذ قرارات مالية مدروسة.",
      benefits: [
        "تقييم مخاطر الاستثمار في دول معينة",
        "التنبؤ بتقلبات السوق بناءً على المزاج العام",
        "فهم ثقة المستهلكين قبل إطلاق منتجات مالية",
        "رصد الأزمات الاقتصادية مبكراً"
      ],
      example: "بنك استثماري يؤجل صفقة استحواذ بعد رصد ارتفاع في مؤشر الخوف في الدولة المستهدفة، مما يوفر خسائر محتملة.",
      color: "#22C55E"
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-500" />,
      title: "Security & Intelligence",
      titleAr: "الأمن والاستخبارات",
      description: "رصد التهديدات الأمنية من خلال تحليل التغيرات العاطفية الجماعية، والتنبؤ بالأحداث قبل وقوعها.",
      benefits: [
        "رصد التطرف والتحريض مبكراً",
        "التنبؤ بالاحتجاجات والتجمعات",
        "مراقبة الرأي العام تجاه قضايا حساسة",
        "تحليل الحملات المعلوماتية المضللة"
      ],
      example: "جهاز أمني يرصد ارتفاعاً مفاجئاً في مؤشر الغضب مع انتشار هاشتاق معين، فيتخذ إجراءات احترازية.",
      color: "#06B6D4"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container py-16 text-center">
        <Badge variant="outline" className="mb-4">
          <Globe className="h-3 w-3 ml-1" />
          حالات الاستخدام
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          كيف يمكن لـ <span className="text-primary">Amaalsense</span> مساعدتك؟
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          اكتشف كيف تستفيد المؤسسات المختلفة من تحليل المشاعر الجماعية لاتخاذ قرارات أفضل
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/pricing")}>
            ابدأ الآن
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
            تواصل معنا
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-6 bg-primary/5 border-primary/20">
            <div className="text-3xl font-bold text-primary">180+</div>
            <div className="text-sm text-muted-foreground">دولة مدعومة</div>
          </Card>
          <Card className="text-center p-6 bg-green-500/5 border-green-500/20">
            <div className="text-3xl font-bold text-green-500">8+</div>
            <div className="text-sm text-muted-foreground">مصادر بيانات</div>
          </Card>
          <Card className="text-center p-6 bg-purple-500/5 border-purple-500/20">
            <div className="text-3xl font-bold text-purple-500">24/7</div>
            <div className="text-sm text-muted-foreground">مراقبة مستمرة</div>
          </Card>
          <Card className="text-center p-6 bg-orange-500/5 border-orange-500/20">
            <div className="text-3xl font-bold text-orange-500">70%</div>
            <div className="text-sm text-muted-foreground">دقة المعادلات</div>
          </Card>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold text-center mb-8">من يستفيد من Amaalsense؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} {...useCase} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-center mb-8">كيف يعمل النظام؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2">جمع البيانات</h3>
            <p className="text-sm text-muted-foreground">نجمع البيانات من 8+ مصادر موثوقة (أخبار، وسائل التواصل)</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold mb-2">التحليل الهجين</h3>
            <p className="text-sm text-muted-foreground">نحلل بمعادلات DCFT (70%) + ذكاء اصطناعي (30%)</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold mb-2">حساب المؤشرات</h3>
            <p className="text-sm text-muted-foreground">نحسب GMI, CFI, HRI لكل دولة وموضوع</p>
          </Card>
          <Card className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">4</span>
            </div>
            <h3 className="font-semibold mb-2">التنبيهات والتقارير</h3>
            <p className="text-sm text-muted-foreground">نرسل تنبيهات فورية ونوفر تقارير احترافية</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              انضم إلى المؤسسات التي تستخدم Amaalsense لفهم المشاعر الجماعية واتخاذ قرارات أفضل
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/pricing")}>
                عرض الأسعار
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/analyzer")}>
                جرب مجاناً
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
