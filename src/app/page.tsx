"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ClipboardCheck,
  Clock,
  Users,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  dashboardMetrics,
  dailyMetrics,
  transcribers,
  evaluations,
  conversations,
} from "@/data/mock-data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import Link from "next/link";

const statusData = [
  {
    name: "Active",
    value: transcribers.filter((t) => t.status === "active").length,
    color: "#34d399",
  },
  {
    name: "Warned",
    value: transcribers.filter((t) => t.status === "warned").length,
    color: "#fbbf24",
  },
  {
    name: "Blocked",
    value: transcribers.filter((t) => t.status === "blocked").length,
    color: "#f87171",
  },
];

const convStatusData = [
  {
    name: "Completed",
    value: conversations.filter((c) => c.status === "completed").length,
    color: "#34d399",
  },
  {
    name: "In Progress",
    value: conversations.filter((c) => c.status === "in_progress").length,
    color: "#60a5fa",
  },
  {
    name: "Pending",
    value: conversations.filter((c) => c.status === "pending").length,
    color: "#a78bfa",
  },
];

const recentActivity = [
  {
    type: "evaluation",
    message: "Dr. Sarah Chen completed evaluation for Conv #c2",
    time: "2 hours ago",
  },
  {
    type: "strike",
    message: "Strike issued to Amit Kumar — low text density",
    time: "4 hours ago",
  },
  {
    type: "evaluation",
    message: "Maria Rodriguez completed evaluation for Conv #c3",
    time: "6 hours ago",
  },
  {
    type: "block",
    message: "Sneha Reddy blocked — 3 strikes in 7 days",
    time: "1 day ago",
  },
  {
    type: "evaluation",
    message: "Aisha Patel completed gold standard calibration",
    time: "1 day ago",
  },
];

export default function DashboardPage() {
  const m = dashboardMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Voice AI Evaluation Platform overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Conversations"
          value={m.totalConversations.toLocaleString()}
          icon={MessageSquare}
          trend="+12% this week"
          trendUp
        />
        <MetricCard
          title="Evaluations Done"
          value={m.completedEvaluations.toLocaleString()}
          icon={ClipboardCheck}
          trend={`${m.evaluationsToday} today`}
          trendUp
        />
        <MetricCard
          title="Avg Agreement"
          value={`${(m.avgInterAgreement * 100).toFixed(0)}%`}
          icon={TrendingUp}
          trend="Target: >80%"
          trendUp={m.avgInterAgreement >= 0.8}
        />
        <MetricCard
          title="48h Completion"
          value={`${(m.completionRate48h * 100).toFixed(0)}%`}
          icon={Clock}
          trend={`Avg ${Math.round(m.avgEvalTimeSec / 60)}min/eval`}
          trendUp={m.completionRate48h >= 0.9}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Evaluation Throughput */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Evaluation Throughput (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyMetrics}>
                  <defs>
                    <linearGradient id="evalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.015 260)",
                      border: "1px solid oklch(0.25 0.02 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0.01 260)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="evaluations"
                    stroke="#818cf8"
                    strokeWidth={2}
                    fill="url(#evalGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transcriber Status Pie */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transcriber Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.015 260)",
                      border: "1px solid oklch(0.25 0.02 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0.01 260)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {s.name} ({s.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversation Status */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversation Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={convStatusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.015 260)",
                      border: "1px solid oklch(0.25 0.02 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0.01 260)",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {convStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transcriber Quality Alerts */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quality Alerts
            </CardTitle>
            <Link
              href="/transcribers"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertItem
              icon={ShieldAlert}
              name="Sneha Reddy"
              status="blocked"
              detail="3 strikes — blocked"
            />
            <AlertItem
              icon={ShieldAlert}
              name="Rajan Menon"
              status="blocked"
              detail="Instant block — no edits"
            />
            <AlertItem
              icon={AlertTriangle}
              name="Amit Kumar"
              status="warned"
              detail="2 strikes — warned"
            />
            <AlertItem
              icon={AlertTriangle}
              name="Deepak Joshi"
              status="warned"
              detail="2 strikes — warned"
            />
            <AlertItem
              icon={ShieldCheck}
              name="Vikram Singh"
              status="active"
              detail="Top performer — 5.1 density"
            />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    activity.type === "block"
                      ? "bg-red-400"
                      : activity.type === "strike"
                      ? "bg-yellow-400"
                      : "bg-emerald-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground/90 leading-snug">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p
              className={`text-xs mt-1 ${
                trendUp ? "text-emerald-400" : "text-yellow-400"
              }`}
            >
              {trend}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertItem({
  icon: Icon,
  name,
  status,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon
        className={`h-4 w-4 shrink-0 ${
          status === "blocked"
            ? "text-red-400"
            : status === "warned"
            ? "text-yellow-400"
            : "text-emerald-400"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <Badge
        variant={status === "blocked" ? "destructive" : "secondary"}
        className="text-[10px] capitalize"
      >
        {status}
      </Badge>
    </div>
  );
}
