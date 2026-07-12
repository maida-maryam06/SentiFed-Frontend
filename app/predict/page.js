"use client";
import { useState } from "react";
import { predict } from "../../lib/api";
import { Send, Smile, Frown, Loader2, RotateCcw } from "lucide-react";

const EXAMPLES = [
  "The service was absolutely excellent, I loved every moment of it!",
  "Terrible product. Broke after one day. Waste of money.",
  "This movie was a masterpiece. The acting and storyline were phenomenal.",
  "Worst experience ever. The staff was rude and the food was cold.",
  "Amazing quality and fast delivery! Will definitely buy again.",
  "Very disappointed. Does not work as described at all.",
];

export default function PredictPage() {
  const [text, setText]     = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function run(inputText) {
    const t = inputText ?? text;
    if (!t.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const r = await predict(t);
      if (r.detail) throw new Error(r.detail);
      setResult(r);
    } catch (e) {
      setError(e.message || "Could not reach the API. Is api_server.py running?");
    }
    setLoading(false);
  }

  const positive = result?.sentiment === "Positive";
  const conf = result?.confidence ?? 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold gradient-text">Sentiment Prediction</h1>
        <p className="text-subtle text-sm mt-1">
          Run inference against the trained global model (BiLSTM · AT-FedAvg)
        </p>
      </div>

      {/* Input card */}
      <div className="glass rounded-xl p-6 mb-5">
        <label className="block text-xs text-muted font-mono uppercase tracking-widest mb-3">
          Review Text
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) run(); }}
          placeholder="Type or paste a review here... (Ctrl+Enter to predict)"
          rows={4}
          className="w-full bg-transparent text-text text-sm resize-none outline-none
                     placeholder:text-muted font-sans leading-relaxed"
        />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted font-mono">{text.length} chars</span>
          <div className="flex gap-2">
            {text && (
              <button onClick={() => { setText(""); setResult(null); }}
                className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-text
                           glass glass-hover font-mono flex items-center gap-1.5">
                <RotateCcw size={11} /> Clear
              </button>
            )}
            <button onClick={() => run()}
              disabled={loading || !text.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                       boxShadow: "0 0 20px #a855f730" }}>
              {loading
                ? <><Loader2 size={12} className="animate-spin" /> Predicting…</>
                : <><Send size={12} /> Predict</>}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass rounded-xl p-4 mb-5 border-red/30"
             style={{ borderColor: "rgba(239,68,68,0.3)" }}>
          <p className="text-red text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="glass rounded-xl p-6 mb-6"
             style={{ borderColor: positive ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)" }}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ background: positive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)" }}>
              {positive
                ? <Smile size={24} className="text-green-500" />
                : <Frown  size={24} className="text-red" />}
            </div>
            <div>
              <p className="font-display text-2xl font-bold"
                 style={{ color: positive ? "#10b981" : "#ef4444" }}>
                {result.sentiment}
              </p>
              <p className="text-subtle text-xs font-mono">{conf.toFixed(1)}% confidence</p>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-mono text-muted mb-1.5">
              <span>Confidence</span><span>{conf.toFixed(2)}%</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                   style={{
                     width: `${conf}%`,
                     background: positive
                       ? "linear-gradient(90deg,#10b981,#06b6d4)"
                       : "linear-gradient(90deg,#7c3aed,#ef4444)"
                   }} />
            </div>
          </div>

          {/* Probability breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(result.probabilities || {}).map(([label, prob]) => (
              <div key={label} className="rounded-lg p-3"
                   style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e3f" }}>
                <p className="text-xs text-muted font-mono mb-1">{label}</p>
                <p className="text-lg font-display font-bold"
                   style={{ color: label === "Positive" ? "#10b981" : "#ef4444" }}>
                  {prob.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>

          {/* Input echo */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted font-mono mb-1">Input</p>
            <p className="text-sm text-subtle italic">"{result.input}"</p>
          </div>
        </div>
      )}

      {/* Example reviews */}
      <div className="glass rounded-xl p-5">
        <p className="text-xs text-muted font-mono uppercase tracking-widest mb-3">
          Try an example
        </p>
        <div className="space-y-2">
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { setText(ex); run(ex); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-subtle
                         hover:text-text hover:bg-border/30 transition-colors font-sans leading-snug">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
