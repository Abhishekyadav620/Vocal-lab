"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Cpu, Sparkles, Layers, ShieldCheck, Code, Briefcase, Zap } from "lucide-react";

interface InterviewSetupProps {
  onStartAnalysis: (setupData: {
    cvText: string;
    cvFileName: string;
    cvProfile: any;
    jdText: string;
    jdFileName: string;
    jdData: any;
    domain: string;
    experienceLevel: string;
    language: string;
  }) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartAnalysis }) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [cvText, setCvText] = useState<string>("");
  const [cvProfile, setCvProfile] = useState<any>(null);
  const [isCvLoading, setIsCvLoading] = useState<boolean>(false);

  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdFileName, setJdFileName] = useState<string>("");
  const [jdText, setJdText] = useState<string>("");
  const [jdData, setJdData] = useState<any>(null);
  const [isJdLoading, setIsJdLoading] = useState<boolean>(false);

  const [domain, setDomain] = useState<string>("AUTO DETECT FROM JOB DESCRIPTION");
  const [experienceLevel, setExperienceLevel] = useState<string>("1–3 Years");
  const [language, setLanguage] = useState<string>("Python");

  const cvInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  const getBackendHost = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_HOST) return process.env.NEXT_PUBLIC_BACKEND_HOST;
    if (typeof window !== "undefined") return `${window.location.hostname}:8005`;
    return "127.0.0.1:8005";
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    setCvFileName(file.name);
    setIsCvLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const host = getBackendHost();
      const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "https" : "http";
      const res = await fetch(`${protocol}://${host}/api/interview/parse-cv`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCvProfile(data.profile);
        setCvText(data.profile.raw_text || "");
      } else {
        // Fallback text reader
        const text = await file.text();
        setCvText(text);
      }
    } catch {
      const text = await file.text();
      setCvText(text);
    } finally {
      setIsCvLoading(false);
    }
  };

  const handleJdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJdFile(file);
    setJdFileName(file.name);
    setIsJdLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const host = getBackendHost();
      const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "https" : "http";
      const res = await fetch(`${protocol}://${host}/api/interview/parse-jd`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setJdData(data.jd_data);
        setJdText(data.jd_data.raw_text || "");
        if (domain === "AUTO DETECT FROM JOB DESCRIPTION" && data.jd_data.detected_domain) {
          setDomain(data.jd_data.detected_domain);
        }
      } else {
        const text = await file.text();
        setJdText(text);
      }
    } catch {
      const text = await file.text();
      setJdText(text);
    } finally {
      setIsJdLoading(false);
    }
  };

  const handleProceed = () => {
    onStartAnalysis({
      cvText: cvText || "Candidate CV Text",
      cvFileName: cvFileName || "Candidate_CV.pdf",
      cvProfile: cvProfile || { skills: ["Software Engineering"], name: "Candidate" },
      jdText: jdText || "Job Description Text",
      jdFileName: jdFileName || "Job_Description.pdf",
      jdData: jdData || { required_skills: ["Python", "React"] },
      domain,
      experienceLevel,
      language,
    });
  };

  const domainsList = [
    "AUTO DETECT FROM JOB DESCRIPTION",
    "Full Stack Development",
    "Frontend Development",
    "Backend Development",
    "Software Engineering",
    "Data Science",
    "Machine Learning / AI",
    "DevOps & Cloud Engineering",
    "Cybersecurity",
    "Mobile Development",
    "Java Development",
    "Python Development",
    "C++ Development",
    "JavaScript Development",
    "Database / SQL",
    "System Design",
  ];

  const experienceList = ["Fresher", "0–1 Years", "1–3 Years", "3–5 Years", "5+ Years"];
  const languagesList = ["Python", "JavaScript", "TypeScript", "C++", "Java", "Go", "Rust", "C#"];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-2 sm:p-4">
      {/* Title Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-mono tracking-wider text-cyan-300">
                VOCALIS AI INTERVIEW PROTOCOL
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-semibold">
                AUTONOMOUS ENGINE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Adaptive AI-powered technical interview system with real-time evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/50 px-3 py-1.5 rounded-xl border border-cyan-500/30">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Multimodal CV + JD Engine</span>
        </div>
      </div>

      {/* Grid: CV Upload & Job Description Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CV Upload Card */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono uppercase font-bold text-cyan-300 tracking-wider">
                1. RESUME / CV INPUT
              </h2>
            </div>
            <span className="text-[10px] font-mono text-red-400 font-bold">* REQUIRED</span>
          </div>

          <input
            type="file"
            ref={cvInputRef}
            onChange={handleCvUpload}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />

          <div
            onClick={() => cvInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              cvFileName
                ? "border-emerald-500/50 bg-emerald-950/20"
                : "border-cyan-500/30 hover:border-cyan-400/60 bg-slate-950/40"
            }`}
          >
            {isCvLoading ? (
              <div className="flex flex-col items-center gap-2 font-mono text-xs text-cyan-400 py-4">
                <Cpu className="w-8 h-8 animate-spin text-cyan-400" />
                <span>Extracting Text &amp; Candidate Profile...</span>
              </div>
            ) : cvFileName ? (
              <div className="flex flex-col items-center gap-2 py-2 font-mono text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span className="text-emerald-300 font-bold">{cvFileName}</span>
                <span className="text-[10px] text-gray-400">✓ CV RECEIVED &amp; PARSED</span>
                {cvProfile?.skills && (
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {cvProfile.skills.slice(0, 5).map((s: string, i: number) => (
                      <span key={i} className="text-[10px] bg-emerald-950 border border-emerald-500/40 px-2 py-0.5 rounded text-emerald-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4 font-mono text-xs">
                <Upload className="w-8 h-8 text-cyan-400" />
                <span className="text-cyan-300 font-bold">DROP YOUR CV HERE</span>
                <span className="text-[10px] text-gray-400">PDF / DOCX / TXT</span>
                <button
                  type="button"
                  className="mt-2 px-4 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition text-xs font-semibold"
                >
                  SELECT FILE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Job Description Upload Card */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono uppercase font-bold text-cyan-300 tracking-wider">
                2. JOB DESCRIPTION INPUT
              </h2>
            </div>
            <span className="text-[10px] font-mono text-red-400 font-bold">* REQUIRED</span>
          </div>

          <input
            type="file"
            ref={jdInputRef}
            onChange={handleJdUpload}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />

          <div
            onClick={() => jdInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              jdFileName
                ? "border-emerald-500/50 bg-emerald-950/20"
                : "border-cyan-500/30 hover:border-cyan-400/60 bg-slate-950/40"
            }`}
          >
            {isJdLoading ? (
              <div className="flex flex-col items-center gap-2 font-mono text-xs text-cyan-400 py-4">
                <Cpu className="w-8 h-8 animate-spin text-cyan-400" />
                <span>Analyzing Job Requirements &amp; Domain...</span>
              </div>
            ) : jdFileName ? (
              <div className="flex flex-col items-center gap-2 py-2 font-mono text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span className="text-emerald-300 font-bold">{jdFileName}</span>
                <span className="text-[10px] text-gray-400">✓ JOB DESCRIPTION ANALYZED</span>
                {jdData?.required_skills && (
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {jdData.required_skills.slice(0, 5).map((s: string, i: number) => (
                      <span key={i} className="text-[10px] bg-blue-950 border border-blue-500/40 px-2 py-0.5 rounded text-blue-300">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4 font-mono text-xs">
                <Upload className="w-8 h-8 text-cyan-400" />
                <span className="text-cyan-300 font-bold">DROP JOB DESCRIPTION HERE</span>
                <span className="text-[10px] text-gray-400">PDF / DOCX / TXT</span>
                <button
                  type="button"
                  className="mt-2 px-4 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition text-xs font-semibold"
                >
                  SELECT FILE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Target Configurations */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono uppercase font-bold text-cyan-300 tracking-wider">
            3. INTERVIEW CONFIGURATION PROTOCOL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
          {/* Domain Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-[11px] font-semibold flex items-center gap-1.5">
              <span>TARGET DOMAIN</span>
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-slate-950 border border-cyan-500/40 text-cyan-300 rounded-xl p-2.5 outline-none focus:border-cyan-400 font-mono text-xs"
            >
              {domainsList.map((d, i) => (
                <option key={i} value={d} className="bg-slate-950 text-gray-200">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-[11px] font-semibold">EXPERIENCE LEVEL</label>
            <div className="flex flex-wrap gap-1.5">
              {experienceList.map((exp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setExperienceLevel(exp)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition ${
                    experienceLevel === exp
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                      : "bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Programming Language */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-[11px] font-semibold flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" /> CODING LANGUAGE
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 border border-cyan-500/40 text-cyan-300 rounded-xl p-2.5 outline-none focus:border-cyan-400 font-mono text-xs"
            >
              {languagesList.map((lang, i) => (
                <option key={i} value={lang} className="bg-slate-950 text-gray-200">
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end mt-2">
        <button
          onClick={handleProceed}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-sm tracking-wider uppercase transition flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
        >
          <Zap className="w-5 h-5 fill-slate-950" />
          <span>INITIALIZE INTERVIEW ENGINE</span>
        </button>
      </div>
    </div>
  );
};
