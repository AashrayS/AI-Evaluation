import {
  Transcriber,
  TranscriberTask,
  Strike,
  Conversation,
  Evaluation,
  Evaluator,
  DashboardMetrics,
  DailyMetric,
} from "@/types";

// ===================== TRANSCRIBERS =====================

export const transcribers: Transcriber[] = [
  {
    id: "t1", name: "Rahul Sharma", email: "rahul@example.com",
    status: "active", strikes: 0, totalTasks: 142,
    avgTextDensity: 4.2, noEditRate: 0.12,
    joinedAt: "2025-11-15", lastActiveAt: "2026-03-24",
  },
  {
    id: "t2", name: "Priya Patel", email: "priya@example.com",
    status: "active", strikes: 1, totalTasks: 98,
    avgTextDensity: 3.8, noEditRate: 0.18,
    joinedAt: "2025-12-01", lastActiveAt: "2026-03-23",
  },
  {
    id: "t3", name: "Amit Kumar", email: "amit@example.com",
    status: "warned", strikes: 2, totalTasks: 67,
    avgTextDensity: 1.9, noEditRate: 0.45,
    joinedAt: "2026-01-10", lastActiveAt: "2026-03-22",
  },
  {
    id: "t4", name: "Sneha Reddy", email: "sneha@example.com",
    status: "blocked", strikes: 3, totalTasks: 45,
    avgTextDensity: 0.8, noEditRate: 0.72,
    joinedAt: "2026-01-20", lastActiveAt: "2026-03-15",
    blockedAt: "2026-03-15", blockReason: "3 strikes in 7 days — consistent low text density",
  },
  {
    id: "t5", name: "Vikram Singh", email: "vikram@example.com",
    status: "active", strikes: 0, totalTasks: 210,
    avgTextDensity: 5.1, noEditRate: 0.08,
    joinedAt: "2025-10-05", lastActiveAt: "2026-03-24",
  },
  {
    id: "t6", name: "Ananya Gupta", email: "ananya@example.com",
    status: "active", strikes: 0, totalTasks: 175,
    avgTextDensity: 4.7, noEditRate: 0.1,
    joinedAt: "2025-10-20", lastActiveAt: "2026-03-24",
  },
  {
    id: "t7", name: "Deepak Joshi", email: "deepak@example.com",
    status: "warned", strikes: 2, totalTasks: 54,
    avgTextDensity: 2.1, noEditRate: 0.38,
    joinedAt: "2026-02-01", lastActiveAt: "2026-03-21",
  },
  {
    id: "t8", name: "Kavita Nair", email: "kavita@example.com",
    status: "active", strikes: 0, totalTasks: 130,
    avgTextDensity: 4.5, noEditRate: 0.14,
    joinedAt: "2025-11-10", lastActiveAt: "2026-03-24",
  },
  {
    id: "t9", name: "Rajan Menon", email: "rajan@example.com",
    status: "blocked", strikes: 3, totalTasks: 32,
    avgTextDensity: 1.2, noEditRate: 0.65,
    joinedAt: "2026-02-15", lastActiveAt: "2026-03-10",
    blockedAt: "2026-03-10", blockReason: "Extremely low edits — instant block triggered",
  },
  {
    id: "t10", name: "Meera Iyer", email: "meera@example.com",
    status: "active", strikes: 1, totalTasks: 88,
    avgTextDensity: 3.5, noEditRate: 0.2,
    joinedAt: "2025-12-15", lastActiveAt: "2026-03-23",
  },
  {
    id: "t11", name: "Arjun Das", email: "arjun@example.com",
    status: "active", strikes: 0, totalTasks: 156,
    avgTextDensity: 4.9, noEditRate: 0.09,
    joinedAt: "2025-10-25", lastActiveAt: "2026-03-24",
  },
  {
    id: "t12", name: "Pooja Verma", email: "pooja@example.com",
    status: "warned", strikes: 2, totalTasks: 41,
    avgTextDensity: 1.6, noEditRate: 0.52,
    joinedAt: "2026-02-20", lastActiveAt: "2026-03-19",
  },
];

