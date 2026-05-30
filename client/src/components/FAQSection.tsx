/**
 * FAQ Section Component
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
      question: '  AmalSense',
      answer: 'AmalSense             .     Emotions   .'
    },
    {
      question: '   ',
      answer: '             .       .'
    },
    {
      question: '   Analysis',
      answer: '    94%   .         .'
    },
    {
      question: '   ',
      answer: '      .          .'
    },
    {
      question: '    ',
      answer: '      Dashboard  .    Analysis    .'
    },
    {
      question: '   ',
      answer: '      .    Features     .'
    }
  ];

  const displayFAQs = faqs || defaultFAQs;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2"> </h2>
        <p className="text-muted-foreground">    </p>
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
            <h3 className="font-semibold text-lg">  </h3>
            <p className="text-muted-foreground">
                      
            </p>
            <div className="flex gap-3 justify-center">
              <button className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium">
                 
              </button>
              <button className="px-6 py-2 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/10 transition font-medium">
                
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
