"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  FileText,
  Edit3,
  Ban,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import {
  getTranscriberById,
  getTasksForTranscriber,
  getStrikesForTranscriber,
} from "@/data/mock-data";
import {
  calculateTextDensity,
  checkNoEditBehavior,
  getDensityColor,
  getEditBehaviorColor,
} from "@/lib/quality-engine";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function TranscriberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const transcriber = getTranscriberById(id);

  if (!transcriber) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Transcriber not found</p>
      </div>
    );
  }

  const tasks = getTasksForTranscriber(id);
  const strikeHistory = getStrikesForTranscriber(id);
  const densityResult = calculateTextDensity(
    transcriber.avgTextDensity * 100,
    100
  );
  const editResult = checkNoEditBehavior(tasks);

  // Chart data from tasks
  const chartData = tasks.map((t, i) => ({
    task: `Task ${i + 1}`,
    density: t.textDensity,
    timeSpent: t.timeSpentSec,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/transcribers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
              {transcriber.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-xl font-bold">{transcriber.name}</h1>
              <p className="text-sm text-muted-foreground">
                {transcriber.email}
              </p>
            </div>
          </div>
        </div>
        <StatusBadgeLarge status={transcriber.status} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Tasks"
          value={transcriber.totalTasks.toString()}
          icon={FileText}
        />
        <StatCard
          label="Avg Text Density"
          value={transcriber.avgTextDensity.toFixed(1)}
          icon={Edit3}
          valueColor={getDensityColor(densityResult.level)}
        />
        <StatCard
          label="No-Edit Rate"
          value={`${(transcriber.noEditRate * 100).toFixed(0)}%`}
          icon={AlertTriangle}
          valueColor={
            transcriber.noEditRate > 0.4
              ? "text-red-400"
              : transcriber.noEditRate > 0.25
              ? "text-yellow-400"
              : "text-emerald-400"
          }
        />
        <StatCard
          label="Strikes"
          value={`${transcriber.strikes}/3`}
          icon={ShieldAlert}
          valueColor={
            transcriber.strikes >= 3
              ? "text-red-400"
              : transcriber.strikes >= 2
              ? "text-yellow-400"
              : "text-emerald-400"
          }
        />
        <StatCard
          label="Last Active"
          value={new Date(transcriber.lastActiveAt).toLocaleDateString()}
          icon={Clock}
        />
      </div>

      {/* Quality Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Text Density Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-3xl font-bold ${getDensityColor(densityResult.level)}`}>
                  {transcriber.avgTextDensity.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">chars/sec average</p>
              </div>
              <Badge
                variant="outline"
                className={`capitalize ${
                  densityResult.level === "good"
                    ? "border-emerald-500/30 text-emerald-400"
                    : densityResult.level === "low"
                    ? "border-yellow-500/30 text-yellow-400"
                    : "border-red-500/30 text-red-400"
                }`}
              >
                {densityResult.level.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {densityResult.recommendation}
            </p>
            {chartData.length > 0 && (
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="densityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="task" />
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
                      dataKey="density"
                      stroke="#818cf8"
                      strokeWidth={2}
                      fill="url(#densityGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Edit Behavior Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className={`text-3xl font-bold ${
                    transcriber.noEditRate > 0.4
                      ? "text-red-400"
                      : transcriber.noEditRate > 0.25
                      ? "text-yellow-400"
                      : "text-emerald-400"
                  }`}
                >
                  {(transcriber.noEditRate * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">no-edit rate</p>
              </div>
              <Badge
                variant="outline"
                className={`capitalize ${
                  editResult.level === "good"
                    ? "border-emerald-500/30 text-emerald-400"
                    : editResult.level === "suspect"
                    ? "border-yellow-500/30 text-yellow-400"
                    : "border-red-500/30 text-red-400"
                }`}
              >
                {editResult.level}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {editResult.recommendation}
            </p>
            {/* Edit behavior breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tasks with edits</span>
                <span className="font-medium text-emerald-400">
                  {tasks.filter((t) => t.hasEdits).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tasks without edits</span>
                <span className="font-medium text-red-400">
                  {tasks.filter((t) => !t.hasEdits).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg time per task</span>
                <span className="font-medium">
                  {tasks.length > 0
                    ? `${Math.round(tasks.reduce((s, t) => s + t.timeSpentSec, 0) / tasks.length)}s`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg edit distance</span>
                <span className="font-medium">
                  {tasks.length > 0
                    ? Math.round(tasks.reduce((s, t) => s + t.editDistance, 0) / tasks.length)
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strike Timeline */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Strike History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {strikeHistory.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              No strikes recorded — clean record
            </div>
          ) : (
            <div className="space-y-4">
              {strikeHistory.map((strike) => (
                <div key={strike.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        strike.severity === "block"
                          ? "bg-red-400"
                          : strike.severity === "strike"
                          ? "bg-orange-400"
                          : "bg-yellow-400"
                      }`}
                    />
                    <div className="w-px flex-1 bg-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${
                          strike.severity === "block"
                            ? "border-red-500/30 text-red-400"
                            : strike.severity === "strike"
                            ? "border-orange-500/30 text-orange-400"
                            : "border-yellow-500/30 text-yellow-400"
                        }`}
                      >
                        {strike.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {strike.pattern.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(strike.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80">{strike.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task History */}
      {tasks.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Date</TableHead>
                  <TableHead>Audio (sec)</TableHead>
                  <TableHead>Text Length</TableHead>
                  <TableHead>Density</TableHead>
                  <TableHead>Edits</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const d = calculateTextDensity(task.textLength, task.audioDurationSec);
                  return (
                    <TableRow key={task.id} className="border-border">
                      <TableCell className="text-sm">
                        {new Date(task.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {task.audioDurationSec}s
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {task.textLength}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-mono font-medium ${getDensityColor(d.level)}`}>
                          {task.textDensity.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {task.hasEdits ? (
                          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                            Yes ({task.editDistance})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-400">
                            No edits
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {task.timeSpentSec}s
                      </TableCell>
                      <TableCell>
                        {task.flagged ? (
                          <Badge variant="destructive" className="text-[10px]">
                            Flagged
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                            OK
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Block Info */}
      {transcriber.blockedAt && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Ban className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-red-400">
                  Blocked on{" "}
                  {new Date(transcriber.blockedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transcriber.blockReason}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  valueColor,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  valueColor?: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
        </div>
        <p className={`text-xl font-bold ${valueColor || ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadgeLarge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warned: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    blocked: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={`capitalize text-sm px-3 py-1 ${styles[status]}`}>
      {status}
    </Badge>
  );
}
