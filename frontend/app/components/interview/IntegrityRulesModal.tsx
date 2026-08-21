"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckSquare, Square, Lock } from "lucide-react";

interface IntegrityRulesModalProps {
  onAcceptAndStart: () => void;
}

export const IntegrityRulesModal: React.FC<IntegrityRulesModalProps> = ({ onAcceptAndStart }) => {
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  const handleStart = () => {
    // Attempt fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    onAcceptAndStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel-glow max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-cyan-500/50 flex flex-col gap-6 relative shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-black font-mono text-cyan-300 tracking-wider">
              INTERVIEW SECURITY PROTOCOL
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Fullscreen &amp; Integrity Policy Acknowledgment
            </p>
          </div>
        </div>

        {/* Rules Body */}
        <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 font-mono text-xs text-gray-300">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Fullscreen mode is required.</span>
          </div>

          <p className="text-[11px] text-gray-400">
            During this adaptive technical interview session:
          </p>

          <ul className="flex flex-col gap-2 pl-2 text-[11px]">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Browser focus and tab visibility are monitored.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Tab switching will be recorded as an integrity violation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Exiting fullscreen mode will trigger a system security warning.</span>
            </li>
            <li className="flex items-start gap-2 text-red-400 font-bold">
              <span className="text-red-400">•</span>
              <span>Exceeding the allowed violations (2 max) will terminate the interview immediately.</span>
            </li>
          </ul>

          <div className="mt-1 pt-2 border-t border-slate-800 text-[10px] text-gray-500 italic">
            Note: System monitors browser window state via visibility and focus APIs.
          </div>
        </div>

        {/* Checkbox Acknowledgment */}
        <button
          type="button"
          onClick={() => setAcknowledged(!acknowledged)}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-left transition cursor-pointer"
        >
          {acknowledged ? (
            <CheckSquare className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          ) : (
            <Square className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
          <span className={acknowledged ? "text-cyan-300 font-semibold" : "text-gray-400"}>
            I UNDERSTAND AND AGREE TO THE SECURITY MONITORING RULES
          </span>
        </button>

        {/* Action Button */}
        <button
          disabled={!acknowledged}
          onClick={handleStart}
          className={`w-full py-3.5 rounded-xl font-mono font-black text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 ${
            acknowledged
              ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.5)] cursor-pointer"
              : "bg-slate-900 text-gray-600 border border-slate-800 cursor-not-allowed"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>START INTERVIEW</span>
        </button>
      </div>
    </div>
  );
};
