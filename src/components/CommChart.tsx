"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import type { Round } from "@/lib/api";

export default function CommChart({ rounds }: { rounds: Round[] }) {
  if (!rounds.length) return null;
  const data = rounds.map(r => ({
    round: r.round_number,
    kb: +(r.communication_bytes / 1024).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
        <XAxis dataKey="round" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} width={48}
               label={{ value: "KB", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: "#0f0f1f", border: "1px solid #1e1e3a", borderRadius: 8, fontSize: 11 }}
          formatter={(v: number) => [`${v} KB`, "Comm. Overhead"]}
        />
        <Bar dataKey="kb" fill="#7c3aed" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
