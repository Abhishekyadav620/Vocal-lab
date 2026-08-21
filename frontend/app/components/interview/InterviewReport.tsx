"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import React from "react";
import { Award, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Calendar, ChevronRight, MessageSquare, Code, Cpu } from "lucide-react";

interface QuestionAudit {
  question_num: number;
  category: string;
  question: string;
  answer: string;
  score: number;
  strength: string;
  weakness: string;
  ai_feedback: string;
}

interface InterviewReportProps {
  reportData: any;
  onRestart: () => void;
}

export const InterviewReport: React.FC<InterviewReportProps> = ({ reportData, onRestart }) => {
  const report = reportData || {
    candidate_name: "Candidate",
    domain: "Full Stack Development",
    overall_score: 78,
    readiness_label: "GOOD READINESS",
    disclaimer:
      "This score represents interview readiness based on your CV, job description and interview performance. It is not a guarantee of selection.",
    scores_breakdown: {
      technical: 82,
      coding: 74,
      communication: 79,
      fluency: 81,
      problem_solving: 76,
      jd_match: 84,
      system_design: 75,
      behavioral: 80,
    },
    communication_analysis: {
      fluency: 81,
      clarity: 78,
      confidence: 74,
      conciseness: 69,
      filler_words: ["umm", "actually", "basically", "like"],
    },
    strong_areas: ["React", "Node.js", "MongoDB", "REST APIs"],
    needs_improvement: ["System Design", "Advanced JavaScript", "Database Indexing"],
    cv_depth_analysis: {
      cv_claim: "Implemented scalable WebSocket architecture and microservices.",
      interview_performance:
        "Candidate demonstrated basic understanding but struggled with connection lifecycle, rooms, and reconnection strategies under high load.",
      recommendation: "Review WebSocket architecture, connection polling vs sockets, and real-time state synchronization.",
    },
    jd_match_breakdown: [
      { skill: "React", match: 92 },
      { skill: "Node.js", match: 84 },
      { skill: "MongoDB", match: 78 },
      { skill: "AWS", match: 48 },
      { skill: "Docker", match: 61 },
    ],
    improvement_plan: [
      { priority: 1, topic: "Advanced JavaScript & Async Patterns", progress: 85 },
      { priority: 2, topic: "System Design & Distributed Caching", progress: 70 },
      { priority: 3, topic: "Data Structures & Algorithms", progress: 65 },
      { priority: 4, topic: "Communication & Conciseness", progress: 55 },
    ],
    seven_day_roadmap: [
      { day: 1, task: "JavaScript Fundamentals & Event Loop" },
      { day: 2, task: "React Hooks & State Management Patterns" },
      { day: 3, task: "Node.js REST APIs & Middleware Architecture" },
      { day: 4, task: "Database Indexing & Query Optimization" },
      { day: 5, task: "Data Structures (Trees, Graphs, Dynamic Programming)" },
      { day: 6, task: "System Design & Load Balancing" },
      { day: 7, task: "Full Mock Interview Practice" },
    ],
    question_audit: [
      {
        question_num: 1,
        category: "CV / Technical",
        question: "Explain how you implemented real-time communication using WebSockets in your Streamify project.",
        answer: "I used Socket.io to send instant message payloads to rooms.",
        score: 8.2,
        strength: "Good basic understanding of WebSockets.",
        weakness: "Could not clearly explain token expiration and reconnection strategies.",
        ai_feedback: "Review access tokens, refresh tokens, expiration and secure socket storage.",
      },
    ],
  };

  const overallScore = report.overall_score || 78;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-2 sm:p-4 font-mono">
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Award className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-cyan-300">
              VOCALIS AI — INTERVIEW DIAGNOSTIC REPORT
            </h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Candidate: <strong className="text-cyan-300">{report.candidate_name}</strong> | Domain: <strong className="text-cyan-300">{report.domain}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-5 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition text-xs font-bold"
        >
          START NEW INTERVIEW
        </button>
      </div>

      {/* Hero Score Gauge Section */}
      <div className="glass-panel-glow p-8 rounded-3xl border border-cyan-500/40 flex flex-col md:flex-row items-center justify-around gap-8 text-center md:text-left relative overflow-hidden">
        <div className="flex flex-col items-center justify-center relative">
          {/* Circular Score Visual */}
          <div className="w-36 h-36 rounded-full border-4 border-cyan-500/30 flex items-center justify-center relative bg-slate-950/80 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-cyan-300">{overallScore}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">OUT OF 100</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-lg">
          <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
            AI ESTIMATED JOB READINESS
          </span>
          <h2 className="text-2xl font-black text-cyan-200">{report.readiness_label}</h2>
          <p className="text-xs text-gray-400 leading-relaxed">{report.disclaimer}</p>
        </div>
      </div>

      {/* Grid: Score Breakdown (4 Cols) + Communication Analysis (8 Cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric Scores Breakdown */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-cyan-500/30">
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              PERFORMANCE METRICS BREAKDOWN
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {Object.entries(report.scores_breakdown || {}).map(([key, val]: [string, any], i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-gray-400 uppercase text-[10px] font-bold">{key.replace("_", " ")}</span>
                <span className="text-cyan-300 font-black text-sm">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Analysis */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-cyan-500/30">
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              COMMUNICATION &amp; FLUENCY ANALYSIS
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-gray-400 text-[10px]">FLUENCY</span>
              <span className="text-emerald-400 font-bold">{report.communication_analysis?.fluency || 81}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-gray-400 text-[10px]">CLARITY</span>
              <span className="text-emerald-400 font-bold">{report.communication_analysis?.clarity || 78}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-gray-400 text-[10px]">CONFIDENCE</span>
              <span className="text-cyan-400 font-bold">{report.communication_analysis?.confidence || 74}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-gray-400 text-[10px]">CONCISENESS</span>
              <span className="text-cyan-400 font-bold">{report.communication_analysis?.conciseness || 69}%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-950 flex flex-col gap-1.5 text-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase">COMMON FILLER WORDS DETECTED:</span>
            <div className="flex flex-wrap gap-1.5">
              {(report.communication_analysis?.filler_words || ["umm", "basically"]).map((w: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px]">
                  "{w}"
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Strengths & Weaknesses (6 Cols) + CV Depth Confidence (6 Cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Strengths & Weaknesses */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-cyan-500/30">
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">TECHNICAL KNOWLEDGE AUDIT</h3>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">STRONG AREAS</span>
            <div className="flex flex-wrap gap-2">
              {(report.strong_areas || []).map((area: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  ✓ {area}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase">NEEDS IMPROVEMENT</span>
            <div className="flex flex-wrap gap-2">
              {(report.needs_improvement || []).map((area: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  ! {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CV Depth & Project Knowledge Confidence */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3 border border-cyan-500/30">
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
            <Award className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              PROJECT KNOWLEDGE CONFIDENCE (CV DEPTH)
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1 text-xs">
            <span className="text-[10px] text-gray-400 font-bold">CV CLAIM:</span>
            <p className="text-cyan-300">"{report.cv_depth_analysis?.cv_claim}"</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1 text-xs">
            <span className="text-[10px] text-gray-400 font-bold">INTERVIEW PERFORMANCE:</span>
            <p className="text-gray-300">{report.cv_depth_analysis?.interview_performance}</p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex flex-col gap-1 text-xs">
            <span className="text-[10px] text-cyan-400 font-bold">RECOMMENDATION:</span>
            <p className="text-cyan-200">{report.cv_depth_analysis?.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Job Description Match Analysis */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-cyan-500/30">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">JOB MATCH SKILL COVERAGE</h3>
          <span className="text-[10px] text-gray-400">Target Skill Alignment</span>
        </div>

        <div className="flex flex-col gap-3">
          {(report.jd_match_breakdown || []).map((item: any, i: number) => (
            <div key={i} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-gray-300">{item.skill}</span>
                <span className="text-cyan-300">{item.match}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${item.match}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized 7-Day Preparation Plan */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 border border-cyan-500/30">
        <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            PERSONALIZED 7-DAY INTERVIEW PREPARATION PLAN
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 text-xs">
          {(report.seven_day_roadmap || []).map((dayItem: any, i: number) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <span className="text-[10px] font-black text-cyan-400 uppercase">DAY {dayItem.day}</span>
              <p className="text-gray-300 text-[11px] leading-snug">{dayItem.task}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Question-by-Question Detailed Review */}
      {report.question_audit && report.question_audit.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-cyan-500/30">
          <div className="border-b border-cyan-500/20 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              QUESTION-BY-QUESTION AUDIT BREAKDOWN
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {report.question_audit.map((qItem: QuestionAudit, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="font-bold text-cyan-400 uppercase">
                    QUESTION {qItem.question_num} • {qItem.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                    SCORE: {qItem.score} / 10
                  </span>
                </div>

                <p className="text-gray-200 font-bold mt-1">"{qItem.question}"</p>

                {qItem.answer && (
                  <div className="text-gray-400 italic text-[11px]">
                    Candidate Response: "{qItem.answer}"
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                    <strong>Strength:</strong> {qItem.strength}
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px]">
                    <strong>Weakness:</strong> {qItem.weakness}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[11px] mt-1">
                  <strong>AI Feedback:</strong> {qItem.ai_feedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
