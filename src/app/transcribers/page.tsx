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
import { Search, ArrowUpDown, Users, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { transcribers } from "@/data/mock-data";
import { calculateTextDensity, getDensityColor } from "@/lib/quality-engine";
import { TranscriberStatus } from "@/types";
import { RouteGuard } from "@/components/route-guard";

type SortField = "name" | "totalTasks" | "avgTextDensity" | "noEditRate" | "strikes";

export default function TranscribersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = transcribers
    .filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return a.name.localeCompare(b.name) * mul;
      return ((a[sortField] as number) - (b[sortField] as number)) * mul;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const active = transcribers.filter((t) => t.status === "active").length;
  const warned = transcribers.filter((t) => t.status === "warned").length;
  const blocked = transcribers.filter((t) => t.status === "blocked").length;

  return (
    <RouteGuard requiredRole="admin">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transcribers</h1>
        <p className="text-muted-foreground mt-1">
          Monitor transcriber quality and manage strikes
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/15 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{warned}</p>
              <p className="text-xs text-muted-foreground">Warned</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/15 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{blocked}</p>
              <p className="text-xs text-muted-foreground">Blocked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transcribers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="warned">Warned</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                  <div className="flex items-center gap-1">
                    Name <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("totalTasks")}>
                  <div className="flex items-center gap-1">
                    Tasks <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("avgTextDensity")}>
                  <div className="flex items-center gap-1">
                    Avg Density <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("noEditRate")}>
                  <div className="flex items-center gap-1">
                    No-Edit Rate <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("strikes")}>
                  <div className="flex items-center gap-1">
                    Strikes <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const density = calculateTextDensity(t.avgTextDensity * 100, 100);
                return (
                  <TableRow key={t.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {t.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-sm">{t.totalTasks}</TableCell>
                    <TableCell>
                      <span className={`text-sm font-mono font-medium ${getDensityColor(density.level)}`}>
                        {t.avgTextDensity.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-mono font-medium ${
                          t.noEditRate > 0.4
                            ? "text-red-400"
                            : t.noEditRate > 0.25
                            ? "text-yellow-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {(t.noEditRate * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i < t.strikes ? "bg-red-400" : "bg-muted"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {t.strikes}/3
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/transcribers/${t.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </RouteGuard>
  );
}

function StatusBadge({ status }: { status: TranscriberStatus }) {
  const styles = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warned: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    blocked: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={`capitalize text-[11px] ${styles[status]}`}>
      {status}
    </Badge>
  );
}