// ===================== TRANSCRIBER TASKS =====================

export const transcriberTasks: TranscriberTask[] = [
  // Rahul - good quality
  { id: "tt1", transcriberId: "t1", audioDurationSec: 120, textLength: 480, textDensity: 4.0, hasEdits: true, editDistance: 45, timeSpentSec: 180, timestamp: "2026-03-24T10:00:00Z", flagged: false },
  { id: "tt2", transcriberId: "t1", audioDurationSec: 90, textLength: 400, textDensity: 4.4, hasEdits: true, editDistance: 32, timeSpentSec: 140, timestamp: "2026-03-23T14:00:00Z", flagged: false },
  { id: "tt3", transcriberId: "t1", audioDurationSec: 150, textLength: 630, textDensity: 4.2, hasEdits: true, editDistance: 55, timeSpentSec: 210, timestamp: "2026-03-22T09:00:00Z", flagged: false },
  // Sneha - bad quality (blocked)
  { id: "tt4", transcriberId: "t4", audioDurationSec: 180, textLength: 90, textDensity: 0.5, hasEdits: false, editDistance: 0, timeSpentSec: 30, timestamp: "2026-03-15T11:00:00Z", flagged: true, flagReason: "Very low text density" },
  { id: "tt5", transcriberId: "t4", audioDurationSec: 120, textLength: 72, textDensity: 0.6, hasEdits: false, editDistance: 0, timeSpentSec: 20, timestamp: "2026-03-14T15:00:00Z", flagged: true, flagReason: "Very low text density" },
  { id: "tt6", transcriberId: "t4", audioDurationSec: 200, textLength: 160, textDensity: 0.8, hasEdits: false, editDistance: 0, timeSpentSec: 45, timestamp: "2026-03-13T10:00:00Z", flagged: true, flagReason: "No edits made" },
  // Amit - warned
  { id: "tt7", transcriberId: "t3", audioDurationSec: 100, textLength: 190, textDensity: 1.9, hasEdits: true, editDistance: 8, timeSpentSec: 60, timestamp: "2026-03-22T12:00:00Z", flagged: true, flagReason: "Low text density" },
  { id: "tt8", transcriberId: "t3", audioDurationSec: 80, textLength: 160, textDensity: 2.0, hasEdits: false, editDistance: 0, timeSpentSec: 40, timestamp: "2026-03-21T16:00:00Z", flagged: true, flagReason: "No edits" },
  // Vikram - high quality
  { id: "tt9", transcriberId: "t5", audioDurationSec: 200, textLength: 1020, textDensity: 5.1, hasEdits: true, editDistance: 78, timeSpentSec: 300, timestamp: "2026-03-24T08:30:00Z", flagged: false },
  { id: "tt10", transcriberId: "t5", audioDurationSec: 150, textLength: 780, textDensity: 5.2, hasEdits: true, editDistance: 62, timeSpentSec: 220, timestamp: "2026-03-23T11:00:00Z", flagged: false },
];

// ===================== STRIKES =====================

