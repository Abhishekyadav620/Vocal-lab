"use client";

import React from "react";
import { Cpu, HardDrive, Wifi, Activity, Battery } from "lucide-react";

export interface SystemStats {
  cpu_percent: number;
  ram_percent: number;
  ram_used_gb: number;
  ram_total_gb: number;
  disks: Record<string, number>;
  net_sent_mb: number;
  net_recv_mb: number;
  battery: number | null;
  timestamp?: number;
}

interface TelemetryPanelProps {
  stats: SystemStats | null;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ stats }) => {
  const cpu = stats?.cpu_percent ?? 12.4;
  const ram = stats?.ram_percent ?? 45.2;
  const ramUsed = stats?.ram_used_gb ?? 7.2;
  const ramTotal = stats?.ram_total_gb ?? 16.0;
  const netSent = stats?.net_sent_mb ?? 142.5;
  const netRecv = stats?.net_recv_mb ?? 620.1;

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 text-sm text-gray-200">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> Live Telemetry
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
          HOST ACTIVE
        </span>
      </div>

      {/* CPU Gauge */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-gray-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU LOAD
          </span>
          <span className={cpu > 80 ? "text-red-400 font-bold" : "text-cyan-300"}>
            {cpu.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              cpu > 80 ? "bg-red-500" : cpu > 50 ? "bg-amber-400" : "bg-cyan-400"
            }`}
            style={{ width: `${Math.min(100, Math.max(5, cpu))}%` }}
          />
        </div>
      </div>

      {/* RAM Gauge */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-gray-300">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> RAM MEMORY
          </span>
          <span className="text-emerald-300">
            {ramUsed} / {ramTotal} GB ({ram.toFixed(0)}%)
          </span>
        </div>
        <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, Math.max(5, ram))}%` }}
          />
        </div>
      </div>

      {/* Network Activity */}
      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-cyan-900/40">
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Wifi className="w-3 h-3 text-cyan-400" /> UPSTREAM
          </div>
          <div className="text-cyan-300 font-bold mt-0.5">{netSent} MB</div>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-cyan-900/40">
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Wifi className="w-3 h-3 text-emerald-400" /> DOWNSTREAM
          </div>
          <div className="text-emerald-300 font-bold mt-0.5">{netRecv} MB</div>
        </div>
      </div>

      {/* Disks */}
      {stats?.disks && Object.keys(stats.disks).length > 0 && (
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
          <span className="text-[11px] font-mono text-gray-400">STORAGE DRIVES</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.disks).map(([drive, pct]) => (
              <span
                key={drive}
                className="text-[10px] font-mono px-2 py-1 bg-slate-900 rounded border border-slate-700 text-gray-300"
              >
                {drive}: <strong className="text-cyan-400">{pct}%</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
