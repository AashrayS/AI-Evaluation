// ========== Transcriber Quality System Types ==========

export type TranscriberStatus = "active" | "warned" | "blocked";

export interface Transcriber {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: TranscriberStatus;
  strikes: number;
  totalTasks: number;
  avgTextDensity: number; // chars per second of audio
  noEditRate: number; // 0–1
  joinedAt: string;
  blockedAt?: string;
  blockReason?: string;
  lastActiveAt: string;
}

export interface TranscriberTask {
  id: string;
  transcriberId: string;
  audioDurationSec: number;
  textLength: number;
  textDensity: number;
  hasEdits: boolean;
  editDistance: number; // Levenshtein distance from original
  timeSpentSec: number;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
}

export interface Strike {
  id: string;
  transcriberId: string;
  pattern: "text_density" | "no_edit";
  reason: string;
  severity: "warning" | "strike" | "block";
  timestamp: string;
  taskIds: string[];
}

// ========== Conversation Evaluation Types ==========

export type ConversationStatus = "pending" | "in_progress" | "completed";
export type EvaluationPriority = "low" | "medium" | "high" | "critical";

export interface Conversation {
  id: string;
  audioUrl: string;
  transcript: string;
  durationSec: number;
  model: string;
  status: ConversationStatus;
  assignedTo?: string;
  priority: EvaluationPriority;
  createdAt: string;
  completedAt?: string;
  isGoldStandard: boolean;
  goldScores?: EvaluationScores;
  category: string;
}

export interface EvaluationScores {
  speechNaturalness: number; // 1–5
  understandingAccuracy: number; // 1–5
  conversationManagement: number; // 1–5
  taskCompletion: number; // 1–5
}

export interface Evaluation {
  id: string;
  conversationId: string;
  evaluatorId: string;
  scores: EvaluationScores;
  notes: string;
  flags: string[];
  createdAt: string;
  timeSpentSec: number;
  isGoldStandard: boolean;
}

export interface Evaluator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalEvaluations: number;
  avgScores: EvaluationScores;
  avgTimePerEvalSec: number;
  goldStandardAccuracy: number; // 0–1
  interAgreement: number; // 0–1, agreement with peers
  isActive: boolean;
  lastEvaluationAt: string;
}

// ========== Dashboard Types ==========

export interface DashboardMetrics {
  totalConversations: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  avgInterAgreement: number;
  transcribersBlocked: number;
  transcribersWarned: number;
  avgEvalTimeSec: number;
  completionRate48h: number; // 0–1
  evaluationsToday: number;
  evaluationsThisWeek: number;
}

export interface DailyMetric {
  date: string;
  evaluations: number;
  avgTime: number;
  agreement: number;
}

export interface CriterionDistribution {
  score: number;
  count: number;
}
