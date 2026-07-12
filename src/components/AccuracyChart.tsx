"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { Round } from "@/lib/api";

interface Props { rounds: Round[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 text-xs font-mono">
      <p className="text-muted mb-1">Round {label}</p>
      <p className="text-purple">Accuracy: {(payload[0].value * 100).toFixed(2)}%</p>
      {payload[1] && (
        <p className="text-violet">Loss: {payload[1].value?.toFixed(4)}</p>
      )}
    </div>
  );
};

export default function AccuracyChart({ rounds }: Props) {
  if (!rounds.length) return (
    <div className="h-64 flex items-center justify-center text-muted text-sm">
      No rounds completed yet.
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={rounds} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
        <XAxis
          dataKey="round_number"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          label={{ value: "Round", position: "insideBottom", offset: -2, fill: "#94a3b8", fontSize: 11 }}
        />
        <YAxis
          domain={[0.5, 1]}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0.75} stroke="#a855f7" strokeDasharray="4 4" opacity={0.4} />
        <Line
          type="monotone" dataKey="global_accuracy"
          stroke="#a855f7" strokeWidth={2.5}
          dot={{ fill: "#a855f7", r: 4 }} activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