export const strikes: Strike[] = [
  { id: "s1", transcriberId: "t3", pattern: "text_density", reason: "Text density 1.9 chars/sec — below threshold of 2.5", severity: "strike", timestamp: "2026-03-20T10:00:00Z", taskIds: ["tt7"] },
  { id: "s2", transcriberId: "t3", pattern: "no_edit", reason: "No edits on 45% of tasks in last 7 days", severity: "warning", timestamp: "2026-03-18T14:00:00Z", taskIds: ["tt8"] },
  { id: "s3", transcriberId: "t4", pattern: "text_density", reason: "Text density 0.5 chars/sec — extremely low", severity: "block", timestamp: "2026-03-15T12:00:00Z", taskIds: ["tt4", "tt5", "tt6"] },
  { id: "s4", transcriberId: "t4", pattern: "text_density", reason: "Text density 0.6 chars/sec — below threshold", severity: "strike", timestamp: "2026-03-14T16:00:00Z", taskIds: ["tt5"] },
  { id: "s5", transcriberId: "t4", pattern: "no_edit", reason: "Zero edits on 72% of tasks", severity: "strike", timestamp: "2026-03-13T11:00:00Z", taskIds: ["tt6"] },
  { id: "s6", transcriberId: "t7", pattern: "text_density", reason: "Text density 2.1 chars/sec — below threshold", severity: "strike", timestamp: "2026-03-19T09:00:00Z", taskIds: [] },
  { id: "s7", transcriberId: "t7", pattern: "no_edit", reason: "No edits on 38% of tasks", severity: "warning", timestamp: "2026-03-17T13:00:00Z", taskIds: [] },
  { id: "s8", transcriberId: "t12", pattern: "text_density", reason: "Text density 1.6 chars/sec — below threshold", severity: "strike", timestamp: "2026-03-18T10:00:00Z", taskIds: [] },
  { id: "s9", transcriberId: "t12", pattern: "no_edit", reason: "No edits on 52% of tasks", severity: "strike", timestamp: "2026-03-16T15:00:00Z", taskIds: [] },
  { id: "s10", transcriberId: "t9", pattern: "text_density", reason: "Instant block — extremely short text for long audio consistently", severity: "block", timestamp: "2026-03-10T14:00:00Z", taskIds: [] },
  { id: "s11", transcriberId: "t2", pattern: "text_density", reason: "Text density 2.3 on one task — minor flag", severity: "warning", timestamp: "2026-03-20T11:00:00Z", taskIds: [] },
  { id: "s12", transcriberId: "t10", pattern: "no_edit", reason: "No edits on 20% of recent tasks — monitoring", severity: "warning", timestamp: "2026-03-21T09:00:00Z", taskIds: [] },
];

// ===================== CONVERSATIONS =====================

