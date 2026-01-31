# مشاكل عرض الأرقام المكتشفة

## المشكلة الرئيسية
في صفحة نتائج التحليل (TopicAnalysisResults):
- **مستوى الثقة**: يظهر 2742% بدلاً من نسبة صحيحة (0-100%)
- السبب: قيمة confidence تُضرب في 100 مرتين أو تُحسب بشكل خاطئ

## الملفات المتأثرة
1. `/client/src/pages/TopicAnalysisResults.tsx` - عرض confidence
2. `/server/routers.ts` - حساب confidence في analyzeTopicInCountry

## الحل المطلوب
- التأكد من أن confidence تكون بين 0-100
- إذا كانت القيمة أكبر من 100، يجب قسمتها على 100
- إضافة Math.min(100, value) لضمان عدم تجاوز 100%
