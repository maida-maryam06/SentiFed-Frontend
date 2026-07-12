"use client";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

/* ── Exact data from the 6 experiment runs ────────────────────────────────── */
const ROUNDS = [1,2,3,4,5,6,7,8,9,10];

const ACC = {
  "3 Clients":  [0.6611,0.7000,0.7139,0.7331,0.7317,0.7425,0.7367,0.7356,0.7375,0.7489],
  "5 Clients":  [0.6489,0.6950,0.7303,0.7375,0.7283,0.7386,0.7433,0.7378,0.7353,0.7322],
  "8 Clients":  [0.6572,0.6700,0.6939,0.7114,0.7214,0.7350,0.7406,0.7433,0.7503,0.7483],
};
const ACC_ATK = {
  "3 Clients":  [0.6208,0.6369,0.6644,0.6631,0.6689,0.6569,0.6722,0.6789,0.6881,0.6864],
  "5 Clients":  [0.6639,0.6767,0.7119,0.7406,0.7544,0.7433,0.7558,0.7519,0.7353,0.7553],
  "8 Clients":  [0.6469,0.6594,0.6961,0.7169,0.7269,0.7253,0.7397,0.7442,0.7486,0.7464],
};

const FINAL = [
  { config: "3 Clients", accuracy: 74.89, precision: 76.48, recall: 72.52, f1: 74.45, time: 1801, attacked: 68.64 },
  { config: "5 Clients", accuracy: 73.22, precision: 74.91, recall: 70.54, f1: 72.66, time: 1178, attacked: 75.53 },
  { config: "8 Clients", accuracy: 75.53, precision: 77.16, recall: 73.13, f1: 75.09, time: 1033, attacked: 74.64 },
];

const COLORS = { "3 Clients": "#a855f7", "5 Clients": "#06b6d4", "8 Clients": "#10b981" };

const accData = ROUNDS.map((r, i) => ({
  round: r,
  "3 Clients": +(ACC["3 Clients"][i]*100).toFixed(2),
  "5 Clients": +(ACC["5 Clients"][i]*100).toFixed(2),
  "8 Clients": +(ACC["8 Clients"][i]*100).toFixed(2),
}));

const atkData = ROUNDS.map((r, i) => ({
  round: r,
  "Clean (3)":   +(ACC["3 Clients"][i]*100).toFixed(2),
  "Attacked (3)":+(ACC_ATK["3 Clients"][i]*100).toFixed(2),
}));

function CT({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs font-mono">
      <p className="text-muted mb-1">Round {label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <div className="glass rounded-xl p-6 mb-5">
      <div className="mb-5">
        <p className="font-display font-semibold text-text">{title}</p>
        {sub && <p className="text-xs text-muted font-mono mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold gradient-text">Experiment Results</h1>
        <p className="text-subtle text-sm mt-1">
          AT-FedAvg · 6 runs · IMDB + Sentiment140 + Amazon · 8,000 samples each · 10 rounds
        </p>
      </div>

      {/* Final metrics table */}
      <Section title="Final Performance — Round 10" sub="All configs, no attack">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Config", "Accuracy", "Precision", "Recall", "F1-Score", "Total Time", "Accuracy (Attacked)"].map(h => (
                <th key={h} className="text-left py-2 pr-6 text-xs text-muted font-mono uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FINAL.map(row => (
              <tr key={row.config} className="border-b border-border/40">
                <td className="py-3 pr-6 font-mono text-xs" style={{ color: COLORS[row.config] }}>
                  {row.config}
                </td>
                <td className="py-3 pr-6 font-mono text-xs text-text font-semibold">{row.accuracy}%</td>
                <td className="py-3 pr-6 font-mono text-xs text-subtle">{row.precision}%</td>
                <td className="py-3 pr-6 font-mono text-xs text-subtle">{row.recall}%</td>
                <td className="py-3 pr-6 font-mono text-xs text-subtle">{row.f1}%</td>
                <td className="py-3 pr-6 font-mono text-xs text-subtle">{row.time}s</td>
                <td className="py-3 font-mono text-xs"
                    style={{ color: row.attacked < row.accuracy ? "#ef4444" : "#10b981" }}>
                  {row.attacked}%
                  <span className="ml-1 text-muted">
                    ({row.attacked < row.accuracy
                      ? `−${(row.accuracy - row.attacked).toFixed(2)}`
                      : `+${(row.attacked - row.accuracy).toFixed(2)}`}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Section title="Global Accuracy per Round" sub="3 vs 5 vs 8 clients — no attack">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={accData}>
              <CartesianGrid stroke="#1e1e3f" strokeDasharray="4 2" />
              <XAxis dataKey="round" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis domain={[60, 80]} tickFormatter={v => `${v}%`}
                     stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip content={<CT />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              {Object.keys(COLORS).map(k => (
                <Line key={k} dataKey={k} stroke={COLORS[k]} strokeWidth={2}
                      dot={{ r: 3, fill: COLORS[k] }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Attack Impact — 3 Clients" sub="Clean vs label-flip attack on client_2">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={atkData}>
              <CartesianGrid stroke="#1e1e3f" strokeDasharray="4 2" />
              <XAxis dataKey="round" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis domain={[55, 80]} tickFormatter={v => `${v}%`}
                     stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip content={<CT />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Line dataKey="Clean (3)"    stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: "#a855f7" }} />
              <Line dataKey="Attacked (3)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: "#ef4444" }} />
            </LineChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Bar charts row */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Section title="F1-Score Comparison" sub="3 vs 5 vs 8 clients">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FINAL} barSize={36}>
              <CartesianGrid stroke="#1e1e3f" strokeDasharray="4 2" />
              <XAxis dataKey="config" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis domain={[60, 80]} tickFormatter={v => `${v}%`}
                     stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip content={<CT />} />
              <Bar dataKey="f1" name="F1-Score" radius={[4,4,0,0]}>
                {FINAL.map(e => <Cell key={e.config} fill={COLORS[e.config]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Training Time" sub="Total seconds across 10 rounds">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FINAL} barSize={36}>
              <CartesianGrid stroke="#1e1e3f" strokeDasharray="4 2" />
              <XAxis dataKey="config" stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip />
              <Bar dataKey="time" name="Time (s)" radius={[4,4,0,0]}>
                {FINAL.map(e => <Cell key={e.config} fill={COLORS[e.config]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* Key findings */}
      <Section title="Key Findings" sub="Derived from experiment output">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Best Accuracy",
              value: "75.53%",
              detail: "8 clients, no attack",
              color: "#10b981",
            },
            {
              label: "Worst Attack Impact",
              value: "−6.25%",
              detail: "3 clients (1 of 3 = 33% malicious)",
              color: "#ef4444",
            },
            {
              label: "Fastest Training",
              value: "1033s",
              detail: "8 clients — less data per client per round",
              color: "#06b6d4",
            },
          ].map(f => (
            <div key={f.label} className="rounded-lg p-4"
                 style={{ background: `${f.color}0d`, border: `1px solid ${f.color}30` }}>
              <p className="text-xs font-mono text-muted uppercase tracking-widest mb-1">{f.label}</p>
              <p className="text-2xl font-display font-bold" style={{ color: f.color }}>{f.value}</p>
              <p className="text-xs font-mono text-subtle mt-1">{f.detail}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
