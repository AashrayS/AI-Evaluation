import { Evaluation, EvaluationScores } from "@/types";

// ========== Score Aggregation ==========

export function aggregateScores(evaluations: Evaluation[]): EvaluationScores | null {
  if (evaluations.length === 0) return null;

  const sum = evaluations.reduce(
    (acc, ev) => ({
      speechNaturalness: acc.speechNaturalness + ev.scores.speechNaturalness,
      understandingAccuracy: acc.understandingAccuracy + ev.scores.understandingAccuracy,
      conversationManagement: acc.conversationManagement + ev.scores.conversationManagement,
      taskCompletion: acc.taskCompletion + ev.scores.taskCompletion,
    }),
    { speechNaturalness: 0, understandingAccuracy: 0, conversationManagement: 0, taskCompletion: 0 }
  );

  const n = evaluations.length;
  return {
    speechNaturalness: Math.round((sum.speechNaturalness / n) * 10) / 10,
    understandingAccuracy: Math.round((sum.understandingAccuracy / n) * 10) / 10,
    conversationManagement: Math.round((sum.conversationManagement / n) * 10) / 10,
    taskCompletion: Math.round((sum.taskCompletion / n) * 10) / 10,
  };
}

// ========== Inter-Evaluator Agreement ==========
// Simplified Krippendorff's alpha approximation

export function calculateAgreement(evaluations: Evaluation[]): number {
  if (evaluations.length < 2) return 1;

  const criteria: (keyof EvaluationScores)[] = [
    "speechNaturalness",
    "understandingAccuracy",
    "conversationManagement",
    "taskCompletion",
  ];

  let totalPairs = 0;
  let agreementSum = 0;

  for (const criterion of criteria) {
    for (let i = 0; i < evaluations.length; i++) {
      for (let j = i + 1; j < evaluations.length; j++) {
        const diff = Math.abs(
          evaluations[i].scores[criterion] - evaluations[j].scores[criterion]
        );
        // Scores within 1 point are considered "in agreement"
        agreementSum += diff <= 1 ? 1 : 0;
        totalPairs++;
      }
    }
  }

  return totalPairs > 0 ? agreementSum / totalPairs : 1;
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
    const dev = Math.abs(evaluation.scores[criterion] - goldScores[criterion]);
    deviations[criterion] = dev;
    totalDeviation += dev;
  }

  // Max possible deviation is 4 criteria * 4 points = 16
  const accuracy = 1 - totalDeviation / 16;

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
