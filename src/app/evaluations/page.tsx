"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Play,
  Clock,
  Star,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { conversations, evaluations, evaluators } from "@/data/mock-data";
import { aggregateScores } from "@/lib/scoring-engine";
import { getScoreColor } from "@/lib/scoring-engine";

export default function EvaluationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tab, setTab] = useState("queue");

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.transcript.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pending = conversations.filter((c) => c.status === "pending").length;
  const inProgress = conversations.filter((c) => c.status === "in_progress").length;
  const completed = conversations.filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Evaluations</h1>
        <p className="text-muted-foreground mt-1">
          Evaluate AI conversations and track results
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="evaluators">Evaluators</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4 space-y-4">
          {/* Filters */}
          <Card className="bg-card border-border">
            <CardContent className="pt-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { if (v) setStatusFilter(v); }}>
                  <SelectTrigger className="w-[160px] bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Queue */}
          <div className="grid gap-3">
            {filtered.map((conv) => (
              <Card key={conv.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {conv.id.toUpperCase()}
                        </span>
                        <ConvStatusBadge status={conv.status} />
                        <PriorityBadge priority={conv.priority} />
                        {conv.isGoldStandard && (
                          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">
                            <Star className="h-2.5 w-2.5 mr-1" /> Gold Standard
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {conv.transcript}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {conv.durationSec}s
                        </span>
                        <span>{conv.model}</span>
                        <span>{conv.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(conv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/evaluations/${conv.id}`}>
                      <Button
                        size="sm"
                        variant={conv.status === "pending" ? "default" : "outline"}
                      >
                        {conv.status === "completed" ? "View" : "Evaluate"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Evaluations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Conversation</TableHead>
                    <TableHead>Evaluator</TableHead>
                    <TableHead>Speech</TableHead>
                    <TableHead>Understanding</TableHead>
                    <TableHead>Management</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((ev) => {
                    const evaluator = evaluators.find((e) => e.id === ev.evaluatorId);
                    return (
                      <TableRow key={ev.id} className="border-border">
                        <TableCell className="font-mono text-xs">
                          {ev.conversationId.toUpperCase()}
                          {ev.isGoldStandard && (
                            <Star className="inline h-3 w-3 ml-1 text-amber-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {evaluator?.name || ev.evaluatorId}
                        </TableCell>
                        <TableCell>
                          <ScoreCell score={ev.scores.speechNaturalness} />
                        </TableCell>
                        <TableCell>
                          <ScoreCell score={ev.scores.understandingAccuracy} />
                        </TableCell>
                        <TableCell>
                          <ScoreCell score={ev.scores.conversationManagement} />
                        </TableCell>
                        <TableCell>
                          <ScoreCell score={ev.scores.taskCompletion} />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {Math.round(ev.timeSpentSec / 60)}m
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(ev.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluators" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {evaluators.map((ev) => (
              <Card key={ev.id} className="bg-card border-border">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {ev.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{ev.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ev.totalEvaluations} evaluations
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`ml-auto text-[10px] ${
                        ev.isActive
                          ? "border-emerald-500/30 text-emerald-400"
                          : "border-muted text-muted-foreground"
                      }`}
                    >
                      {ev.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Gold Accuracy</p>
                      <p className={`font-bold ${ev.goldStandardAccuracy >= 0.9 ? "text-emerald-400" : ev.goldStandardAccuracy >= 0.8 ? "text-yellow-400" : "text-red-400"}`}>
                        {(ev.goldStandardAccuracy * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Agreement</p>
                      <p className={`font-bold ${ev.interAgreement >= 0.85 ? "text-emerald-400" : ev.interAgreement >= 0.75 ? "text-yellow-400" : "text-red-400"}`}>
                        {(ev.interAgreement * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Time</p>
                      <p className="font-bold">
                        {Math.round(ev.avgTimePerEvalSec / 60)}m {ev.avgTimePerEvalSec % 60}s
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                      <p className="font-bold">
                        {(
                          (ev.avgScores.speechNaturalness +
                            ev.avgScores.understandingAccuracy +
                            ev.avgScores.conversationManagement +
                            ev.avgScores.taskCompletion) /
                          4
                        ).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConvStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${styles[status]}`}>
      {labels[status]}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    medium: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    critical: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={`text-[10px] capitalize ${styles[priority]}`}>
      {priority}
    </Badge>
  );
}

function ScoreCell({ score }: { score: number }) {
  return (
    <span className={`text-sm font-bold ${getScoreColor(score)}`}>
      {score}
    </span>
  );
}
