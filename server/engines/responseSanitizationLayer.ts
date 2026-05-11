/**
 * Response Sanitization Layer
 * 
 * Cleans and validates LLM responses before JSON parsing
 * Handles common formatting issues and errors
 */

export interface SanitizationResult {
  success: boolean;
  original: string;
  sanitized: string;
  errors: string[];
  warnings: string[];
}

/**
 * Remove markdown code blocks from response
 */
function removeMarkdownCodeBlocks(text: string): string {
  // Remove ```json ... ``` blocks
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Remove ``` at start and end
  cleaned = cleaned.replace(/^```\s*/m, '').replace(/\s*```$/m, '');
  
  return cleaned;
}

/**
 * Remove common formatting issues
 */
function removeCommonIssues(text: string): string {
  let cleaned = text;
  
  // Remove BOM (Byte Order Mark)
  cleaned = cleaned.replace(/^\uFEFF/, '');
  
  // Remove null bytes
  cleaned = cleaned.replace(/\0/g, '');
  
  // Remove control characters except newlines and tabs
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove multiple spaces at start of lines
  cleaned = cleaned.replace(/^\s+/gm, '');
  
  return cleaned;
}

/**
 * Fix common JSON syntax errors
 */
function fixCommonSyntaxErrors(text: string): string {
  let fixed = text;
  
  // Fix trailing commas before closing braces/brackets
  fixed = fixed.replace(/,\s*([}\]])/g, '$1');
  
  // Fix missing quotes around keys (simple cases)
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  
  // Fix single quotes to double quotes for JSON compliance
  fixed = fixed.replace(/:\s*'([^']*)'/g, ': "$1"');
  
  // Fix unquoted values that are strings
  fixed = fixed.replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*([,}\]])/g, (match, value, end) => {
    // Don't quote booleans, null, or numbers
    if (['true', 'false', 'null'].includes(value) || !isNaN(Number(value))) {
      return `: ${value}${end}`;
    }
    return `: "${value}"${end}`;
  });
  
  return fixed;
}

/**
 * Extract JSON from mixed content
 */
function extractJSON(text: string): string {
  // Try to find JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  // Try to find JSON array
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return arrayMatch[0];
  }
  
  return text;
}

/**
 * Validate JSON structure
 */
function validateJSONStructure(json: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(json);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Main sanitization function
 */
export function sanitizeResponse(response: string): SanitizationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sanitized = response;
  
  // Step 1: Remove markdown code blocks
  sanitized = removeMarkdownCodeBlocks(sanitized);
  if (sanitized !== response) {
    warnings.push('Removed markdown code blocks');
  }
  
  // Step 2: Remove common formatting issues
  const beforeClean = sanitized;
  sanitized = removeCommonIssues(sanitized);
  if (sanitized !== beforeClean) {
    warnings.push('Removed formatting issues');
  }
  
  // Step 3: Extract JSON from mixed content
  const beforeExtract = sanitized;
  sanitized = extractJSON(sanitized);
  if (sanitized !== beforeExtract) {
    warnings.push('Extracted JSON from mixed content');
  }
  
  // Step 4: Trim whitespace
  sanitized = sanitized.trim();
  
  // Step 5: Try to fix common syntax errors
  const beforeFix = sanitized;
  sanitized = fixCommonSyntaxErrors(sanitized);
  if (sanitized !== beforeFix) {
    warnings.push('Fixed common syntax errors');
  }
  
  // Step 6: Validate JSON
  const validation = validateJSONStructure(sanitized);
  if (!validation.valid) {
    errors.push(`JSON validation failed: ${validation.error}`);
  }
  
  return {
    success: validation.valid,
    original: response,
    sanitized,
    errors,
    warnings,
  };
}

/**
 * Parse JSON with fallback and error handling
 */
export function parseJSONSafely<T = any>(response: string): { success: boolean; data?: T; error?: string } {
  // First, sanitize the response
  const sanitized = sanitizeResponse(response);
  
  if (!sanitized.success) {
    return {
      success: false,
      error: `Sanitization failed: ${sanitized.errors.join(', ')}`,
    };
  }
  
  try {
    const data = JSON.parse(sanitized.sanitized) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown JSON parsing error',
    };
  }
}

/**
 * Validate and fix response before parsing
 */
export function validateAndFixResponse(response: string): string {
  const sanitized = sanitizeResponse(response);
  return sanitized.sanitized;
}

/**
 * Get sanitization report
 */
export function getSanitizationReport(response: string): string {
  const result = sanitizeResponse(response);
  
  return `
═══════════════════════════════════════════════════════════════
                    SANITIZATION REPORT
═══════════════════════════════════════════════════════════════

Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}

Warnings (${result.warnings.length}):
${result.warnings.map((w, i) => `  ${i + 1}. ${w}`).join('\n')}

Errors (${result.errors.length}):
${result.errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}

Original Length: ${result.original.length} characters
Sanitized Length: ${result.sanitized.length} characters

═══════════════════════════════════════════════════════════════
  `.trim();
}

/**
 * Test sanitization with examples
 */
export function testSanitization() {
  const testCases = [
    // Case 1: Markdown code blocks
    `\`\`\`json
    { "status": "success", "data": { "emotion": "happy" } }
    \`\`\``,
    
    // Case 2: Mixed content
    `The analysis shows:
    { "fear": 0.5, "joy": 0.7 }
    This is important.`,
    
    // Case 3: Trailing commas
    `{ "emotion": "angry", "intensity": 0.8, }`,
    
    // Case 4: Unquoted keys
    `{ emotion: "happy", intensity: 0.9 }`,
    
    // Case 5: Single quotes
    `{ 'emotion': 'sad', 'intensity': 0.6 }`,
  ];
  
  const results = testCases.map((testCase, i) => ({
    index: i + 1,
    input: testCase,
    result: sanitizeResponse(testCase),
  }));
  
  return results;
}
