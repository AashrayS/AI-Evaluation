import { Evaluation, EvaluationScores } from "@/types";

// ========== Score Aggregation ==========

export function aggregateScores(evaluations: Evaluation[]): EvaluationScores | null {
  if (evaluations.length === 0) return null;

  const criteria: (keyof EvaluationScores)[] = [
    "speechNaturalness",
    "understandingAccuracy",
    "conversationManagement",
    "taskCompletion",
  ];

  const result: EvaluationScores = {};

  for (const criterion of criteria) {
    const scores = evaluations
      .map((ev) => ev.scores[criterion])
      .filter((s): s is number => s !== undefined && s !== null);

    if (scores.length > 0) {
      const sum = scores.reduce((a, b) => a + b, 0);
      result[criterion] = Math.round((sum / scores.length) * 10) / 10;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

// ========== Inter-Evaluator Agreement: Cohen's Weighted Kappa ==========
// Uses linear weights on a 1-5 ordinal scale (standard for Likert-type data).
// κ = 1 - (Σ w_ij * p_ij) / (Σ w_ij * p_ie * p_ej)
// W_ij = |i - j| / (k - 1)  where k = number of scale categories (5)

export function calculateWeightedKappa(
  evaluations: Evaluation[],
  criterion: keyof EvaluationScores
): number | null {
  const SCALE_MIN = 1;
  const SCALE_MAX = 5;
  const K = SCALE_MAX - SCALE_MIN + 1; // 5 categories

  // Collect all pairs of scores for this criterion
  const pairs: [number, number][] = [];
  for (let i = 0; i < evaluations.length; i++) {
    for (let j = i + 1; j < evaluations.length; j++) {
      const a = evaluations[i].scores[criterion];
      const b = evaluations[j].scores[criterion];
      if (a !== undefined && b !== undefined) {
        pairs.push([a, b]);
      }
    }
  }

  if (pairs.length === 0) return null;

  // Build score frequency distributions
  const allScores = pairs.flatMap(([a, b]) => [a, b]);
  const countByScore: Record<number, number> = {};
  for (let s = SCALE_MIN; s <= SCALE_MAX; s++) countByScore[s] = 0;
  for (const s of allScores) countByScore[s] = (countByScore[s] || 0) + 1;

  const n = allScores.length;
  const marginals: Record<number, number> = {};
  for (let s = SCALE_MIN; s <= SCALE_MAX; s++) {
    marginals[s] = (countByScore[s] || 0) / n;
  }

  // Linear weight: w_ij = |i - j| / (K - 1)
  const weight = (a: number, b: number) => Math.abs(a - b) / (K - 1);

  // Observed weighted disagreement
  let Po_disagree = 0;
  for (const [a, b] of pairs) Po_disagree += weight(a, b);
  Po_disagree /= pairs.length;

  // Expected weighted disagreement (from marginals)
  let Pe_disagree = 0;
  for (let i = SCALE_MIN; i <= SCALE_MAX; i++) {
    for (let j = SCALE_MIN; j <= SCALE_MAX; j++) {
      Pe_disagree += weight(i, j) * marginals[i] * marginals[j];
    }
  }

  // Avoid division by zero (all scores identical)
  if (Pe_disagree === 0) return 1;

  // κ_w = 1 - (Po_disagree / Pe_disagree)
  return Math.round((1 - Po_disagree / Pe_disagree) * 100) / 100;
}

// Aggregate kappa across all criteria (pool-aware: only scored criteria)
export function calculateAgreement(evaluations: Evaluation[]): number {
  const criteria: (keyof EvaluationScores)[] = [
    "speechNaturalness",
    "understandingAccuracy",
    "conversationManagement",
    "taskCompletion",
  ];

  const kappaValues = criteria
    .map((c) => calculateWeightedKappa(evaluations, c))
    .filter((k): k is number => k !== null);

  if (kappaValues.length === 0) return 1;
  const sum = kappaValues.reduce((a, b) => a + b, 0);
  return Math.round((sum / kappaValues.length) * 100) / 100;
}

// Interpret a kappa value into a human-readable band
export function interpretKappa(kappa: number): {
  label: string;
  color: string;
  description: string;
} {
  if (kappa >= 0.8)
    return { label: "Near-Perfect", color: "text-emerald-400", description: "Highly reliable agreement" };
  if (kappa >= 0.6)
    return { label: "Substantial", color: "text-blue-400", description: "Good consistency, minor rubric drift" };
  if (kappa >= 0.4)
    return { label: "Moderate", color: "text-yellow-400", description: "Some inconsistency — consider calibration" };
  if (kappa >= 0.2)
    return { label: "Fair", color: "text-orange-400", description: "Significant drift — rubric revision needed" };
  return { label: "Poor", color: "text-red-400", description: "Unreliable — immediate calibration required" };
}


// ========== Gold Standard Accuracy ==========

export function checkGoldAccuracy(
  evaluation: Evaluation,
  goldScores: EvaluationScores
): { accuracy: number; deviations: Record<string, number> } {
  const criteria: (keyof EvaluationScores)[] = [
    "speechNaturalness",
    "understandingAccuracy",
    "conversationManagement",
    "taskCompletion",
  ];

  const deviations: Record<string, number> = {};
  let totalDeviation = 0;

  for (const criterion of criteria) {
    const score = evaluation.scores[criterion];
    const gold = goldScores[criterion];

    if (score !== undefined && gold !== undefined) {
      const dev = Math.abs(score - gold);
      deviations[criterion] = dev;
      totalDeviation += dev;
    }
  }

  // Max possible deviation is 4 points per evaluated criterion
  const evaluatedCount = Object.keys(deviations).length;
  const accuracy = evaluatedCount > 0 ? 1 - totalDeviation / (evaluatedCount * 4) : 1;

  return { accuracy, deviations };
}

// ========== Score Level Helpers ==========

export function getScoreLabel(score: number): string {
  if (score >= 4.5) return "Excellent";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Acceptable";
  if (score >= 1.5) return "Below Average";
  return "Poor";
}

export function getScoreColor(score: number): string {
  if (score >= 4.5) return "text-emerald-400";
  if (score >= 3.5) return "text-blue-400";
  if (score >= 2.5) return "text-yellow-400";
  if (score >= 1.5) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBg(score: number): string {
  if (score >= 4.5) return "bg-emerald-500/20";
  if (score >= 3.5) return "bg-blue-500/20";
  if (score >= 2.5) return "bg-yellow-500/20";
  if (score >= 1.5) return "bg-orange-500/20";
  return "bg-red-500/20";
}

// ========== Criterion Descriptions ==========

export const criterionDescriptions: Record<string, Record<number, string>> = {
  speechNaturalness: {
    1: "Completely robotic, unnatural speech patterns",
    2: "Mostly robotic with occasional natural elements",
    3: "Acceptable naturalness, some artificial aspects",
    4: "Mostly natural, minor imperfections",
    5: "Indistinguishable from human speech",
  },
  understandingAccuracy: {
    1: "Failed to understand the user's intent",
    2: "Partially understood with major misinterpretations",
    3: "Understood basic intent, missed nuances",
    4: "Accurate understanding with minor gaps",
    5: "Perfect comprehension of all user intentions",
  },
  conversationManagement: {
    1: "Chaotic flow, poor handling of pauses and interruptions",
    2: "Awkward flow, struggles with turn-taking",
    3: "Acceptable flow, handles basic conversation",
    4: "Smooth flow, handles most situations well",
    5: "Expert flow management, natural turn-taking",
  },
  taskCompletion: {
    1: "Failed to complete the requested task",
    2: "Partially completed with major gaps",
    3: "Completed basic requirements, missed details",
    4: "Successfully completed with minor omissions",
    5: "Perfectly completed all aspects of the task",
  },
};

export const criterionLabels: Record<string, string> = {
  speechNaturalness: "Speech Naturalness",
  understandingAccuracy: "Understanding Accuracy",
  conversationManagement: "Conversation Management",
  taskCompletion: "Task Completion",
};

export function getCriterionColor(criterion: string): string {
  const colors: Record<string, string> = {
    speechNaturalness: "text-blue-400",
    understandingAccuracy: "text-emerald-400",
    conversationManagement: "text-violet-400",
    taskCompletion: "text-orange-400",
  };
  return colors[criterion] || "text-primary";
}

export function getCriterionBg(criterion: string): string {
  const bgs: Record<string, string> = {
    speechNaturalness: "bg-blue-500/10 border-blue-500/20",
    understandingAccuracy: "bg-emerald-500/10 border-emerald-500/20",
    conversationManagement: "bg-violet-500/10 border-violet-500/20",
    taskCompletion: "bg-orange-500/10 border-orange-500/20",
  };
  return bgs[criterion] || "bg-muted";
}

export function getPoolLabel(criteria: string[]): string {
  if (criteria.includes("speechNaturalness") && criteria.includes("conversationManagement")) {
    return "Speech & Flow Specialist";
  }
  if (criteria.includes("understandingAccuracy") && criteria.includes("taskCompletion")) {
    return "Domain & Logic Specialist";
  }
  return "Generalist Evaluator";
}
