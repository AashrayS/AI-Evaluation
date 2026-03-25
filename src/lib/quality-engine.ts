import { TranscriberTask } from "@/types";

// ========== Text Density Check ==========

export interface DensityResult {
  density: number;
  level: "good" | "low" | "very_low" | "critical";
  recommendation: string;
}

export function calculateTextDensity(textLength: number, audioDurationSec: number): DensityResult {
  if (audioDurationSec <= 0) return { density: 0, level: "good", recommendation: "Invalid audio duration" };

  const density = textLength / audioDurationSec;

  if (density >= 3.5) {
    return { density, level: "good", recommendation: "Quality looks good" };
  } else if (density >= 2.5) {
    return { density, level: "low", recommendation: "Below average — monitor" };
  } else if (density >= 1.5) {
    return { density, level: "very_low", recommendation: "Issue 1 strike" };
  } else {
    return { density, level: "critical", recommendation: "Consider instant block" };
  }
}

// ========== No-Edit Behavior Check ==========

export interface EditBehaviorResult {
  noEditRate: number;
  level: "good" | "suspect" | "high" | "critical";
  recommendation: string;
}

export function checkNoEditBehavior(tasks: TranscriberTask[]): EditBehaviorResult {
  if (tasks.length === 0) return { noEditRate: 0, level: "good", recommendation: "No tasks to analyze" };

  const noEditTasks = tasks.filter((t) => !t.hasEdits).length;
  const rate = noEditTasks / tasks.length;

  if (rate <= 0.15) {
    return { noEditRate: rate, level: "good", recommendation: "Normal editing behavior" };
  } else if (rate <= 0.3) {
    return { noEditRate: rate, level: "suspect", recommendation: "Monitor — slightly high no-edit rate" };
  } else if (rate <= 0.5) {
    return { noEditRate: rate, level: "high", recommendation: "Issue warning — high no-edit rate" };
  } else {
    return { noEditRate: rate, level: "critical", recommendation: tasks.length >= 30 ? "Block — consistent no-edit behavior" : "Issue strike — need 30+ tasks to block" };
  }
}

// ========== Strike Evaluation ==========

export interface StrikeEvaluation {
  shouldBlock: boolean;
  shouldWarn: boolean;
  reason: string;
  strikesIn7Days: number;
}

export function evaluateStrikeThreshold(
  currentStrikes: number,
  recentStrikeCount: number
): StrikeEvaluation {
  if (recentStrikeCount >= 3) {
    return {
      shouldBlock: true,
      shouldWarn: false,
      reason: `${recentStrikeCount} strikes in 7 days — automatic block`,
      strikesIn7Days: recentStrikeCount,
    };
  }
  if (currentStrikes >= 2) {
    return {
      shouldBlock: false,
      shouldWarn: true,
      reason: `${currentStrikes} total strikes — warned, one more triggers block review`,
      strikesIn7Days: recentStrikeCount,
    };
  }
  return {
    shouldBlock: false,
    shouldWarn: false,
    reason: "Below threshold",
    strikesIn7Days: recentStrikeCount,
  };
}

// ========== Density Level Utils ==========

export function getDensityColor(level: DensityResult["level"]): string {
  switch (level) {
    case "good": return "text-emerald-400";
    case "low": return "text-yellow-400";
    case "very_low": return "text-orange-400";
    case "critical": return "text-red-400";
  }
}

export function getEditBehaviorColor(level: EditBehaviorResult["level"]): string {
  switch (level) {
    case "good": return "text-emerald-400";
    case "suspect": return "text-yellow-400";
    case "high": return "text-orange-400";
    case "critical": return "text-red-400";
  }
}
