const BASE = "/api";

export async function getSummary() {
  const r = await fetch(`${BASE}/dashboard/summary`);
  return r.json();
}
export async function getRounds() {
  const r = await fetch(`${BASE}/dashboard/rounds`);
  return r.json();
}
export async function getClientMetrics() {
  const r = await fetch(`${BASE}/dashboard/client-metrics`);
  return r.json();
}
export async function getClients() {
  const r = await fetch(`${BASE}/clients`);
  return r.json();
}
export async function predict(text) {
  const r = await fetch(`${BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return r.json();
}
export async function registerClient(client_id, client_secret, device_info = {}) {
  const r = await fetch(`${BASE}/clients/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id, client_secret, device_info }),
  });
  return r.json();
}
export async function loginClient(client_id, client_secret) {
  const r = await fetch(`${BASE}/clients/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id, client_secret }),
  });
  return r.json();
}
