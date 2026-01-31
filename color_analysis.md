# تحليل مشكلة الألوان

## البيانات من السجلات
- Libya: gmi=10, cfi=60, hri=45 → mood=neutral, color=#E9C46A (أصفر)
- Egypt: gmi=-5, cfi=61, hri=41 → mood=fear, color=#F4A261 (برتقالي)
- USA: gmi=17, cfi=56, hri=47 → mood=neutral, color=#E9C46A (أصفر)
- Brazil: gmi=4, cfi=70, hri=48 → mood=fear, color=#F4A261 (برتقالي)
- Japan: gmi=2, cfi=75, hri=47 → mood=fear, color=#F4A261 (برتقالي)

## المشكلة
- الألوان تُحسب بشكل صحيح في الكود
- لكن معظم الدول تقع في نطاق neutral أو fear
- لا توجد دول بـ hope (أخضر) أو anger (أحمر) أو calm (أزرق)

## السبب
- دالة getMoodFromIndices تعتمد على:
  - CFI > 60 → fear (برتقالي)
  - CFI > 45 → neutral (أصفر)
  - HRI > 60 → hope (أخضر)
  - GMI > 20 → hope (أخضر)
  - GMI > 0 → calm (أزرق)
  - GMI > -20 → neutral (أصفر)
  - GMI > -40 → fear (برتقالي)
  - else → anger (أحمر)

## الحل
- معظم الدول لديها CFI بين 50-75 (خوف متوسط)
- يجب تعديل الحدود لتوزيع أفضل للألوان
