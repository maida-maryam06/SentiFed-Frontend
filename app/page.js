"use client";
import { useEffect, useState } from "react";
import { getSummary, getRounds, getClientMetrics, getClients } from "../lib/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { Users, Activity, Zap, TrendingUp, RefreshCw } from "lucide-react";

const COLORS = ["#a855f7", "#06b6d4", "#10b981", "#ec4899", "#f59e0b", "#ef4444"];

function KpiCard({ label, value, sub, color = "#a855f7", icon: Icon }) {
  return (
    <div className="glass glass-hover rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-muted uppercase tracking-widest font-mono">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
             style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-text">{value ?? "—"}</p>
      {sub && <p className="text-xs text-muted mt-1 font-mono">{sub}</p>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2">
      <p className="text-xs text-muted font-mono mb-1">Round {label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-mono" style={{ color: p.color }}>
          {p.name}: {(p.value * 100).toFixed(2)}%
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary]       = useState(null);
  const [rounds, setRounds]         = useState([]);
  const [clientM, setClientM]       = useState([]);
  const [clients, setClients]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  async function load() {
    try {
      const [s, r, cm, cl] = await Promise.all([
        getSummary(), getRounds(), getClientMetrics(), getClients()
      ]);
      setSummary(s); setRounds(r); setClientM(cm); setClients(cl);
    } catch {}
    setLoading(false);
    setLastRefresh(new Date());
  }

  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, []);

  // Build per-client trust series for the chart
  const clientIds = [...new Set(clientM.map(m => m.client_id))];
  const trustByRound = {};
  clientM.forEach(m => {
    if (!trustByRound[m.round_number]) trustByRound[m.round_number] = { round: m.round_number };
    trustByRound[m.round_number][m.client_id] = m.trust_score;
  });
  const trustData = Object.values(trustByRound).sort((a, b) => a.round - b.round);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text">Live Dashboard</h1>
          <p className="text-subtle text-sm mt-1">
            Federated rounds · AT-FedAvg aggregation · Real-time metrics
          </p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-purple glass glass-hover font-mono">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          {lastRefresh.toLocaleTimeString()}
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="Global Accuracy" icon={TrendingUp}
          value={summary?.latest_accuracy != null ? `${(summary.latest_accuracy * 100).toFixed(2)}%` : "—"}
          sub="Round 10 · AT-FedAvg" color="#a855f7" />
        <KpiCard label="Rounds Complete" icon={Activity}
          value={summary?.rounds_completed ?? "—"}
          sub="of 10 scheduled" color="#06b6d4" />
        <KpiCard label="Active Clients" icon={Users}
          value={summary?.connected_clients ?? "—"}
          sub={`${summary?.total_registered_clients ?? 0} registered total`} color="#10b981" />
        <KpiCard label="Registered Clients" icon={Zap}
          value={summary?.total_registered_clients ?? "—"}
          sub="across all experiments" color="#ec4899" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Accuracy curve */}
        <div className="glass rounded-xl p-5">
          <p className="text-sm font-display font-semibold text-text mb-4">
            Global Accuracy per Round
          </p>
          {rounds.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={rounds}>
                <CartesianGrid stroke="#1e1e3f" strokeDasharray="4 2" />
                <XAxis dataKey="round_number" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis domain={[0.6, 0.8]} tickFormatter={v => `${(v*100).toFixed(0)}%`}
                       stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line dataKey="global_accuracy" stroke="#a855f7" strokeWidth={2}
                      dot={{ fill: "#a855f7", r: 3 }} name="Accuracy" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-muted text-sm font-mono">
              No round data yet — run a training experiment first
            </div>
          )}
        </div>

        {/* Trust scores */}
        <div className="glass rounded-xl p-5">
          <p className="text-sm font-display font-semibold text-text mb-4">
            Per-Client Trust Score
          </p>
          {trustData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trustData}>
                <CartesianGrid stroke="#1e1e3f" strokeDasharray="4 2" />
                <XAxis dataKey="round" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <YAxis domain={[0, 1.05]} stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                {clientIds.map((cid, i) => (
                  <Line key={cid} dataKey={cid} stroke={COLORS[i % COLORS.length]}
                        strokeWidth={2} dot={{ r: 3 }} name={cid} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-muted text-sm font-mono">
              No client metric data yet
            </div>
          )}
        </div>
      </div>

      {/* Client table */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-display font-semibold text-text mb-4">Registered Clients</p>
        {clients.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Client ID", "Status", "Device Info", "Last Seen"].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-xs text-muted font-mono uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.client_id} className="border-b border-border/50 hover:bg-border/20 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-purple text-xs">{c.client_id}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono
                      ${c.status === "active"
                        ? "bg-green-500/15 text-green-400 border border-green-500/30"
                        : c.status === "registered"
                        ? "bg-amber/15 text-amber border border-amber/30"
                        : "bg-red/15 text-red border border-red/30"
                      }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-subtle text-xs font-mono">{c.device_info || "—"}</td>
                  <td className="py-2.5 text-subtle text-xs font-mono">
                    {c.last_seen ? new Date(c.last_seen).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted text-sm font-mono">No clients registered yet.</p>
        )}
      </div>
    </div>
  );
}
