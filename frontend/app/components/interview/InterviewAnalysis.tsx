"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle2, Shield, Sparkles, Terminal, ArrowRight } from "lucide-react";

interface InterviewAnalysisProps {
  setupData: any;
  onAnalysisComplete: () => void;
}

export const InterviewAnalysis: React.FC<InterviewAnalysisProps> = ({
  setupData,
  onAnalysisComplete,
}) => {
  const steps = [
    "Parsing Candidate Resume / CV",
    "Analyzing Job Description Requirements",
    "Detecting Technical Skills & Claimed Expertise",
    "Mapping Candidate Profile -> Role Domain Requirements",
    "Constructing Adaptive Technical Question Bank",
    "Initializing Vocalis AI Autonomous Interviewer",
    "Initializing Browser Integrity Monitor & Fullscreen Guard",
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedSteps((prev) => {
        if (!prev.includes(currentStepIndex)) {
          return [...prev, currentStepIndex];
        }
        return prev;
      });

      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsReady(true);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(timer);
  }, [currentStepIndex, steps.length]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="glass-panel-glow p-8 rounded-3xl w-full border border-cyan-500/40 flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Visualizer */}
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)]">
          <Cpu className={`w-8 h-8 text-cyan-400 ${isReady ? "" : "animate-spin"}`} />
        </div>

        <div className="text-center font-mono">
          <h2 className="text-lg font-black tracking-wider text-cyan-300">
            VOCALIS INTERVIEW ENGINE
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Synthesizing CV + Job Description into Personalized Interview Protocol
          </p>
        </div>

        {/* System Checklist */}
        <div className="w-full bg-slate-950/80 p-5 rounded-2xl border border-cyan-900/60 flex flex-col gap-3 font-mono text-xs">
          {steps.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            const isCurrent = currentStepIndex === idx && !isReady;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between py-1.5 px-3 rounded-lg border transition ${
                  isDone
                    ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-300"
                    : isCurrent
                    ? "bg-cyan-900/40 border-cyan-400/60 text-cyan-200 animate-pulse"
                    : "bg-slate-900/40 border-slate-800 text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
                <span className="text-[10px] font-bold">
                  {isDone ? "[✓] READY" : isCurrent ? "[...] PROCESSING" : "[ ] PENDING"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Ready Banner & Action Button */}
        {isReady ? (
          <div className="w-full flex flex-col items-center gap-4 mt-2">
            <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>INTERVIEW SYSTEM READY</span>
            </div>

            <button
              onClick={onAnalysisComplete}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-black text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.5)]"
            >
              <span>PROCEED TO INTEGRITY PROTOCOL</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-cyan-400/80 animate-pulse flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Configuring neural evaluation weights...</span>
          </div>
        )}
      </div>
    </div>
  );
};
