"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { evaluators, dailyMetrics, dashboardMetrics } from "@/data/mock-data";
import { RouteGuard } from "@/components/route-guard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const tooltipStyle = {
  background: "oklch(0.17 0.015 260)",
  border: "1px solid oklch(0.25 0.02 260)",
  borderRadius: "8px",
  color: "oklch(0.95 0.01 260)",
};

// Agreement matrix data
const agreementData = evaluators
  .filter((e) => e.isActive)
  .map((e) => ({
    name: e.name.split(" ")[0],
    agreement: Math.round(e.interAgreement * 100),
    goldAccuracy: Math.round(e.goldStandardAccuracy * 100),
  }));

// Radar chart data for avg scores
const radarData = [
  { criterion: "Speech", ...Object.fromEntries(evaluators.filter((e) => e.isActive).slice(0, 4).map((e) => [e.name.split(" ")[0], e.avgScores.speechNaturalness])) },
  { criterion: "Understanding", ...Object.fromEntries(evaluators.filter((e) => e.isActive).slice(0, 4).map((e) => [e.name.split(" ")[0], e.avgScores.understandingAccuracy])) },
  { criterion: "Management", ...Object.fromEntries(evaluators.filter((e) => e.isActive).slice(0, 4).map((e) => [e.name.split(" ")[0], e.avgScores.conversationManagement])) },
  { criterion: "Task", ...Object.fromEntries(evaluators.filter((e) => e.isActive).slice(0, 4).map((e) => [e.name.split(" ")[0], e.avgScores.taskCompletion])) },
];

const radarColors = ["#818cf8", "#34d399", "#fbbf24", "#f87171"];

// Speed data
const speedData = evaluators
  .filter((e) => e.isActive)
  .map((e) => ({
    name: e.name.split(" ")[0],
    avgTime: Math.round(e.avgTimePerEvalSec / 60),
    evals: e.totalEvaluations,
  }))
  .sort((a, b) => b.evals - a.evals);

// Throughput per hour (simulated)
const hourlyThroughput = [
  { hour: "8AM", evals: 3 },
  { hour: "9AM", evals: 5 },
  { hour: "10AM", evals: 7 },
  { hour: "11AM", evals: 8 },
  { hour: "12PM", evals: 4 },
  { hour: "1PM", evals: 6 },
  { hour: "2PM", evals: 9 },
  { hour: "3PM", evals: 7 },
  { hour: "4PM", evals: 5 },
  { hour: "5PM", evals: 3 },
];

