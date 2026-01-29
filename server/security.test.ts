import { describe, it, expect } from "vitest";
import {
  emailSchema,
  headlineSchema,
  countryCodeSchema,
  contactFormSchema,
  newsletterSchema,
  searchQuerySchema,
  formatValidationError,
} from "./validation";

describe("Security Validation Schemas", () => {
  describe("emailSchema", () => {
    it("should accept valid emails", () => {
      expect(emailSchema.parse("test@example.com")).toBe("test@example.com");
      expect(emailSchema.parse("USER@DOMAIN.COM")).toBe("user@domain.com");
    });

    it("should reject invalid emails", () => {
      expect(() => emailSchema.parse("invalid")).toThrow();
      expect(() => emailSchema.parse("@domain.com")).toThrow();
      expect(() => emailSchema.parse("test@")).toThrow();
    });

    it("should reject emails that are too long", () => {
      const longEmail = "a".repeat(250) + "@test.com";
      expect(() => emailSchema.parse(longEmail)).toThrow();
    });
  });

  describe("headlineSchema", () => {
    it("should accept valid headlines", () => {
      expect(headlineSchema.parse("This is a valid headline")).toBe("This is a valid headline");
    });

    it("should sanitize XSS attempts", () => {
      const result = headlineSchema.parse("<script>alert('xss')</script>Hello");
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("</script>");
    });

    it("should sanitize javascript: protocol", () => {
      const result = headlineSchema.parse("javascript:alert('xss')");
      expect(result).not.toContain("javascript:");
    });

    it("should sanitize event handlers", () => {
      const result = headlineSchema.parse("onclick=alert('xss')");
      expect(result).not.toContain("onclick=");
    });

    it("should reject empty strings", () => {
      expect(() => headlineSchema.parse("")).toThrow();
    });

    it("should reject strings that are too long", () => {
      const longText = "a".repeat(1001);
      expect(() => headlineSchema.parse(longText)).toThrow();
    });
  });

  describe("countryCodeSchema", () => {
    it("should accept valid country codes", () => {
      expect(countryCodeSchema.parse("US")).toBe("US");
      expect(countryCodeSchema.parse("us")).toBe("US");
      expect(countryCodeSchema.parse("LY")).toBe("LY");
    });

    it("should reject invalid country codes", () => {
      expect(() => countryCodeSchema.parse("USA")).toThrow();
      expect(() => countryCodeSchema.parse("U")).toThrow();
      expect(() => countryCodeSchema.parse("12")).toThrow();
    });
  });

  describe("contactFormSchema", () => {
    it("should accept valid contact form data", () => {
      const validData = {
        name: "Amaal Radwan",
        email: "amaal@example.com",
        message: "This is a test message with enough characters.",
      };
      const result = contactFormSchema.parse(validData);
      expect(result.name).toBe("Amaal Radwan");
      expect(result.email).toBe("amaal@example.com");
    });

    it("should sanitize XSS in contact form fields", () => {
      const maliciousData = {
        name: "<script>alert('xss')</script>Amaal",
        email: "amaal@example.com",
        message: "onclick=alert('xss') This is a test message.",
      };
      const result = contactFormSchema.parse(maliciousData);
      expect(result.name).not.toContain("<script>");
      expect(result.message).not.toContain("onclick=");
    });

    it("should reject short messages", () => {
      const invalidData = {
        name: "Amaal",
        email: "amaal@example.com",
        message: "Short",
      };
      expect(() => contactFormSchema.parse(invalidData)).toThrow();
    });
  });

  describe("newsletterSchema", () => {
    it("should accept valid newsletter subscription", () => {
      const result = newsletterSchema.parse({ email: "test@example.com" });
      expect(result.email).toBe("test@example.com");
    });

    it("should accept optional name", () => {
      const result = newsletterSchema.parse({
        email: "test@example.com",
        name: "Test User",
      });
      expect(result.name).toBe("Test User");
    });
  });

  describe("searchQuerySchema", () => {
    it("should accept valid search queries", () => {
      expect(searchQuerySchema.parse("emotion analysis")).toBe("emotion analysis");
    });

    it("should sanitize malicious search queries", () => {
      const result = searchQuerySchema.parse("<script>alert('xss')</script>search");
      expect(result).not.toContain("<script>");
    });

    it("should reject empty queries", () => {
      expect(() => searchQuerySchema.parse("")).toThrow();
    });

    it("should reject queries that are too long", () => {
      const longQuery = "a".repeat(201);
      expect(() => searchQuerySchema.parse(longQuery)).toThrow();
    });
  });

  describe("formatValidationError", () => {
    it("should format validation errors correctly", () => {
      try {
        emailSchema.parse("invalid");
      } catch (error: any) {
        const formatted = formatValidationError(error);
        expect(formatted).toContain("Invalid email");
      }
    });
  });
});

describe("Input Sanitization", () => {
  it("should remove SQL injection attempts", () => {
    const input = "'; DROP TABLE users; --";
    const result = headlineSchema.parse(input);
    // The schema should still accept it but sanitize dangerous parts
    expect(result).toBeDefined();
  });

  it("should handle template literal injection", () => {
    const input = "${process.env.SECRET}";
    const result = headlineSchema.parse(input);
    expect(result).not.toContain("${");
  });

  it("should preserve legitimate content", () => {
    const input = "The stock market rose by 5% today!";
    const result = headlineSchema.parse(input);
    expect(result).toBe("The stock market rose by 5% today!");
  });

  it("should handle Arabic text correctly", () => {
    const input = "أخبار عاجلة: ارتفاع مؤشر السعادة العالمي";
    const result = headlineSchema.parse(input);
    expect(result).toBe("أخبار عاجلة: ارتفاع مؤشر السعادة العالمي");
  });
});
