/**
 * Exercise Engine — Like One Console
 * Validates prompts, grades quality, provides feedback.
 * Pure logic — no React. Used by PromptConsole and server-side.
 */

/**
 * Exercise schema:
 * {
 *   id: string,
 *   type: 'prompt' | 'rewrite' | 'compare' | 'freeform' | 'debug' | 'analyze',
 *   instruction: string,
 *   placeholder?: string,
 *   hint?: string,
 *   criteria: {
 *     keywords?: string[],         // must include at least one
 *     requiredKeywords?: string[],  // must include ALL
 *     minLength?: number,           // minimum character count
 *     maxLength?: number,           // maximum character count
 *     mustInclude?: string[],       // exact phrases required
 *     mustNotInclude?: string[],    // phrases that should NOT appear
 *     structure?: 'question' | 'instruction' | 'any',
 *   },
 *   badExample?: string,           // for 'compare' type — the weak prompt
 *   goodExample?: string,          // the strong version
 *   successMessage?: string,
 *   failMessage?: string,
 *   points?: number,               // XP for completion (default 10)
 * }
 */

const QUALITY_DIMENSIONS = [
  { key: 'specificity', label: 'Specificity', weight: 0.3 },
  { key: 'context', label: 'Context', weight: 0.25 },
  { key: 'format', label: 'Format clarity', weight: 0.2 },
  { key: 'constraints', label: 'Constraints', weight: 0.15 },
  { key: 'tone', label: 'Tone/audience', weight: 0.1 },
];

/**
 * Validate a prompt against exercise criteria.
 * Returns { pass: boolean, score: 0-100, feedback: string, dimensions: {} }
 */
export function validatePrompt(prompt, exercise) {
  if (!prompt || !exercise) return { pass: false, score: 0, feedback: 'No prompt provided.' };

  const lower = prompt.toLowerCase().trim();
  const criteria = exercise.criteria || {};
  let score = 0;
  let maxScore = 0;
  const issues = [];

  // Length checks
  if (criteria.minLength) {
    maxScore += 20;
    if (prompt.length >= criteria.minLength) {
      score += 20;
    } else {
      issues.push(`Try making your prompt longer (at least ${criteria.minLength} characters).`);
    }
  }

  if (criteria.maxLength && prompt.length > criteria.maxLength) {
    issues.push(`Your prompt is a bit long. Try to be more concise.`);
  }

  // Keyword checks (at least one)
  if (criteria.keywords && criteria.keywords.length > 0) {
    maxScore += 25;
    const found = criteria.keywords.some(kw => lower.includes(kw.toLowerCase()));
    if (found) {
      score += 25;
    } else {
      issues.push(`Try including relevant details like: ${criteria.keywords.slice(0, 3).join(', ')}.`);
    }
  }

  // Required keywords (all must match)
  if (criteria.requiredKeywords && criteria.requiredKeywords.length > 0) {
    maxScore += 30;
    const missing = criteria.requiredKeywords.filter(kw => !lower.includes(kw.toLowerCase()));
    if (missing.length === 0) {
      score += 30;
    } else {
      const found = criteria.requiredKeywords.length - missing.length;
      score += Math.round((found / criteria.requiredKeywords.length) * 30);
      issues.push(`Missing: ${missing.join(', ')}.`);
    }
  }

  // Must include exact phrases
  if (criteria.mustInclude && criteria.mustInclude.length > 0) {
    maxScore += 15;
    const found = criteria.mustInclude.filter(phrase => lower.includes(phrase.toLowerCase()));
    score += Math.round((found.length / criteria.mustInclude.length) * 15);
    if (found.length < criteria.mustInclude.length) {
      issues.push('Include more specific details in your prompt.');
    }
  }

  // Must NOT include
  if (criteria.mustNotInclude && criteria.mustNotInclude.length > 0) {
    maxScore += 10;
    const bad = criteria.mustNotInclude.filter(phrase => lower.includes(phrase.toLowerCase()));
    if (bad.length === 0) {
      score += 10;
    } else {
      issues.push(`Avoid vague language like: "${bad[0]}".`);
    }
  }

  // Structure check
  if (criteria.structure) {
    maxScore += 10;
    if (criteria.structure === 'question' && (prompt.includes('?') || lower.startsWith('how') || lower.startsWith('what') || lower.startsWith('why'))) {
      score += 10;
    } else if (criteria.structure === 'instruction' && !prompt.includes('?')) {
      score += 10;
    } else if (criteria.structure === 'any') {
      score += 10;
    }
  }

  // Normalize score to 0-100
  const normalizedScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
  const pass = normalizedScore >= 60;

  const feedback = pass
    ? (exercise.successMessage || getSuccessFeedback(normalizedScore))
    : (issues.length > 0 ? issues[0] : (exercise.failMessage || 'Try adding more detail and specificity.'));

  return { pass, score: normalizedScore, feedback, issues };
}

