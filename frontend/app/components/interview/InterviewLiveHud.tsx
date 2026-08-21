"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Volume2, ShieldAlert, Clock, Cpu, Activity, AlertTriangle, Sparkles, Code2, ArrowRight } from "lucide-react";

interface QuestionItem {
  question: string;
  category: string;
  difficulty?: string;
  expected_key_points?: string[];
}

interface InterviewLiveHudProps {
  interviewId: string;
  domain: string;
  experienceLevel: string;
  language: string;
  initialQuestion: QuestionItem;
  violationCount: number;
  onViolationOccurred: () => void;
  onAnswerSubmit: (answerText: string) => Promise<any>;
  onStartCodingRound: () => void;
  onFinishInterview: () => void;
}

export const InterviewLiveHud: React.FC<InterviewLiveHudProps> = ({
  interviewId,
  domain,
  experienceLevel,
  language,
  initialQuestion,
  violationCount,
  onViolationOccurred,
  onAnswerSubmit,
  onStartCodingRound,
  onFinishInterview,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem>(initialQuestion);
  const [answerText, setAnswerText] = useState<string>("");
  const [interviewerState, setInterviewerState] = useState<"idle" | "listening" | "thinking" | "speaking">("speaking");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activityLogs, setActivityLogs] = useState<string[]>([
    "CV & Job Description analyzed",
    "Candidate profile mapped",
    "Initial CV technical question generated",
    "AI Interviewer active"
  ]);

  // 60-Minute Persistent Timer (3600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
  const recognitionRef = useRef<any>(null);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onFinishInterview]);

  // Tab switch & Fullscreen monitoring effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolationOccurred();
        setActivityLogs((prev) => [`Integrity Warning: Browser focus lost (${new Date().toLocaleTimeString()})`, ...prev]);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onViolationOccurred();
        setActivityLogs((prev) => [`Integrity Warning: Fullscreen exit detected (${new Date().toLocaleTimeString()})`, ...prev]);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onViolationOccurred]);

  // Voice speech synthesis playback for question
  const speakQuestion = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setInterviewerState("speaking");
      utterance.onend = () => setInterviewerState("idle");
      utterance.onerror = () => setInterviewerState("idle");
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak initial question on mount
  useEffect(() => {
    if (initialQuestion?.question) {
      speakQuestion(initialQuestion.question);
    }
  }, [initialQuestion]);

  // Speech Recognition (Mic toggle)
  const toggleListening = () => {
    if (interviewerState === "listening") {
      if (recognitionRef.current) recognitionRef.current.stop();
      setInterviewerState("idle");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your response.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setInterviewerState("listening");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setInterviewerState("idle");
    };

    recognition.onerror = () => {
      setInterviewerState("idle");
    };

    recognition.onend = () => {
      setInterviewerState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = async () => {
    if (!answerText.trim() || isSubmitting) return;
    const textToSubmit = answerText.trim();
    setAnswerText("");
    setIsSubmitting(true);
    setInterviewerState("thinking");

    setActivityLogs((prev) => [`Answer submitted for evaluation (${new Date().toLocaleTimeString()})`, ...prev]);

    try {
      const res = await onAnswerSubmit(textToSubmit);
      if (res) {
        if (res.next_question) {
          setCurrentQuestion(res.next_question);
          speakQuestion(res.next_question.question);
        }
        if (res.activity_logs) {
          setActivityLogs((prev) => [...res.activity_logs, ...prev]);
        }
        if (res.next_action === "START_CODING") {
          onStartCodingRound();
        } else if (res.next_action === "END_INTERVIEW") {
          onFinishInterview();
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 p-2 sm:p-4 font-mono">
      {/* Top Header Bar */}
      <div className="glass-panel px-6 py-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-cyan-300 tracking-wider">
            VOCALIS AI INTERVIEW PROTOCOL
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-semibold uppercase">
            {domain}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* AI Status */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">
              ● AI {interviewerState.toUpperCase()}
            </span>
          </div>

          {/* Persistent Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>⏱ {formatTimer(secondsRemaining)}</span>
          </div>

          {/* Integrity Counter Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-bold ${
              violationCount > 0
                ? "bg-red-950/80 border-red-500/60 text-red-300"
                : "bg-slate-900 border-slate-800 text-emerald-400"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>INTEGRITY: {violationCount} / 2</span>
          </div>
        </div>
      </div>

      {/* Warning Overlay Banner if violations exist */}
      {violationCount > 0 && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>
              {violationCount === 1
                ? "⚠ WARNING: Browser focus lost / tab switched. Violation 1 / 2 recorded."
                : "⚠ FINAL WARNING: Violation 2 / 2 recorded. One more violation will terminate the interview."}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-red-300 bg-red-900/40 px-2 py-0.5 rounded">
            MONITORING ACTIVE
          </span>
        </div>
      )}

      {/* Main Grid: AI Avatar (Left 5 Cols) + Q&A Response (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: AI Interviewer Avatar Card & Activity Feed (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* AI Avatar Box */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px] border border-cyan-500/30">
            {/* Background glowing rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div
                className={`w-64 h-64 rounded-full border border-cyan-400/40 ${
                  interviewerState === "speaking" ? "animate-ping" : "animate-spin-slow"
                }`}
              />
              <div className="w-48 h-48 rounded-full border border-cyan-300/30 animate-spin-reverse absolute" />
            </div>

            {/* Central glowing core avatar */}
            <div
              className={`w-28 h-28 rounded-full border-2 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-500 relative z-10 ${
                interviewerState === "speaking"
                  ? "border-cyan-400 bg-cyan-950/80 scale-105 shadow-[0_0_40px_rgba(0,240,255,0.8)]"
                  : interviewerState === "thinking"
                  ? "border-amber-400 bg-amber-950/80 animate-pulse"
                  : interviewerState === "listening"
                  ? "border-emerald-400 bg-emerald-950/80 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                  : "border-cyan-500/40 bg-slate-950/80"
              }`}
            >
              <Cpu
                className={`w-14 h-14 ${
                  interviewerState === "speaking"
                    ? "text-cyan-300 animate-pulse"
                    : interviewerState === "thinking"
                    ? "text-amber-300 animate-spin"
                    : interviewerState === "listening"
                    ? "text-emerald-300"
                    : "text-cyan-400"
                }`}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-300 z-10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>AI INTERVIEWER</span>
            </div>

            <span className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider z-10">
              ● CURRENTLY {interviewerState.toUpperCase()}
            </span>

            <button
              onClick={() => speakQuestion(currentQuestion.question)}
              className="mt-3 px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 transition text-[11px] flex items-center gap-1.5 z-10"
            >
              <Volume2 className="w-3.5 h-3.5" /> Re-play Audio
            </button>
          </div>

          {/* Real-time Agentic Activity Stream */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col max-h-[240px]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2 font-bold">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Agentic Activity Stream
              </span>
              <span className="text-[10px] text-gray-500">Live Audit</span>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 text-[11px] text-gray-300">
              {activityLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5 border-b border-slate-900">
                  <span className="text-cyan-500 font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Question & Candidate Answer Section (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Question Card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold uppercase">
                  {currentQuestion.category || "CV / TECHNICAL"}
                </span>
                {currentQuestion.difficulty && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-gray-300 text-[10px] font-bold">
                    DIFFICULTY: {currentQuestion.difficulty.toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400">Vocalis Adaptive Engine</span>
            </div>

            <p className="text-sm sm:text-base text-cyan-100 leading-relaxed font-sans font-medium">
              "{currentQuestion.question}"
            </p>
          </div>

          {/* Candidate Response Input Area */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold text-gray-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> YOUR RESPONSE
              </label>
              <span className="text-[10px] text-gray-400">Speak or type your answer</span>
            </div>

            <textarea
              rows={5}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your technical response here, or click the mic button to speak..."
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-4 text-xs font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-400 leading-relaxed"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={toggleListening}
                className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                  interviewerState === "listening"
                    ? "bg-red-950 border-red-500/80 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    : "bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/60"
                }`}
              >
                {interviewerState === "listening" ? (
                  <>
                    <MicOff className="w-4 h-4 text-red-400" />
                    <span>STOP LISTENING</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span>VOICE MIC RESPONSE</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onStartCodingRound}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>LIVE CODING PROTOCOL</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!answerText.trim() || isSubmitting}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 transition ${
                    answerText.trim() && !isSubmitting
                      ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
                      : "bg-slate-900 text-gray-600 border border-slate-800 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                      <span>EVALUATING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SUBMIT ANSWER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
