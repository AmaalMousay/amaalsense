/**
 * MAP DATA ROUTER
 * 
 * يوفر بيانات الخرائط والتوزيع الجغرافي للواجهة الأمامية
 * - خرائط العواطف (Emotion Maps)
 * - الخرائط الحرارية الإقليمية (Regional Heat Maps)
 * - خرائط العالم (World Maps)
 */

import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";

/**
 * بيانات العاطفة لموقع جغرافي
 */
interface LocationEmotionData {
  latitude: number;
  longitude: number;
  location: string;
  country: string;
  region: string;
  emotions: {
    joy: number;
    fear: number;
    anger: number;
    sadness: number;
    hope: number;
    curiosity: number;
  };
  intensity: number;
  dominantEmotion: string;
  timestamp: Date;
}

/**
 * بيانات الخريطة الحرارية الإقليمية
 */
interface RegionalHeatMapData {
  region: string;
  country: string;
  value: number;
  color: string;
  intensity: number;
  emotionalContext: string;
  relatedEvents: string[];
  timestamp: Date;
}

/**
 * بيانات خريطة العالم
 */
interface WorldMapData {
  country: string;
  code: string;
  gmi: number;
  cfi: number;
  hri: number;
  dominantEmotion: string;
  color: string;
  intensity: number;
  population: number;
  significance: number;
  timestamp: Date;
}