export const conversations: Conversation[] = [
  {
    id: "c1", audioUrl: "/audio/conv1.wav",
    transcript: "Hello, I'd like to book an appointment for tomorrow morning. Sure, I can help you with that. What time works best for you? Around 10 AM would be perfect. Let me check... Yes, 10 AM is available. I've booked that for you. Thank you!",
    durationSec: 45, model: "VoiceAI-v3.2", status: "completed",
    priority: "medium", createdAt: "2026-03-22T08:00:00Z", completedAt: "2026-03-22T10:30:00Z",
    isGoldStandard: true, category: "Booking",
    goldScores: { speechNaturalness: 4, understandingAccuracy: 5, conversationManagement: 4, taskCompletion: 5 },
  },
  {
    id: "c2", audioUrl: "/audio/conv2.wav",
    transcript: "I'm calling about my recent order. It hasn't arrived yet. Let me look into that for you. Can you provide your order number? It's ORD-5523. I see that your order was shipped yesterday and should arrive by Friday. Would you like tracking information? Yes, please send it to my email.",
    durationSec: 62, model: "VoiceAI-v3.2", status: "completed",
    priority: "high", createdAt: "2026-03-22T09:00:00Z", completedAt: "2026-03-22T11:00:00Z",
    isGoldStandard: false, category: "Support",
  },
  {
    id: "c3", audioUrl: "/audio/conv3.wav",
    transcript: "Hi, I need to cancel my subscription. I understand. May I ask why you'd like to cancel? It's too expensive for me right now. I see. We do have a more affordable plan at $9.99 per month. Would you like to consider that instead? Hmm, that sounds interesting. Tell me more.",
    durationSec: 58, model: "VoiceAI-v3.1", status: "completed",
    priority: "critical", createdAt: "2026-03-21T14:00:00Z", completedAt: "2026-03-21T16:00:00Z",
    isGoldStandard: false, category: "Retention",
  },
  {
    id: "c4", audioUrl: "/audio/conv4.wav",
    transcript: "Can you help me reset my password? Of course! I'll send a reset link to your registered email. What email do you have on file? It should be john@email.com. I've sent the link. Please check your inbox. Got it, thanks!",
    durationSec: 35, model: "VoiceAI-v3.2", status: "pending",
    priority: "low", createdAt: "2026-03-23T10:00:00Z",
    isGoldStandard: false, category: "Support",
  },
  {
    id: "c5", audioUrl: "/audio/conv5.wav",
    transcript: "I want to file a complaint about the service I received last week. I'm sorry to hear that. Can you describe what happened? The technician was late by two hours and didn't complete the job properly. I sincerely apologize for that experience. Let me escalate this to our quality team right away.",
    durationSec: 72, model: "VoiceAI-v3.1", status: "pending",
    priority: "critical", createdAt: "2026-03-23T11:00:00Z",
    isGoldStandard: false, category: "Complaint",
  },
  {
    id: "c6", audioUrl: "/audio/conv6.wav",
    transcript: "What are your business hours? We're open Monday to Friday, 9 AM to 6 PM. Are you open on weekends? We have limited hours on Saturday, 10 AM to 2 PM. We're closed on Sundays. Thank you for the information.",
    durationSec: 28, model: "VoiceAI-v3.2", status: "pending",
    priority: "low", createdAt: "2026-03-23T12:00:00Z",
    isGoldStandard: true, category: "General Inquiry",
    goldScores: { speechNaturalness: 5, understandingAccuracy: 5, conversationManagement: 5, taskCompletion: 5 },
  },
  {
    id: "c7", audioUrl: "/audio/conv7.wav",
    transcript: "I'd like to upgrade my plan. Sure! Let me show you what's available. We have Premium at $29.99 and Enterprise at $49.99. What features are included in Premium? Premium includes unlimited calls, priority support, and analytics dashboard.",
    durationSec: 48, model: "VoiceAI-v3.2", status: "in_progress",
    assignedTo: "e1", priority: "medium", createdAt: "2026-03-23T14:00:00Z",
    isGoldStandard: false, category: "Sales",
  },
  {
    id: "c8", audioUrl: "/audio/conv8.wav",
    transcript: "My internet isn't working. I understand how frustrating that must be. Let me run a diagnostic on your connection. Can you tell me if the router lights are on? Yes, all lights are green. Okay, I see there's an outage in your area. It should be resolved within 2 hours.",
    durationSec: 55, model: "VoiceAI-v3.1", status: "in_progress",
    assignedTo: "e2", priority: "high", createdAt: "2026-03-23T15:00:00Z",
    isGoldStandard: false, category: "Technical Support",
  },
  {
    id: "c9", audioUrl: "/audio/conv9.wav",
    transcript: "Hello. I need appointment. When? Tomorrow. What time? Morning. 9 AM okay? Yes. Booked. Bye.",
    durationSec: 40, model: "VoiceAI-v2.5", status: "pending",
    priority: "medium", createdAt: "2026-03-24T08:00:00Z",
    isGoldStandard: false, category: "Booking",
  },
  {
    id: "c10", audioUrl: "/audio/conv10.wav",
    transcript: "I'd like to schedule a home inspection. Certainly! What's the address of the property? It's 123 Oak Street, Springfield. And when would you like the inspection? Next Wednesday if possible. Let me check... Wednesday at 2 PM is available. I'll confirm via text. Perfect, thank you!",
    durationSec: 65, model: "VoiceAI-v3.2", status: "pending",
    priority: "medium", createdAt: "2026-03-24T09:00:00Z",
    isGoldStandard: false, category: "Booking",
  },
];

// ===================== EVALUATORS =====================

