/**
 * RasaLore AI - Resilient JSON Sanitizer
 * Multi-stage normalization and repair pipeline for open-weight LLM outputs.
 */

export class JsonSanitizer {
  /**
   * Sanitizes, repairs, and parses imperfect model outputs into valid objects.
   * @param {string} rawText - Raw LLM generation string.
   * @returns {{
   *   success: boolean,
   *   data: object|null,
   *   fixedAnomalies: string[],
   *   repairedJsonString: string,
   *   error?: string
   * }}
   */
  static sanitize(rawText) {
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return {
        success: false,
        data: null,
        fixedAnomalies: [],
        repairedJsonString: '',
        error: 'Empty or invalid input text'
      };
    }

    const fixedAnomalies = [];
    let cleaned = rawText.trim();

    // Stage 1: Strip markdown code fences (```json ... ``` or ``` ... ```)
    const codeFenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*(?:```|$)/i);
    if (codeFenceMatch && codeFenceMatch[1]) {
      cleaned = codeFenceMatch[1].trim();
      fixedAnomalies.push('STRIPPED_CODE_FENCE');
    }

    // Stage 2: Locate first '{' or '[' and last '}' or ']' to strip conversational banter
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;

    if (firstBrace !== -1 && firstBracket !== -1) {
      startIdx = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
      startIdx = firstBrace;
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
    }

    const lastBrace = cleaned.lastIndexOf('}');
    const lastBracket = cleaned.lastIndexOf(']');
    let endIdx = Math.max(lastBrace, lastBracket);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      if (startIdx > 0 || endIdx < cleaned.length - 1) {
        cleaned = cleaned.substring(startIdx, endIdx + 1);
        fixedAnomalies.push('TRIMMED_CONVERSATIONAL_TEXT');
      }
    } else if (startIdx !== -1 && endIdx <= startIdx) {
      // Possible truncated output starting at startIdx
      cleaned = cleaned.substring(startIdx);
      if (startIdx > 0) {
        fixedAnomalies.push('TRIMMED_CONVERSATIONAL_TEXT');
      }
    }

    // Stage 3: Fix illegal trailing commas in objects and arrays
    const trailingCommaRegex = /,\s*([}\]])/g;
    if (trailingCommaRegex.test(cleaned)) {
      cleaned = cleaned.replace(trailingCommaRegex, '$1');
      fixedAnomalies.push('FIXED_TRAILING_COMMAS');
    }

    // Stage 4: Attempt native JSON.parse
    try {
      const parsed = JSON.parse(cleaned);
      return {
        success: true,
        data: parsed,
        fixedAnomalies,
        repairedJsonString: cleaned
      };
    } catch (primaryParseError) {
      // Stage 5: Bracket stack repair for truncated responses
      const repaired = JsonSanitizer.repairUnclosedBrackets(cleaned);
      if (repaired && repaired !== cleaned) {
        try {
          // Re-clean trailing commas in repaired text if any were revealed
          const reCleaned = repaired.replace(/,\s*([}\]])/g, '$1');
          const repairedData = JSON.parse(reCleaned);
          fixedAnomalies.push('REPAIRED_UNCLOSED_BRACKETS');
          return {
            success: true,
            data: repairedData,
            fixedAnomalies,
            repairedJsonString: reCleaned
          };
        } catch {
          // Fall through to failure payload
        }
      }

      return {
        success: false,
        data: null,
        fixedAnomalies,
        repairedJsonString: cleaned,
        error: `JSON parse failed: ${primaryParseError.message}`
      };
    }
  }

  /**
   * Scans text outside quotes to track unclosed bracket stack and auto-closes them.
   * @param {string} text - Truncated JSON string.
   * @returns {string|null} - Repaired string with balanced brackets or null.
   */
  static repairUnclosedBrackets(text) {
    if (!text || typeof text !== 'string') return null;

    let inString = false;
    let escape = false;
    const stack = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (char === '\\') {
        escape = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') {
          stack.push('}');
        } else if (char === '[') {
          stack.push(']');
        } else if (char === '}' || char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === char) {
            stack.pop();
          }
        }
      }
    }

    if (stack.length === 0 && !inString) {
      return null;
    }

    let result = text;
    if (inString) {
      result += '"';
    }

    // Strip trailing commas before closing
    result = result.trimEnd().replace(/,\s*$/, '');

    while (stack.length > 0) {
      result += stack.pop();
    }

    return result;
  }
}
