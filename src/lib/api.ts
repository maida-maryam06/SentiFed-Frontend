const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json();
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Summary {
  rounds_completed: number;
  latest_accuracy: number | null;
  connected_clients: number;
  total_registered_clients: number;
}

export interface Round {
  round_number: number;
  global_accuracy: number;
  global_loss: number | null;
  num_participating_clients: number;
  communication_bytes: number;
  duration_seconds: number;
}

export interface ClientMetric {
  round_number: number;
  client_id: string;
  local_accuracy: number;
  local_loss: number;
  num_samples: number;
  adaptive_weight: number | null;
  trust_score: number | null;
  final_weight: number | null;
}

export interface Client {
  client_id: string;
  status: string;
  device_info: string;
  last_seen: string;
}

export interface Prediction {
  input: string;
  sentiment: "Positive" | "Negative";
  confidence: number;
  probabilities: { Positive: number; Negative: number };
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const api = {
  summary:       () => get<Summary>("/dashboard/summary"),
  rounds:        () => get<Round[]>("/dashboard/rounds"),
  clientMetrics: () => get<ClientMetric[]>("/dashboard/client-metrics"),
  clients:       () => get<Client[]>("/clients"),
  predict:       (text: string) => post<Prediction>("/predict", { text }),
  register:      (client_id: string, client_secret: string, device_info: object) =>
    post("/clients/register", { client_id, client_secret, device_info }),
  disconnect:    (client_id: string) =>
    post(`/clients/${client_id}/disconnect`, {}),
};
