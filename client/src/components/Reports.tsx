/**
 * REPORTS COMPONENT
 * 
 * التقارير المتقدمة
 * - تقارير شاملة
 * - تحليلات معمقة
 * - جدولة التقارير
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, PieChart, TrendingUp, Download, Share2, Calendar, Filter, Plus } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'trend' | 'comparison';
  createdDate: Date;
  generatedBy: string;
  period: string;
  status: 'ready' | 'generating' | 'scheduled';
  metrics: {
    gmi: number;
    cfi: number;
    hri: number;
    topicCount: number;
    sourceCount: number;
  };
  insights: string[];
}

interface ReportsProps {
  userId?: string;
  onReportGenerate?: (reportType: string) => void;
}

export function Reports({
  userId,
  onReportGenerate
}: ReportsProps) {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'report-1',
      name: 'تقرير الأسبوع الأخير',
      type: 'summary',
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      generatedBy: 'النظام',
      period: 'آخر 7 أيام',
      status: 'ready',
      metrics: {
        gmi: 65.4,
        cfi: 42.1,
        hri: 71.8,
        topicCount: 245,
        sourceCount: 1250
      },
      insights: [
        'ارتفاع في مؤشر الأمل والمرونة بنسبة 8%',
        'انخفاض في مؤشر الخوف الجماعي بنسبة 3%',
        'زيادة في عدد الموضوعات المتداولة بنسبة 12%'
      ]
    },
    {
      id: 'report-2',
      name: 'تقرير المقارنة الشهري',
      type: 'comparison',
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      generatedBy: 'النظام',
      period: 'آخر 30 يوم',
      status: 'ready',
      metrics: {
        gmi: 63.2,
        cfi: 45.3,
        hri: 68.5,
        topicCount: 890,
        sourceCount: 4500
      },
      insights: [
        'تحسن عام في المؤشرات الرئيسية',
        'تنويع أفضل في المصادر',
        'زيادة في الاهتمام بالموضوعات الاقتصادية'
      ]
    },
    {
      id: 'report-3',
      name: 'تقرير الاتجاهات السنوي',
      type: 'trend',
      createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      generatedBy: 'النظام',
      period: 'آخر 365 يوم',
      status: 'ready',
      metrics: {
        gmi: 62.1,
        cfi: 48.7,
        hri: 65.3,
        topicCount: 3450,
        sourceCount: 12500
      },
      insights: [
        'اتجاه صعودي في الثقة العامة',
        'تقلبات موسمية في مؤشر الخوف',
        'نمو مستقر في المشاركة'
      ]
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'trend' | 'comparison'>('summary');
  const [dateRange, setDateRange] = useState('week');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'summary', name: 'تقرير ملخص', description: 'ملخص سريع للمؤشرات الرئيسية' },
    { id: 'detailed', name: 'تقرير مفصل', description: 'تحليل عميق مع جميع التفاصيل' },
    { id: 'trend', name: 'تقرير الاتجاهات', description: 'تحليل الاتجاهات والتنبؤات' },
    { id: 'comparison', name: 'تقرير المقارنة', description: 'مقارنة بين فترات زمنية مختلفة' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: Report = {
        id: `report-${Date.now()}`,
        name: `تقرير ${reportTypes.find(t => t.id === reportType)?.name}`,
        type: reportType,
        createdDate: new Date(),
        generatedBy: 'المستخدم',
        period: dateRange === 'week' ? 'آخر 7 أيام' : dateRange === 'month' ? 'آخر 30 يوم' : 'آخر 365 يوم',
        status: 'ready',
        metrics: {
          gmi: Math.round(Math.random() * 40 + 50),
          cfi: Math.round(Math.random() * 40 + 30),
          hri: Math.round(Math.random() * 30 + 60),
          topicCount: Math.round(Math.random() * 500 + 200),
          sourceCount: Math.round(Math.random() * 3000 + 1000)
        },
        insights: [
          'رؤية أساسية 1 حول الاتجاهات الحالية',
          'رؤية أساسية 2 حول تطور المؤشرات',
          'رؤية أساسية 3 حول التوقعات المستقبلية'
        ]
      };

      setReports([newReport, ...reports]);
      onReportGenerate?.(reportType);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">التقارير</h2>
          <p className="text-sm text-gray-600 mt-1">
            إنشاء وإدارة التقارير الشاملة والتحليلات المتقدمة
          </p>
        </div>
      </div>

      {/* Generate Report Section */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4">إنشاء تقرير جديد</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Report Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">نوع التقرير</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-600 mt-1">
              {reportTypes.find(t => t.id === reportType)?.description}
            </p>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">نطاق التاريخ</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
            >
              <option value="week">آخر أسبوع</option>
              <option value="month">آخر شهر</option>
              <option value="year">آخر سنة</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`gap-2 w-full ${
            isGenerating
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin">⏳</div>
              جاري إنشاء التقرير...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              إنشاء التقرير
            </>
          )}
        </Button>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-black">التقارير السابقة</h3>

        {reports.length > 0 ? (
          reports.map(report => (
            <Card
              key={report.id}
              className="p-6 border border-gray-200 cursor-pointer hover:border-gray-400 transition"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black">{report.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {report.period} • {report.generatedBy} • {report.createdDate.toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs ${
                  report.status === 'ready'
                    ? 'bg-green-100 text-green-800'
                    : report.status === 'generating'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {report.status === 'ready' && 'جاهز'}
                  {report.status === 'generating' && 'جاري الإنشاء'}
                  {report.status === 'scheduled' && 'مجدول'}
                </Badge>
              </div>

              {/* Metrics Preview */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-xs text-gray-600">GMI</p>
                  <p className="text-lg font-bold text-black">{report.metrics.gmi}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">CFI</p>
                  <p className="text-lg font-bold text-black">{report.metrics.cfi}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">HRI</p>
                  <p className="text-lg font-bold text-black">{report.metrics.hri}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">الموضوعات</p>
                  <p className="text-lg font-bold text-black">{report.metrics.topicCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">المصادر</p>
                  <p className="text-lg font-bold text-black">{report.metrics.sourceCount}</p>
                </div>
              </div>

              {/* Insights */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">الرؤى الأساسية:</p>
                <ul className="space-y-1">
                  {report.insights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Download className="w-4 h-4" />
                  تحميل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteReport(report.id);
                  }}
                >
                  حذف
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 border border-gray-200 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">لا توجد تقارير حالياً</p>
          </Card>
        )}
      </div>

      {/* Scheduled Reports */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          التقارير المجدولة
        </h3>

        <div className="space-y-3">
          {[
            { name: 'التقرير الأسبوعي', schedule: 'كل أحد الساعة 09:00', nextRun: '2024-03-10' },
            { name: 'التقرير الشهري', schedule: 'أول يوم من الشهر الساعة 08:00', nextRun: '2024-04-01' }
          ].map((scheduled, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-black">{scheduled.name}</p>
                <p className="text-xs text-gray-600 mt-1">{scheduled.schedule}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">التشغيل التالي</p>
                <p className="text-sm font-medium text-black">{scheduled.nextRun}</p>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-4 gap-2 bg-gray-100 text-black hover:bg-gray-200">
          <Plus className="w-4 h-4" />
          جدولة تقرير جديد
        </Button>
      </Card>
    </div>
  );
}
