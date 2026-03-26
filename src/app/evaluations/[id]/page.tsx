"use client";

import { use, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Star,
  Send,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import {
  getConversationById,
  getEvaluationsForConversation,
  evaluators,
} from "@/data/mock-data";
import {
  criterionDescriptions,
  criterionLabels,
  getScoreColor,
  getScoreBg,
  aggregateScores,
  calculateAgreement,
  getCriterionColor,
  getCriterionBg,
  getPoolLabel,
  interpretKappa,
} from "@/lib/scoring-engine";
import { EvaluationScores } from "@/types";

const criteria: (keyof EvaluationScores)[] = [
  "speechNaturalness",
  "understandingAccuracy",
  "conversationManagement",
  "taskCompletion",
];

export default function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const conversation = getConversationById(id);
  const existingEvals = getEvaluationsForConversation(id);

  // For demonstration, we'll "log in" as Dr. Sarah Chen (e1)
  const currentEvaluator = evaluators[0]; // e1
  const specializedCriteria = currentEvaluator.specializations;

  const [scores, setScores] = useState<EvaluationScores>({});
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  const handleScore = (criterion: keyof EvaluationScores, score: number) => {
    setScores((prev) => ({ ...prev, [criterion]: score }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const togglePlay = () => {
    setPlaying(!playing);
    if (!playing) {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setPlaying(false);
            return 100;
          }
          return p + 2;
        });
      }, (conversation.durationSec * 1000) / 50);
    }
  };

  const allScored = specializedCriteria.every((c) => (scores[c] ?? 0) > 0);
  const aggScores = existingEvals.length > 0 ? aggregateScores(existingEvals) : null;
  const agreement =
    existingEvals.length > 1 ? calculateAgreement(existingEvals) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/evaluations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              Evaluate Conversation {id.toUpperCase()}
            </h1>
            {conversation.isGoldStandard && (
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[11px]">
                <Star className="h-3 w-3 mr-1" /> Gold Standard
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>{conversation.model}</span>
            <span>•</span>
            <span>{conversation.category}</span>
            <span>•</span>
            <span>{conversation.durationSec}s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Audio + Transcript */}
        <div className="lg:col-span-1 space-y-4">
          {/* Audio Player */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Audio Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={togglePlay}
                  >
                    {playing ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                      <span>
                        {Math.round((progress / 100) * conversation.durationSec)}s
                      </span>
                      <span>{conversation.durationSec}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                {conversation.transcript}
              </p>
            </CardContent>
          </Card>

          {/* Existing Evaluations */}
          {existingEvals.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Previous Evaluations ({existingEvals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aggScores && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {criteria.map((c) => (
                      <div key={c} className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-[10px] text-muted-foreground">
                          {criterionLabels[c]}
                        </p>
                        <p className={`text-lg font-bold ${aggScores ? getScoreColor(aggScores[c] ?? 0) : ""}`}>
                          {aggScores ? (aggScores[c] ?? 0).toFixed(1) : "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {agreement !== null && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">
                      Reliability (Kappa)
                    </span>
                    {(() => {
                      const k = interpretKappa(agreement);
                      return (
                        <div className="text-right">
                          <span className={`font-bold ${k.color}`}>
                            {agreement.toFixed(2)}
                          </span>
                          <p className={`text-[10px] font-medium ${k.color}`}>
                            {k.label}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Scoring Panel */}
        <div className="lg:col-span-2 space-y-4">
          {submitted ? (
            <Card className="bg-card border-border">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Evaluation Submitted</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your scores have been recorded successfully.
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                    {criteria.map((c) => (
                      <div key={c} className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-[10px] text-muted-foreground mb-1">
                          {criterionLabels[c]}
                        </p>
                        <p className={`text-2xl font-bold ${getScoreColor(scores[c] ?? 0)}`}>
                          {scores[c] ?? "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link href="/evaluations">
                    <Button className="mt-4">Back to Queue</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Evaluator Context */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {currentEvaluator.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{currentEvaluator.name}</p>
                      <p className="text-xs text-primary font-medium">
                        {getPoolLabel(specializedCriteria)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Expertise Coverage</p>
                    <div className="flex gap-1 justify-end">
                      {specializedCriteria.map(c => (
                        <Badge key={c} variant="outline" className={`text-[9px] px-1.5 py-0 ${getCriterionBg(c)}`}>
                          {criterionLabels[c]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scoring Rubrics */}
              {specializedCriteria.map((criterion) => (
                <Card key={criterion} className={`bg-card border-l-4 ${getCriterionColor(criterion).replace("text-", "border-")}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-base font-semibold flex items-center gap-2 ${getCriterionColor(criterion)}`}>
                      <div className={`h-2 w-2 rounded-full ${getCriterionColor(criterion).replace("text-", "bg-")}`} />
                      {criterionLabels[criterion]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleScore(criterion, score)}
                          className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                            scores[criterion] === score
                              ? `${getScoreBg(score)} border-primary/50 ring-1 ring-primary/30`
                              : "border-border hover:border-primary/30 hover:bg-accent/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-lg font-bold ${
                                scores[criterion] === score
                                  ? getScoreColor(score)
                                  : "text-muted-foreground"
                              }`}
                            >
                              {score}
                            </span>
                            {scores[criterion] === score && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            {criterionDescriptions[criterion][score]}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Notes */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Notes & Observations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add any observations, flags, or notes about this evaluation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] bg-background resize-none"
                  />
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex items-center justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm py-4 border-t border-border -mx-6 px-6 lg:-mx-8 lg:px-8">
                <div className="text-sm text-muted-foreground">
                  {allScored
                    ? "All assigned criteria scored — ready to submit"
                    : `${specializedCriteria.filter((c) => (scores[c] ?? 0) > 0).length} of ${specializedCriteria.length} assigned criteria scored`}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!allScored}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Evaluation
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