export default function MetricsPage() {
  const activeEvaluators = evaluators.filter((e) => e.isActive);

  return (
    <RouteGuard requiredRole="admin">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metrics</h1>
        <p className="text-muted-foreground mt-1">
          Consistency, speed, and reliability tracking
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Inter-Evaluator Agreement"
          value={`${(dashboardMetrics.avgInterAgreement * 100).toFixed(0)}%`}
          icon={Users}
          status={dashboardMetrics.avgInterAgreement >= 0.8 ? "good" : "warn"}
          target="Target: >80%"
        />
        <KpiCard
          label="Avg Eval Time"
          value={`${Math.round(dashboardMetrics.avgEvalTimeSec / 60)}m ${dashboardMetrics.avgEvalTimeSec % 60}s`}
          icon={Clock}
          status={dashboardMetrics.avgEvalTimeSec <= 300 ? "good" : "warn"}
          target="Target: 2-5 min"
        />
        <KpiCard
          label="48h Completion"
          value={`${(dashboardMetrics.completionRate48h * 100).toFixed(0)}%`}
          icon={Target}
          status={dashboardMetrics.completionRate48h >= 0.9 ? "good" : "warn"}
          target="Target: >90%"
        />
        <KpiCard
          label="Weekly Evaluations"
          value={dashboardMetrics.evaluationsThisWeek.toString()}
          icon={TrendingUp}
          status="good"
          target={`${dashboardMetrics.evaluationsToday} today`}
        />
      </div>

      <Tabs defaultValue="consistency">
        <TabsList className="bg-muted">
          <TabsTrigger value="consistency" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Consistency
          </TabsTrigger>
          <TabsTrigger value="speed" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Speed
          </TabsTrigger>
          <TabsTrigger value="reliability" className="gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Reliability
          </TabsTrigger>
        </TabsList>

        {/* ====== CONSISTENCY TAB ====== */}
        <TabsContent value="consistency" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Agreement Bars */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inter-Evaluator Agreement by Person
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agreementData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={70} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="agreement" fill="#818cf8" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Score Patterns by Evaluator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="oklch(0.25 0.02 260)" />
                      <PolarAngleAxis dataKey="criterion" />
                      <PolarRadiusAxis domain={[0, 5]} />
                      {activeEvaluators.slice(0, 4).map((e, i) => (
                        <Radar
                          key={e.id}
                          name={e.name.split(" ")[0]}
                          dataKey={e.name.split(" ")[0]}
                          stroke={radarColors[i]}
                          fill={radarColors[i]}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agreement Trend */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Agreement Trend (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0.7, 1]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown) => `${(Number(value) * 100).toFixed(1)}%`} />
                    <Line type="monotone" dataKey="agreement" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== SPEED TAB ====== */}
        <TabsContent value="speed" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Avg Time per Evaluator */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Time per Evaluation (minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={speedData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={70} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="avgTime" radius={[0, 6, 6, 0]}>
                        {speedData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={entry.avgTime <= 3 ? "#34d399" : entry.avgTime <= 4 ? "#fbbf24" : "#f87171"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hourly Throughput */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Evaluations per Hour (Today)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyThroughput}>
                      <defs>
                        <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="evals" stroke="#34d399" strokeWidth={2} fill="url(#throughputGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Evaluations Trend */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Daily Evaluations (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="evaluations" fill="#818cf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Speed Benchmarks */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Speed Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeEvaluators.slice(0, 6).map((ev) => {
                  const mins = Math.round(ev.avgTimePerEvalSec / 60);
                  const inRange = mins >= 2 && mins <= 5;
                  return (
                    <div key={ev.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {ev.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{ev.name.split(" ")[0]}</span>
                          <span className={`text-xs font-mono ${inRange ? "text-emerald-400" : "text-yellow-400"}`}>
                            {mins}m
                          </span>
                        </div>
                        <Progress value={Math.min((mins / 5) * 100, 100)} className="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== RELIABILITY TAB ====== */}
        <TabsContent value="reliability" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gold Standard Accuracy */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Gold Standard Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agreementData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={70} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="goldAccuracy" radius={[0, 6, 6, 0]}>
                        {agreementData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={
                              entry.goldAccuracy >= 90
                                ? "#34d399"
                                : entry.goldAccuracy >= 80
                                ? "#fbbf24"
                                : "#f87171"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Evaluator Reliability Cards */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Evaluator Reliability Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeEvaluators.map((ev) => {
                  const goldPct = Math.round(ev.goldStandardAccuracy * 100);
                  const agreePct = Math.round(ev.interAgreement * 100);
                  const reliable = goldPct >= 85 && agreePct >= 80;
                  return (
                    <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {ev.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{ev.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Gold: <span className={goldPct >= 90 ? "text-emerald-400" : goldPct >= 80 ? "text-yellow-400" : "text-red-400"}>{goldPct}%</span></span>
                          <span>Agreement: <span className={agreePct >= 85 ? "text-emerald-400" : agreePct >= 75 ? "text-yellow-400" : "text-red-400"}>{agreePct}%</span></span>
                        </div>
                      </div>
                      {reliable ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Model Ranking Stability (simulated) */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Model Ranking Stability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { model: "VoiceAI-v3.2", rank: 1, score: 4.2, stable: true },
                  { model: "VoiceAI-v3.1", rank: 2, score: 3.7, stable: true },
                  { model: "VoiceAI-v2.5", rank: 3, score: 2.9, stable: false },
                ].map((m) => (
                  <div
                    key={m.model}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Rank #{m.rank}
                      </Badge>
                      {m.stable ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                          Stable
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-[10px]">
                          Volatile
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm">{m.model}</p>
                    <p className="text-2xl font-bold mt-1">{m.score.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">avg across criteria</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </RouteGuard>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  status,
  target,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "good" | "warn";
  target: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className={`text-xs mt-1 ${status === "good" ? "text-emerald-400" : "text-yellow-400"}`}>
              {target}
            </p>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${status === "good" ? "bg-emerald-500/10" : "bg-yellow-500/10"}`}>
            <Icon className={`h-5 w-5 ${status === "good" ? "text-emerald-400" : "text-yellow-400"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
