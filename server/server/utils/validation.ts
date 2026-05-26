import { z } from "zod";

// Sanitization helper
const sanitizeString = (str: string): string => {
  return str
    .replace(/[<>]/g, "") // Remove angle brackets (XSS prevention)
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/\$\{|\$\(/g, "") // Remove template literals
    .trim();
};

// Custom sanitized string type
const sanitizedString = z.string().transform(sanitizeString);

// Email validation with sanitization
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(255, "Email too long")
  .transform(str => str.toLowerCase().trim());

// Headline/text input validation
export const headlineSchema = z
  .string()
  .min(1, "Text cannot be empty")
  .max(1000, "Text too long (max 1000 characters)")
  .transform(sanitizeString);

// Country code validation
export const countryCodeSchema = z
  .string()
  .length(2, "Country code must be 2 characters")
  .transform(str => str.toUpperCase())
  .refine(str => /^[A-Z]{2}$/.test(str), "Invalid country code format");

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().min(1).max(1000).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Date range validation
export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(
  data => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  { message: "Start date must be before end date" }
);

// Contact form validation
export const contactFormSchema = z.object({
  name: sanitizedString
    .pipe(z.string().min(2, "Name too short").max(100, "Name too long")),
  email: emailSchema,
  organization: sanitizedString
    .pipe(z.string().max(200, "Organization name too long"))
    .optional(),
  message: sanitizedString
    .pipe(z.string().min(10, "Message too short").max(2000, "Message too long")),
  type: z.enum(["general", "enterprise", "government", "support"]).default("general"),
});

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: emailSchema,
  name: sanitizedString
    .pipe(z.string().max(100, "Name too long"))
    .optional(),
});

// Alert subscription validation
export const alertSubscriptionSchema = z.object({
  email: emailSchema,
  threshold: z.number().min(0).max(100).default(70),
  alertTypes: z.array(z.enum(["gmi", "cfi", "hri", "all"])).default(["all"]),
});

// Search query validation
export const searchQuerySchema = z
  .string()
  .min(1, "Search query cannot be empty")
  .max(200, "Search query too long")
  .transform(sanitizeString);

// API key validation (for future API access)
export const apiKeySchema = z
  .string()
  .regex(/^ask_[a-zA-Z0-9]{32}$/, "Invalid API key format");

// User ID validation
export const userIdSchema = z
  .string()
  .uuid("Invalid user ID format");

// Subscription tier validation
export const subscriptionTierSchema = z.enum([
  "free",
  "pro",
  "enterprise",
  "government",
]);

// Export format validation
export const exportFormatSchema = z.enum(["pdf", "html", "csv", "json"]);

// Analysis request validation
export const analysisRequestSchema = z.object({
  text: headlineSchema,
  language: z.enum(["en", "ar", "auto"]).default("auto"),
  includeDetails: z.boolean().default(false),
});

// Batch analysis validation (with limits)
export const batchAnalysisSchema = z.object({
  texts: z.array(headlineSchema).min(1).max(50, "Maximum 50 texts per batch"),
  language: z.enum(["en", "ar", "auto"]).default("auto"),
});

// Social media filter validation
export const socialMediaFilterSchema = z.object({
  platforms: z.array(z.enum(["reddit", "mastodon", "bluesky", "youtube", "telegram"])).optional(),
  query: searchQuerySchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["recent", "popular", "relevant"]).default("recent"),
});

// Country analysis request validation
export const countryAnalysisSchema = z.object({
  countryCode: countryCodeSchema,
  timeRange: z.enum(["1h", "6h", "24h", "7d", "30d"]).default("24h"),
});

// Weather forecast request validation
export const weatherForecastSchema = z.object({
  countryCode: countryCodeSchema.optional(),
  daysAhead: z.number().int().min(1).max(7).default(3),
});

// Validation error formatter
export const formatValidationError = (error: z.ZodError<unknown>): string => {
  return error.issues
    .map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`)
    .join("; ");
};

// Type exports
export type ContactForm = z.infer<typeof contactFormSchema>;
export type NewsletterSubscription = z.infer<typeof newsletterSchema>;
export type AlertSubscription = z.infer<typeof alertSubscriptionSchema>;
export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
export type BatchAnalysis = z.infer<typeof batchAnalysisSchema>;
export type SocialMediaFilter = z.infer<typeof socialMediaFilterSchema>;
export type CountryAnalysis = z.infer<typeof countryAnalysisSchema>;
export type WeatherForecast = z.infer<typeof weatherForecastSchema>;