/**
 * Grade prompt quality across multiple dimensions.
 * Returns { overall: 0-100, dimensions: { specificity: 0-100, ... }, grade: 'A'-'F' }
 */
export function gradePrompt(prompt) {
  if (!prompt || prompt.trim().length < 5) {
    return { overall: 0, dimensions: {}, grade: 'F', feedback: 'Write a prompt to get started.' };
  }

  const lower = prompt.toLowerCase();
  const words = prompt.split(/\s+/).length;
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim()).length;

  const dimensions = {};

  // Specificity: longer, more detailed prompts score higher
  const specificityScore = Math.min(100, Math.round(
    (words >= 5 ? 20 : 0) +
    (words >= 10 ? 20 : 0) +
    (words >= 20 ? 20 : 0) +
    (prompt.includes('"') || prompt.includes("'") ? 10 : 0) + // quotes = examples
    (/\d/.test(prompt) ? 10 : 0) + // numbers = specifics
    (words >= 30 ? 20 : 0)
  ));
  dimensions.specificity = specificityScore;

  // Context: mentions who, what, where, background info
  const contextSignals = [
    /\b(i am|i'm|my|we|our)\b/i,   // personal context
    /\b(for|about|regarding)\b/i,    // topic context
    /\b(audience|reader|user|customer|client)\b/i, // audience
    /\b(background|context|situation)\b/i, // explicit context
    /\b(role|expert|specialist|professional)\b/i, // role assignment
  ];
  const contextScore = Math.min(100, contextSignals.filter(r => r.test(prompt)).length * 25);
  dimensions.context = contextScore;

  // Format clarity: specifies desired output format
  const formatSignals = [
    /\b(list|bullet|number|step|format)\b/i,
    /\b(paragraph|sentence|word|section)\b/i,
    /\b(table|chart|json|csv|markdown)\b/i,
    /\b(short|brief|concise|detailed|comprehensive)\b/i,
    /\b(example|template|sample)\b/i,
  ];
  const formatScore = Math.min(100, formatSignals.filter(r => r.test(prompt)).length * 25);
  dimensions.format = formatScore;

  // Constraints: sets boundaries and limits
  const constraintSignals = [
    /\b(don't|do not|avoid|never|without)\b/i,
    /\b(maximum|minimum|at least|no more than|limit)\b/i,
    /\b(only|must|should|require)\b/i,
    /\d+\s*(word|sentence|paragraph|item|point)/i,
  ];
  const constraintScore = Math.min(100, constraintSignals.filter(r => r.test(prompt)).length * 30);
  dimensions.constraints = constraintScore;

  // Tone/audience: specifies voice, audience, or style
  const toneSignals = [
    /\b(tone|voice|style|formal|casual|friendly|professional)\b/i,
    /\b(audience|beginner|expert|child|executive)\b/i,
    /\b(explain like|write as if|pretend|act as)\b/i,
  ];
  const toneScore = Math.min(100, toneSignals.filter(r => r.test(prompt)).length * 40);
  dimensions.tone = toneScore;

  // Overall weighted score
  const overall = Math.round(
    QUALITY_DIMENSIONS.reduce((sum, dim) => sum + (dimensions[dim.key] || 0) * dim.weight, 0)
  );

  const grade = overall >= 90 ? 'A' : overall >= 75 ? 'B' : overall >= 60 ? 'C' : overall >= 40 ? 'D' : 'F';

  const feedback = getGradeFeedback(dimensions, grade);

  return { overall, dimensions, grade, feedback };
}

function getSuccessFeedback(score) {
  if (score >= 90) return 'Excellent! That prompt is specific, contextual, and well-structured.';
  if (score >= 75) return 'Great job! Your prompt covers the key elements.';
  if (score >= 60) return 'Good enough to pass! Try adding more specificity for even better results.';
  return 'Almost there — keep refining.';
}

function getGradeFeedback(dimensions, grade) {
  if (grade === 'A') return 'Outstanding prompt engineering. This prompt would get excellent AI output.';

  // Find weakest dimension
  const weakest = Object.entries(dimensions).sort((a, b) => a[1] - b[1])[0];
  const tips = {
    specificity: 'Add more specific details — numbers, names, concrete examples.',
    context: 'Give background info — who is this for? What\'s the situation?',
    format: 'Specify the output format — list, paragraph, table, length.',
    constraints: 'Add boundaries — what to avoid, word limits, must-haves.',
    tone: 'Define the tone — formal, casual, technical — and who the audience is.',
  };

  return tips[weakest?.[0]] || 'Keep refining your prompt for better results.';
}

export { QUALITY_DIMENSIONS };