export const evaluators: Evaluator[] = [
  {
    id: "e1", name: "Dr. Sarah Chen", email: "sarah@eval.com",
    totalEvaluations: 234, avgTimePerEvalSec: 195,
    avgScores: { speechNaturalness: 3.8, understandingAccuracy: 4.1, conversationManagement: 3.5, taskCompletion: 4.2 },
    goldStandardAccuracy: 0.92, interAgreement: 0.87, isActive: true, lastEvaluationAt: "2026-03-24T09:00:00Z",
  },
  {
    id: "e2", name: "James Wilson", email: "james@eval.com",
    totalEvaluations: 189, avgTimePerEvalSec: 210,
    avgScores: { speechNaturalness: 3.6, understandingAccuracy: 3.9, conversationManagement: 3.7, taskCompletion: 4.0 },
    goldStandardAccuracy: 0.88, interAgreement: 0.84, isActive: true, lastEvaluationAt: "2026-03-24T08:30:00Z",
  },
  {
    id: "e3", name: "Maria Rodriguez", email: "maria@eval.com",
    totalEvaluations: 312, avgTimePerEvalSec: 165,
    avgScores: { speechNaturalness: 4.0, understandingAccuracy: 4.3, conversationManagement: 3.8, taskCompletion: 4.4 },
    goldStandardAccuracy: 0.95, interAgreement: 0.91, isActive: true, lastEvaluationAt: "2026-03-23T17:00:00Z",
  },
  {
    id: "e4", name: "David Kim", email: "david@eval.com",
    totalEvaluations: 156, avgTimePerEvalSec: 240,
    avgScores: { speechNaturalness: 3.4, understandingAccuracy: 3.7, conversationManagement: 3.3, taskCompletion: 3.8 },
    goldStandardAccuracy: 0.82, interAgreement: 0.78, isActive: true, lastEvaluationAt: "2026-03-23T15:00:00Z",
  },
  {
    id: "e5", name: "Aisha Patel", email: "aisha@eval.com",
    totalEvaluations: 278, avgTimePerEvalSec: 180,
    avgScores: { speechNaturalness: 4.1, understandingAccuracy: 4.2, conversationManagement: 3.9, taskCompletion: 4.3 },
    goldStandardAccuracy: 0.93, interAgreement: 0.89, isActive: true, lastEvaluationAt: "2026-03-24T10:00:00Z",
  },
  {
    id: "e6", name: "Tom Bradley", email: "tom@eval.com",
    totalEvaluations: 98, avgTimePerEvalSec: 280,
    avgScores: { speechNaturalness: 3.2, understandingAccuracy: 3.5, conversationManagement: 3.1, taskCompletion: 3.6 },
    goldStandardAccuracy: 0.76, interAgreement: 0.72, isActive: false, lastEvaluationAt: "2026-03-20T14:00:00Z",
  },
  {
    id: "e7", name: "Lisa Tanaka", email: "lisa@eval.com",
    totalEvaluations: 201, avgTimePerEvalSec: 190,
    avgScores: { speechNaturalness: 3.9, understandingAccuracy: 4.0, conversationManagement: 3.6, taskCompletion: 4.1 },
    goldStandardAccuracy: 0.90, interAgreement: 0.86, isActive: true, lastEvaluationAt: "2026-03-24T07:00:00Z",
  },
  {
    id: "e8", name: "Mark Stevens", email: "mark@eval.com",
    totalEvaluations: 145, avgTimePerEvalSec: 220,
    avgScores: { speechNaturalness: 3.5, understandingAccuracy: 3.8, conversationManagement: 3.4, taskCompletion: 3.9 },
    goldStandardAccuracy: 0.85, interAgreement: 0.81, isActive: true, lastEvaluationAt: "2026-03-23T16:00:00Z",
  },
];

// ===================== EVALUATIONS =====================

