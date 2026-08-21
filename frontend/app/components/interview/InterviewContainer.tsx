"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import React, { useState } from "react";
import { InterviewSetup } from "./InterviewSetup";
import { InterviewAnalysis } from "./InterviewAnalysis";
import { IntegrityRulesModal } from "./IntegrityRulesModal";
import { InterviewLiveHud } from "./InterviewLiveHud";
import { InterviewCodingRound } from "./InterviewCodingRound";
import { InterviewReport } from "./InterviewReport";

type InterviewStage = "setup" | "analyzing" | "integrity_rules" | "live_interview" | "live_coding" | "report";

export const InterviewContainer: React.FC = () => {
  const [stage, setStage] = useState<InterviewStage>("setup");
  const [setupData, setSetupData] = useState<any>(null);
  const [interviewId, setInterviewId] = useState<string>("");
  const [initialQuestion, setInitialQuestion] = useState<any>({
    question: "Welcome to Vocalis AI Interview Protocol. Please explain your core architectural experience.",
    category: "CV",
    difficulty: "Medium",
  });
  const [violationCount, setViolationCount] = useState<number>(0);
  const [codingProblem, setCodingProblem] = useState<any>(null);
  const [finalReportData, setFinalReportData] = useState<any>(null);

  const getBackendHost = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_HOST) return process.env.NEXT_PUBLIC_BACKEND_HOST;
    if (typeof window !== "undefined") return `${window.location.hostname}:8005`;
    return "127.0.0.1:8005";
  };

  const getBackendUrl = (path: string) => {
    const host = getBackendHost();
    const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "https" : "http";
    return `${protocol}://${host}${path}`;
  };

  // Step 1: Start pre-interview analysis
  const handleStartAnalysis = async (data: any) => {
    setSetupData(data);
    setStage("analyzing");

    try {
      const res = await fetch(getBackendUrl("/api/interview/initialize"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: data.domain,
          experience_level: data.experienceLevel,
          language: data.language,
          cv_text: data.cvText,
          jd_text: data.jdText,
          cv_profile: data.cvProfile,
          jd_data: data.jdData,
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        setInterviewId(resData.interview_id);
        if (resData.first_question) {
          setInitialQuestion(resData.first_question);
        }
      }
    } catch {
      setInterviewId(`voc-int-${Date.now().toString().slice(-6)}`);
    }
  };

  // Step 2: Analysis complete -> Show Integrity Rules Modal
  const handleAnalysisComplete = () => {
    setStage("integrity_rules");
  };

  // Step 3: Accept rules -> Start Live Interview
  const handleAcceptRulesAndStart = async () => {
    setStage("live_interview");

    try {
      await fetch(getBackendUrl("/api/interview/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview_id: interviewId }),
      });
    } catch {
      // Fallback
    }
  };

  // Answer submit API call
  const handleAnswerSubmit = async (candidateAnswer: string) => {
    try {
      const res = await fetch(getBackendUrl("/api/interview/answer"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interview_id: interviewId,
          candidate_answer: candidateAnswer,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coding_problem) setCodingProblem(data.coding_problem);
        return data;
      }
    } catch {
      return null;
    }
  };

  // Violation logging API call
  const handleViolationOccurred = async () => {
    setViolationCount((prev) => {
      const newCount = prev + 1;
      if (newCount > 2) {
        setStage("report"); // Terminate
      }
      return newCount;
    });

    try {
      await fetch(getBackendUrl("/api/interview/violation"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interview_id: interviewId,
          violation_type: "tab_switch_or_fullscreen_exit",
        }),
      });
    } catch {
      // Fallback
    }
  };

  // Live coding submission handler
  const handleSubmitCodingSolution = async (code: string, language: string) => {
    try {
      const res = await fetch(getBackendUrl("/api/interview/coding/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interview_id: interviewId,
          code,
          language,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      return null;
    }
  };

  // Finish interview -> Fetch final report
  const handleFinishInterview = async () => {
    try {
      const res = await fetch(getBackendUrl("/api/interview/end"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview_id: interviewId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFinalReportData(data.report);
      }
    } catch {
      // Fallback
    } finally {
      setStage("report");
    }
  };

  const handleRestart = () => {
    setStage("setup");
    setSetupData(null);
    setInterviewId("");
    setViolationCount(0);
    setCodingProblem(null);
    setFinalReportData(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      {stage === "setup" && <InterviewSetup onStartAnalysis={handleStartAnalysis} />}

      {stage === "analyzing" && (
        <InterviewAnalysis setupData={setupData} onAnalysisComplete={handleAnalysisComplete} />
      )}

      {stage === "integrity_rules" && (
        <IntegrityRulesModal onAcceptAndStart={handleAcceptRulesAndStart} />
      )}

      {stage === "live_interview" && (
        <InterviewLiveHud
          interviewId={interviewId}
          domain={setupData?.domain || "Full Stack Development"}
          experienceLevel={setupData?.experienceLevel || "1–3 Years"}
          language={setupData?.language || "Python"}
          initialQuestion={initialQuestion}
          violationCount={violationCount}
          onViolationOccurred={handleViolationOccurred}
          onAnswerSubmit={handleAnswerSubmit}
          onStartCodingRound={() => setStage("live_coding")}
          onFinishInterview={handleFinishInterview}
        />
      )}

      {stage === "live_coding" && (
        <InterviewCodingRound
          interviewId={interviewId}
          domain={setupData?.domain || "Full Stack Development"}
          language={setupData?.language || "Python"}
          problem={codingProblem}
          onSubmitSolution={handleSubmitCodingSolution}
          onReturnToInterview={() => setStage("live_interview")}
        />
      )}

      {stage === "report" && (
        <InterviewReport reportData={finalReportData} onRestart={handleRestart} />
      )}
    </div>
  );
};
