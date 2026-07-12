"use client";
import { useState } from "react";
import { Send, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { api, type Prediction } from "@/lib/api";

const EXAMPLES = [
  "The service was absolutely excellent — highly recommended!",
  "Terrible experience. Never buying from this store again.",
  "This product exceeded all my expectations. Five stars!",
  "Waste of money. Broke after two days.",
  "Decent quality for the price. Would consider again.",
];

export default function PredictPage() {
  const [text, setText]         = useState("");
  const [result, setResult]     = useState<Prediction | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await api.predict(text);
      setResult(r);
    } catch (e: any) {
      setError(e.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const isPositive = result?.sentiment === "Positive";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-syne font-bold text-3xl text-white">Sentiment Prediction</h1>
        <p className="text-muted text-sm mt-1">
          Run inference using the trained global AT-FedAvg model
        </p>
      </div>

      {/* Input */}
      <div className="glass p-5 space-y-4">
        <label className="label">Review Text</label>
        <textarea
          className="w-full bg-bg border border-border rounded-lg p-3 text-sm text-white
                     placeholder:text-muted resize-none focus:outline-none
                     focus:border-purple/60 transition-colors font-inter"
          rows={4}
          placeholder="Type or paste a product / movie / service review…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handleSubmit(); }}
        />

        {/* Quick examples */}
        <div>
          <p className="label mb-2">Quick examples</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setText(ex); setResult(null); }}
                className="text-xs px-3 py-1.5 rounded-lg border border-border
                           text-muted hover:text-white hover:border-purple/40
                           hover:bg-purple/10 transition-all"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="btn-primary flex items-center gap-2 w-full justify-center"
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</>
            : <><Send size={16} /> Predict Sentiment</>
          }
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="glass border-red-500/30 p-4 text-red-400 text-sm">
          {error} — is the API server running on port 8000?
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`glass p-6 space-y-4 ${
          isPositive ? "border-green-500/30" : "border-red-500/30"
        }`}>
          {/* Verdict */}
          <div className="flex items-center gap-3">
            {isPositive
              ? <ThumbsUp size={28} className="text-green-400" />
              : <ThumbsDown size={28} className="text-red-400" />
            }
            <div>
              <p className={`font-syne font-bold text-2xl ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}>
                {result.sentiment}
              </p>
              <p className="text-muted text-xs">
                Confidence: {result.confidence}%
              </p>
            </div>
          </div>

          {/* Probability bars */}
          <div className="space-y-2">
            {(["Positive", "Negative"] as const).map(label => {
              const val = result.probabilities[label];
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-muted">{label}</span>
                    <span className="text-white">{val}%</span>
                  </div>
                  <div className="h-2 bg-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        label === "Positive" ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input echo */}
          <div className="border-t border-border pt-3">
            <p className="label mb-1">Input</p>
            <p className="text-sm text-muted italic">"{result.input}"</p>
          </div>
        </div>
      )}

      {/* Note */}
      <p className="text-muted text-xs text-center">
        Model must be trained first via <code className="font-mono text-purple">run_simulation.py</code> before predictions work.
      </p>
    </div>
  );
}
