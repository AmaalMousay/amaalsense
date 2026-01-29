import rateLimit, { Options } from "express-rate-limit";
import helmet from "helmet";
import { Express, Request, Response, NextFunction } from "express";

// Store for tracking suspicious IPs
const suspiciousIPs = new Map<string, { count: number; lastAttempt: Date }>();
const blockedIPs = new Set<string>();

// Rate limiter for general API requests
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use default key generator which handles IPv6 properly
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 auth attempts per hour
  message: {
    error: "Too many authentication attempts, please try again after an hour",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for analysis endpoints (resource-intensive)
export const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 analysis requests per minute
  message: {
    error: "Too many analysis requests, please slow down",
    code: "ANALYSIS_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for contact/newsletter forms (prevent spam)
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 form submissions per hour
  message: {
    error: "Too many form submissions, please try again later",
    code: "FORM_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP blocking middleware
export const ipBlocker = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
  
  if (blockedIPs.has(clientIP)) {
    return res.status(403).json({
      error: "Access denied",
      code: "IP_BLOCKED",
    });
  }
  
  next();
};

// Track suspicious activity
export const suspiciousActivityTracker = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /(\.\.|\/etc\/|\/proc\/)/i, // Path traversal
    /<script|javascript:|on\w+=/i, // XSS attempts
    /union\s+select|drop\s+table|insert\s+into/i, // SQL injection
    /\$\{|\$\(|`/i, // Command injection
  ];
  
  const requestData = JSON.stringify({
    url: req.url,
    body: req.body,
    query: req.query,
  });
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));
  
  if (isSuspicious) {
    const record = suspiciousIPs.get(clientIP) || { count: 0, lastAttempt: new Date() };
    record.count++;
    record.lastAttempt = new Date();
    suspiciousIPs.set(clientIP, record);
    
    // Block IP after 5 suspicious attempts
    if (record.count >= 5) {
      blockedIPs.add(clientIP);
      console.warn(`[Security] Blocked IP ${clientIP} due to suspicious activity`);
      return res.status(403).json({
        error: "Access denied due to suspicious activity",
        code: "SUSPICIOUS_ACTIVITY_BLOCKED",
      });
    }
    
    console.warn(`[Security] Suspicious activity from ${clientIP}: ${req.url}`);
  }
  
  next();
};

// Security headers using Helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://www.paypal.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.manus.im", "https://*.manus.computer", "wss:", "https:"],
      frameSrc: ["'self'", "https://www.paypal.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding external resources
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
  frameguard: { action: "sameorigin" },
});

// Request logging for security audit
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const clientIP = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
  
  // Log request
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: clientIP,
    userAgent: req.headers["user-agent"],
  };
  
  // Log on response finish
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Log suspicious status codes
    if (statusCode >= 400) {
      console.warn(`[Security] ${logData.timestamp} | ${clientIP} | ${req.method} ${req.url} | ${statusCode} | ${duration}ms`);
    }
  });
  
  next();
};

// Input sanitization helper
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return input;
  
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

// Apply all security middleware to Express app
export const applySecurityMiddleware = (app: Express) => {
  // Apply security headers first
  app.use(securityHeaders);
  
  // IP blocker
  app.use(ipBlocker);
  
  // Suspicious activity tracker
  app.use(suspiciousActivityTracker);
  
  // Security logger
  app.use(securityLogger);
  
  // General API rate limiter
  app.use("/api", apiLimiter);
  
  // Stricter limits for auth endpoints
  app.use("/api/oauth", authLimiter);
  
  console.log("[Security] Security middleware applied successfully");
};

// Export blocked IPs management functions
export const blockIP = (ip: string) => {
  blockedIPs.add(ip);
  console.log(`[Security] Manually blocked IP: ${ip}`);
};

export const unblockIP = (ip: string) => {
  blockedIPs.delete(ip);
  suspiciousIPs.delete(ip);
  console.log(`[Security] Unblocked IP: ${ip}`);
};

export const getBlockedIPs = () => Array.from(blockedIPs);

export const getSuspiciousIPs = () => {
  const result: Array<{ ip: string; count: number; lastAttempt: Date }> = [];
  suspiciousIPs.forEach((value, key) => {
    result.push({ ip: key, ...value });
  });
  return result;
};
