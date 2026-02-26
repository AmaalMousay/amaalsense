/**
 * FAQ Section Component
 * قسم الأسئلة الشائعة
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const defaultFAQs: FAQItem[] = [
    {
      question: 'ما هو AmalSense؟',
      answer: 'AmalSense هو محرك ذكاء عاطفي جماعي يحلل ويفسر العواطف من المصادر الرقمية حول العالم. يستخدم تقنيات متقدمة لفهم المشاعر الجماعية والاتجاهات العالمية.'
    },
    {
      question: 'كيف يتم جمع البيانات؟',
      answer: 'نجمع البيانات من مصادر رقمية متعددة بما في ذلك وسائل التواصل الاجتماعي والأخبار والمنتديات. جميع البيانات يتم معالجتها بشكل آمن وخاص.'
    },
    {
      question: 'ما مدى دقة التحليلات؟',
      answer: 'معدل دقتنا يصل إلى 94% في التنبؤ بالاتجاهات. نستخدم نماذج تعلم آلي متقدمة وتحقق مستمر من الجودة.'
    },
    {
      question: 'هل البيانات آمنة وخاصة؟',
      answer: 'نعم، نحن نلتزم بأعلى معايير الأمان والخصوصية. جميع البيانات مشفرة وتتم معالجتها وفقاً للوائح حماية البيانات الدولية.'
    },
    {
      question: 'كيف يمكنني الوصول إلى البيانات؟',
      answer: 'يمكنك الوصول إلى البيانات من خلال لوحة التحكم الخاصة بك. نوفر تقارير مفصلة وتحليلات قابلة للتخصيص حسب احتياجاتك.'
    },
    {
      question: 'هل هناك خطة مجانية؟',
      answer: 'نعم، نوفر نسخة تجريبية مجانية للمستخدمين الجدد. يمكنك الوصول إلى الميزات الأساسية دون الحاجة لبطاقة ائتمان.'
    }
  ];

  const displayFAQs = faqs || defaultFAQs;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">الأسئلة الشائعة</h2>
        <p className="text-muted-foreground">إجابات على الأسئلة الأكثر شيوعاً</p>
      </div>

      <div className="space-y-3">
        {displayFAQs.map((faq, index) => (
          <Card
            key={index}
            className="border-slate-700/50 bg-slate-800/30 cursor-pointer hover:border-slate-600/80 transition"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      expandedIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {expandedIndex === index && (
                  <div className="pt-3 border-t border-slate-700/30">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="border-slate-700/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-lg">لم تجد إجابتك؟</h3>
            <p className="text-muted-foreground">
              تواصل مع فريق الدعم لدينا للحصول على مساعدة إضافية
            </p>
            <div className="flex gap-3 justify-center">
              <button className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium">
                تواصل معنا
              </button>
              <button className="px-6 py-2 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/10 transition font-medium">
                الوثائق
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
