/**
 * lib/fuzzy-matching.ts
 * Robust, zero-dependency in-memory fuzzy matching engine.
 * Employs normalized Levenshtein Distance and token-matching heuristics to reconcile 
 * human input spelling errors with our unified pricing registry.
 */

/**
 * Calculates the standard edit-distance (Levenshtein Distance) between two strings.
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[s2.length][s1.length];
}

/**
 * Returns similarity score between 0.0 (completely different) and 1.0 (exact match).
 */
export function stringSimilarity(a: string, b: string): number {
  const normA = a.toLowerCase().trim();
  const normB = b.toLowerCase().trim();
  
  if (normA === normB) return 1.0;
  if (normA.length === 0 || normB.length === 0) return 0.0;

  const maxLen = Math.max(normA.length, normB.length);
  const dist = levenshteinDistance(normA, normB);
  
  return (maxLen - dist) / maxLen;
}

export function resolveFuzzyToolName(
  inputName: string,
  verifiedToolsList: string[],
  matchThreshold = 0.65
): string {
  if (!inputName) return "";
  
  // Heuristic cleanup function to strip domains and trailing punctuation
  const cleanString = (s: string) => s.toLowerCase().trim()
    .replace(/\.(ai|sh|com|io|net|org|app|co|dev)\b/g, "")
    .replace(/[.\/]+$/g, "");

  const normInput = cleanString(inputName);

  // 1. Direct prefix / substring quick-scan (e.g., "Github Copilot Business" -> contains "GitHub Copilot")
  for (const verifiedName of verifiedToolsList) {
    const normVerified = cleanString(verifiedName);
    if (normInput.includes(normVerified) || normVerified.includes(normInput)) {
      return verifiedName;
    }
  }

  // 2. Token-level fuzzy overlap scan (word-by-word with typo tolerance)
  const inputTokens = normInput.split(/\s+/);
  for (const verifiedName of verifiedToolsList) {
    const normVerified = cleanString(verifiedName);
    const verifiedTokens = normVerified.split(/\s+/);
    
    for (const inputTok of inputTokens) {
      if (inputTok.length <= 3) continue;
      for (const verifiedTok of verifiedTokens) {
        if (verifiedTok.length <= 3) continue;
        if (stringSimilarity(inputTok, verifiedTok) >= 0.75) {
          return verifiedName;
        }
      }
    }
  }

  // 3. Fallback: Levenshtein distance check over whole string
  let bestMatch = inputName;
  let bestScore = 0;

  for (const verifiedName of verifiedToolsList) {
    const normVerified = cleanString(verifiedName);
    const score = stringSimilarity(normInput, normVerified);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = verifiedName;
    }
  }

  return bestScore >= matchThreshold ? bestMatch : inputName;
}
