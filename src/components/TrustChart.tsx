"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { ClientMetric } from "@/lib/api";

const COLORS = ["#a855f7","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6","#14b8a6"];

interface Props { metrics: ClientMetric[] }

export default function TrustChart({ metrics }: Props) {
  if (!metrics.length || metrics.every(m => m.trust_score === null)) return (
    <div className="h-64 flex items-center justify-center text-muted text-sm">
      No trust score data yet.
    </div>
  );

  // Pivot: [{round_number, client_0: score, client_1: score, ...}]
  const rounds: Record<number, Record<string, number>> = {};
  for (const m of metrics) {
    if (m.trust_score === null) continue;
    if (!rounds[m.round_number]) rounds[m.round_number] = { round: m.round_number };
    rounds[m.round_number][m.client_id] = m.trust_score;
  }
  const data = Object.values(rounds).sort((a, b) => a.round - b.round);
  const clientIds = [...new Set(metrics.map(m => m.client_id))];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
        <XAxis dataKey="round" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <YAxis domain={[0, 1.05]} tick={{ fill: "#94a3b8", fontSize: 11 }} width={36} />
        <Tooltip
          contentStyle={{ background: "#0f0f1f", border: "1px solid #1e1e3a", borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
          formatter={(v) => <span style={{ color: "#e2e8f0" }}>{v}</span>}
        />
        <ReferenceLine y={0.15} stroke="#f59e0b" strokeDasharray="4 4"
          label={{ value: "Blacklist", fill: "#f59e0b", fontSize: 10 }} />
        {clientIds.map((cid, i) => (
          <Line key={cid} type="monotone" dataKey={cid}
            stroke={COLORS[i % COLORS.length]} strokeWidth={2}
            dot={{ r: 3 }} activeDot={{ r: 5 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
