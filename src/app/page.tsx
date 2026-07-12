import { Suspense } from "react";
import { Target, Users, RefreshCw, Zap } from "lucide-react";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import AccuracyChart from "@/components/AccuracyChart";
import TrustChart from "@/components/TrustChart";
import CommChart from "@/components/CommChart";

export const revalidate = 10; // refresh every 10s

async function DashboardContent() {
  let summary, rounds, clientMetrics;

  try {
    [summary, rounds, clientMetrics] = await Promise.all([
      api.summary(),
      api.rounds(),
      api.clientMetrics(),
    ]);
  } catch {
    return (
      <div className="glass p-8 text-center">
        <p className="text-muted text-sm">Cannot reach the API server.</p>
        <p className="text-muted text-xs mt-1">
          Start it with:{" "}
          <code className="font-mono text-purple">uvicorn api_server:app --reload --port 8000</code>
        </p>
      </div>
    );
  }

  const latestRound = rounds[rounds.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-syne font-bold text-3xl text-white">
          Training Dashboard
        </h1>
        <p className="text-muted text-sm mt-1">
          Live federated learning metrics — AT-FedAvg aggregation strategy
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Global Accuracy"
          value={summary.latest_accuracy !== null
            ? `${(summary.latest_accuracy * 100).toFixed(2)}%`
            : "—"}
          sub="Latest round"
          icon={Target}
          accent
        />
        <MetricCard
          label="Rounds Completed"
          value={summary.rounds_completed}
          sub="of configured total"
          icon={RefreshCw}
        />
        <MetricCard
          label="Connected Clients"
          value={summary.connected_clients}
          sub={`${summary.total_registered_clients} registered`}
          icon={Users}
        />
        <MetricCard
          label="Avg Round Time"
          value={
            latestRound
              ? `${latestRound.duration_seconds.toFixed(0)}s`
              : "—"
          }
          sub="Last round duration"
          icon={Zap}
        />
      </div>

      {/* Accuracy chart */}
      <div className="glass p-5">
        <p className="label mb-4">Global Accuracy per Round</p>
        <AccuracyChart rounds={rounds} />
      </div>

      {/* Trust + Comm charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass p-5">
          <p className="label mb-1">Per-Client Trust Scores</p>
          <p className="text-muted text-xs mb-4">Trust-Based Aggregation (AT-FedAvg novelty)</p>
          <TrustChart metrics={clientMetrics} />
        </div>
        <div className="glass p-5">
          <p className="label mb-1">Communication Overhead</p>
          <p className="text-muted text-xs mb-4">Bytes transferred per round</p>
          <CommChart rounds={rounds} />
        </div>
      </div>

      {/* Round log table */}
      {rounds.length > 0 && (
        <div className="glass p-5">
          <p className="label mb-4">Round History</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-muted border-b border-border text-xs">
                  <th className="text-left pb-2 pr-4">Round</th>
                  <th className="text-left pb-2 pr-4">Accuracy</th>
                  <th className="text-left pb-2 pr-4">Clients</th>
                  <th className="text-left pb-2 pr-4">Comm (KB)</th>
                  <th className="text-left pb-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {[...rounds].reverse().map((r) => (
                  <tr key={r.round_number} className="border-b border-border/50 hover:bg-white/[0.02]">
                    <td className="py-2 pr-4 text-purple">#{r.round_number}</td>
                    <td className="py-2 pr-4">{(r.global_accuracy * 100).toFixed(2)}%</td>
                    <td className="py-2 pr-4">{r.num_participating_clients}</td>
                    <td className="py-2 pr-4">{(r.communication_bytes / 1024).toFixed(1)}</td>
                    <td className="py-2 text-muted">{r.duration_seconds.toFixed(1)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        Loading dashboard…
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