export const mapDataRouter = router({
  /**
   * الحصول على بيانات خريطة العواطف
   */
  getEmotionMapData: publicProcedure
    .input(
      z.object({
        region: z.string().optional(),
        country: z.string().optional(),
        limit: z.number().optional().default(100)
      })
    )
    .query(async ({ input }) => {
      try {
        // في التطبيق الحقيقي، سيتم جلب البيانات من قاعدة البيانات
        // هنا نستخدم بيانات تجريبية
        const emotionMapData: LocationEmotionData[] = [
          {
            latitude: 32.8872,
            longitude: 13.1913,
            location: "طرابلس",
            country: "ليبيا",
            region: "الشمال",
            emotions: {
              joy: 35,
              fear: 65,
              anger: 55,
              sadness: 60,
              hope: 40,
              curiosity: 45
            },
            intensity: 58,
            dominantEmotion: "fear",
            timestamp: new Date()
          },
          {
            latitude: 32.1333,
            longitude: 15.4898,
            location: "بنغازي",
            country: "ليبيا",
            region: "الشرق",
            emotions: {
              joy: 40,
              fear: 60,
              anger: 50,
              sadness: 55,
              hope: 45,
              curiosity: 50
            },
            intensity: 52,
            dominantEmotion: "sadness",
            timestamp: new Date()
          },
          {
            latitude: 27.1767,
            longitude: 13.5898,
            location: "سبها",
            country: "ليبيا",
            region: "الجنوب",
            emotions: {
              joy: 45,
              fear: 50,
              anger: 45,
              sadness: 50,
              hope: 50,
              curiosity: 55
            },
            intensity: 49,
            dominantEmotion: "neutral",
            timestamp: new Date()
          }
        ];

        return {
          success: true,
          data: emotionMapData,
          count: emotionMapData.length,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          success: false,
          error: "فشل في جلب بيانات خريطة العواطف",
          data: []
        };
      }
    }),

  /**
   * الحصول على بيانات الخريطة الحرارية الإقليمية
   */
  getRegionalHeatMapData: publicProcedure
    .input(
      z.object({
        country: z.string().optional(),
        timeRange: z.enum(["day", "week", "month", "year"]).optional().default("week")
      })
    )
    .query(async ({ input }) => {
      try {
        const heatMapData: RegionalHeatMapData[] = [
          {
            region: "الشمال الغربي",
            country: "ليبيا",
            value: 75,
            color: "#FF4444",
            intensity: 75,
            emotionalContext: "قلق وخوف مرتفع",
            relatedEvents: ["أحداث أمنية", "توترات سياسية"],
            timestamp: new Date()
          },
          {
            region: "الشرق",
            country: "ليبيا",
            value: 65,
            color: "#FF6644",
            intensity: 65,
            emotionalContext: "حزن وقلق متوسط",
            relatedEvents: ["تطورات اقتصادية", "قضايا اجتماعية"],
            timestamp: new Date()
          },
          {
            region: "الجنوب",
            country: "ليبيا",
            value: 45,
            color: "#FFAA44",
            intensity: 45,
            emotionalContext: "استقرار نسبي",
            relatedEvents: ["نشاطات محدودة"],
            timestamp: new Date()
          }
        ];

        return {
          success: true,
          data: heatMapData,
          count: heatMapData.length,
          timeRange: input.timeRange,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          success: false,
          error: "فشل في جلب بيانات الخريطة الحرارية",
          data: []
        };
      }
    }),

  /**
   * الحصول على بيانات خريطة العالم
   */
  getWorldMapData: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        sortBy: z.enum(["gmi", "cfi", "hri", "intensity"]).optional().default("intensity")
      })
    )
    .query(async ({ input }) => {
      try {
        const worldMapData: WorldMapData[] = [
          {
            country: "ليبيا",
            code: "LY",
            gmi: 45,
            cfi: 52,
            hri: 48,
            dominantEmotion: "fear",
            color: "#FF4444",
            intensity: 58,
            population: 7000000,
            significance: 8,
            timestamp: new Date()
          },
          {
            country: "مصر",
            code: "EG",
            gmi: 55,
            cfi: 60,
            hri: 58,
            dominantEmotion: "hope",
            color: "#FFAA44",
            intensity: 58,
            population: 100000000,
            significance: 9,
            timestamp: new Date()
          },
          {
            country: "تونس",
            code: "TN",
            gmi: 60,
            cfi: 65,
            hri: 62,
            dominantEmotion: "neutral",
            color: "#FFDD44",
            intensity: 62,
            population: 12000000,
            significance: 7,
            timestamp: new Date()
          },
          {
            country: "الجزائر",
            code: "DZ",
            gmi: 58,
            cfi: 62,
            hri: 60,
            dominantEmotion: "hope",
            color: "#FFCC44",
            intensity: 60,
            population: 45000000,
            significance: 8,
            timestamp: new Date()
          },
          {
            country: "المملكة المتحدة",
            code: "GB",
            gmi: 70,
            cfi: 72,
            hri: 71,
            dominantEmotion: "neutral",
            color: "#44FF44",
            intensity: 71,
            population: 67000000,
            significance: 9,
            timestamp: new Date()
          }
        ];

        // ترتيب البيانات حسب المعيار المطلوب
        const sorted = worldMapData.sort((a, b) => {
          if (input.sortBy === "gmi") return b.gmi - a.gmi;
          if (input.sortBy === "cfi") return b.cfi - a.cfi;
          if (input.sortBy === "hri") return b.hri - a.hri;
          return b.intensity - a.intensity;
        });

        return {
          success: true,
          data: sorted.slice(0, input.limit),
          count: sorted.length,
          sortBy: input.sortBy,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          success: false,
          error: "فشل في جلب بيانات خريطة العالم",
          data: []
        };
      }
    }),

  /**
   * الحصول على بيانات موقع جغرافي محدد
   */
  getLocationData: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radius: z.number().optional().default(100) // بالكيلومتر
      })
    )
    .query(async ({ input }) => {
      try {
        // في التطبيق الحقيقي، سيتم حساب المسافة والبحث عن المواقع القريبة
        const nearbyLocations: LocationEmotionData[] = [
          {
            latitude: input.latitude,
            longitude: input.longitude,
            location: "الموقع المحدد",
            country: "ليبيا",
            region: "الشمال",
            emotions: {
              joy: 38,
              fear: 62,
              anger: 52,
              sadness: 58,
              hope: 42,
              curiosity: 48
            },
            intensity: 56,
            dominantEmotion: "fear",
            timestamp: new Date()
          }
        ];

        return {
          success: true,
          data: nearbyLocations,
          radius: input.radius,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          success: false,
          error: "فشل في جلب بيانات الموقع",
          data: []
        };
      }
    }),

  /**
   * الحصول على بيانات الخريطة الحرارية للعالم
   */
  getGlobalHeatMapData: publicProcedure.query(async () => {
    try {
      const globalHeatMapData = [
        {
          country: "ليبيا",
          value: 75,
          color: "#FF4444",
          intensity: "high",
          emotionalState: "قلق وخوف"
        },
        {
          country: "مصر",
          value: 58,
          color: "#FFAA44",
          intensity: "medium",
          emotionalState: "أمل وتوقع"
        },
        {
          country: "تونس",
          value: 62,
          color: "#FFDD44",
          intensity: "medium",
          emotionalState: "استقرار نسبي"
        },
        {
          country: "الجزائر",
          value: 60,
          color: "#FFCC44",
          intensity: "medium",
          emotionalState: "أمل وتفاؤل"
        },
        {
          country: "المملكة المتحدة",
          value: 71,
          color: "#44FF44",
          intensity: "medium-high",
          emotionalState: "استقرار واستثمار"
        }
      ];

      return {
        success: true,
        data: globalHeatMapData,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: "فشل في جلب بيانات الخريطة الحرارية العالمية",
        data: []
      };
    }
  })
});
