/**
 * Testimonials Section Component
 * قسم شهادات المستخدمين
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const defaultTestimonials: Testimonial[] = [
    {
      name: 'أحمد محمد',
      role: 'محلل بيانات',
      company: 'شركة التكنولوجيا المتقدمة',
      content: 'AmalSense غيّر طريقة فهمنا للاتجاهات العالمية. الدقة والسرعة مذهلة!',
      rating: 5
    },
    {
      name: 'فاطمة علي',
      role: 'مدير مشاريع',
      company: 'مؤسسة البحث الاجتماعي',
      content: 'أداة قيمة جداً لفهم المشاعر الجماعية. تساعدنا في اتخاذ قرارات أفضل.',
      rating: 5
    },
    {
      name: 'محمود إبراهيم',
      role: 'باحث أكاديمي',
      company: 'جامعة الدراسات العليا',
      content: 'البيانات المقدمة موثوقة وشاملة. أفضل منصة للتحليل العاطفي الجماعي.',
      rating: 5
    },
    {
      name: 'ليلى حسن',
      role: 'مستشار استراتيجي',
      company: 'شركة الاستشارات الدولية',
      content: 'تساعدنا في فهم احتياجات السوق بشكل أعمق. استثمار ممتاز!',
      rating: 5
    }
  ];

  const displayTestimonials = testimonials || defaultTestimonials;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">ماذا يقول مستخدمونا</h2>
        <p className="text-muted-foreground">آراء من محترفين يستخدمون AmalSense</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {displayTestimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-slate-600/80 transition"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Quote Icon */}
                <Quote className="h-6 w-6 text-indigo-400 opacity-50" />

                {/* Testimonial Text */}
                <p className="text-muted-foreground italic">{testimonial.content}</p>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-700/30">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-indigo-500/20">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