export const evaluations: Evaluation[] = [
  // Conversation 1 (gold standard) - multiple evaluators
  { id: "ev1", conversationId: "c1", evaluatorId: "e1", scores: { speechNaturalness: 4, understandingAccuracy: 5, conversationManagement: 4, taskCompletion: 5 }, notes: "Clear and natural dialogue. Excellent understanding.", flags: [], createdAt: "2026-03-22T09:30:00Z", timeSpentSec: 180, isGoldStandard: true },
  { id: "ev2", conversationId: "c1", evaluatorId: "e3", scores: { speechNaturalness: 4, understandingAccuracy: 5, conversationManagement: 5, taskCompletion: 5 }, notes: "Very natural flow. Task completed perfectly.", flags: [], createdAt: "2026-03-22T09:45:00Z", timeSpentSec: 160, isGoldStandard: true },
  { id: "ev3", conversationId: "c1", evaluatorId: "e5", scores: { speechNaturalness: 5, understandingAccuracy: 5, conversationManagement: 4, taskCompletion: 5 }, notes: "Excellent across the board.", flags: [], createdAt: "2026-03-22T10:00:00Z", timeSpentSec: 150, isGoldStandard: true },
  // Conversation 2
  { id: "ev4", conversationId: "c2", evaluatorId: "e1", scores: { speechNaturalness: 3, understandingAccuracy: 4, conversationManagement: 4, taskCompletion: 4 }, notes: "Good handling but slight robotic tone.", flags: ["minor_robotic_tone"], createdAt: "2026-03-22T10:30:00Z", timeSpentSec: 200, isGoldStandard: false },
  { id: "ev5", conversationId: "c2", evaluatorId: "e2", scores: { speechNaturalness: 3, understandingAccuracy: 4, conversationManagement: 3, taskCompletion: 4 }, notes: "Adequate performance. Some pauses felt unnatural.", flags: [], createdAt: "2026-03-22T10:45:00Z", timeSpentSec: 220, isGoldStandard: false },
  // Conversation 3
  { id: "ev6", conversationId: "c3", evaluatorId: "e3", scores: { speechNaturalness: 4, understandingAccuracy: 4, conversationManagement: 4, taskCompletion: 3 }, notes: "Good retention attempt but task not fully completed.", flags: ["incomplete_task"], createdAt: "2026-03-21T15:00:00Z", timeSpentSec: 190, isGoldStandard: false },
  { id: "ev7", conversationId: "c3", evaluatorId: "e4", scores: { speechNaturalness: 3, understandingAccuracy: 3, conversationManagement: 3, taskCompletion: 3 }, notes: "Average overall. AI didn't close the retention offer.", flags: [], createdAt: "2026-03-21T15:30:00Z", timeSpentSec: 250, isGoldStandard: false },
  { id: "ev8", conversationId: "c3", evaluatorId: "e7", scores: { speechNaturalness: 4, understandingAccuracy: 4, conversationManagement: 4, taskCompletion: 4 }, notes: "Well-handled retention conversation.", flags: [], createdAt: "2026-03-21T15:45:00Z", timeSpentSec: 175, isGoldStandard: false },
];

// ===================== DASHBOARD METRICS =====================

export const dashboardMetrics: DashboardMetrics = {
  totalConversations: 847,
  completedEvaluations: 623,
  pendingEvaluations: 224,
  avgInterAgreement: 0.84,
  transcribersBlocked: 2,
  transcribersWarned: 3,
  avgEvalTimeSec: 198,
  completionRate48h: 0.91,
  evaluationsToday: 34,
  evaluationsThisWeek: 187,
};

// ===================== DAILY METRICS =====================

export const dailyMetrics: DailyMetric[] = [
  { date: "Mar 18", evaluations: 28, avgTime: 210, agreement: 0.82 },
  { date: "Mar 19", evaluations: 35, avgTime: 195, agreement: 0.85 },
  { date: "Mar 20", evaluations: 42, avgTime: 188, agreement: 0.83 },
  { date: "Mar 21", evaluations: 31, avgTime: 205, agreement: 0.86 },
  { date: "Mar 22", evaluations: 38, avgTime: 192, agreement: 0.84 },
  { date: "Mar 23", evaluations: 45, avgTime: 185, agreement: 0.88 },
  { date: "Mar 24", evaluations: 34, avgTime: 198, agreement: 0.85 },
];

// ===================== HELPERS =====================

export function getTranscriberById(id: string): Transcriber | undefined {
  return transcribers.find((t) => t.id === id);
}

export function getTasksForTranscriber(transcriberId: string): TranscriberTask[] {
  return transcriberTasks.filter((t) => t.transcriberId === transcriberId);
}

export function getStrikesForTranscriber(transcriberId: string): Strike[] {
  return strikes.filter((s) => s.transcriberId === transcriberId);
}

export function getEvaluationsForConversation(conversationId: string): Evaluation[] {
  return evaluations.filter((e) => e.conversationId === conversationId);
}

export function getEvaluatorById(id: string): Evaluator | undefined {
  return evaluators.find((e) => e.id === id);
}

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
