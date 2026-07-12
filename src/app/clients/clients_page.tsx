"use client";
import { useState, useEffect, useCallback } from "react";
import { UserPlus, RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";
import { api, type Client } from "@/lib/api";
import clsx from "clsx";
import ClientTime from "@/components/ClientTime";

const STATUS_STYLE: Record<string, string> = {
  active:       "border-green-500/40  text-green-400  bg-green-500/10",
  registered:   "border-purple/40     text-purple      bg-purple/10",
  disconnected: "border-border        text-muted       bg-white/5",
};

export default function ClientsPage() {
  const [clients, setClients]     = useState<Client[]>([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState({ id: "", secret: "", device: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]             = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setClients(await api.clients()); }
    catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleRegister() {
    if (!form.id || !form.secret) return;
    setSubmitting(true); setMsg(null);
    try {
      await api.register(form.id, form.secret, { device: form.device || "unknown" });
      setMsg({ type: "ok", text: `Client "${form.id}" registered successfully.` });
      setForm({ id: "", secret: "", device: "" });
      refresh();
    } catch (e: any) {
      setMsg({ type: "err", text: e.message ?? "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDisconnect(client_id: string) {
    try {
      await api.disconnect(client_id);
      refresh();
    } catch { /* ignore */ }
  }

  const active = clients.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-3xl text-white">Client Management</h1>
          <p className="text-muted text-sm mt-1">
            Register, monitor, and manage federated learning participants
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border
                     text-muted hover:text-white hover:border-purple/40 transition-all text-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Registered", value: clients.length },
          { label: "Active",           value: active,                      accent: true },
          { label: "Offline",          value: clients.length - active },
        ].map(({ label, value, accent }) => (
          <div key={label} className={clsx("glass p-4 text-center", accent && "border-purple/40")}>
            <p className={clsx("font-syne font-bold text-3xl", accent ? "text-purple" : "text-white")}>
              {value}
            </p>
            <p className="label mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Client list */}
      <div className="glass p-5">
        <p className="label mb-4">Connected Clients</p>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : clients.length === 0 ? (
          <p className="text-muted text-sm">No clients registered yet.</p>
        ) : (
          <div className="space-y-2">
            {clients.map(c => (
              <div
                key={c.client_id}
                className="flex items-center justify-between p-3 rounded-lg
                           border border-border hover:border-purple/20 bg-bg/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  {c.status === "active"
                    ? <Wifi size={15} className="text-green-400" />
                    : <WifiOff size={15} className="text-muted" />
                  }
                  <div>
                    <p className="font-mono text-sm text-white">{c.client_id}</p>
                    <p className="text-muted text-xs">{c.device_info}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-1 text-muted text-xs">
                    <Clock size={11} />
                    {c.last_seen ? <ClientTime dateStr={c.last_seen} /> : "—"}
                  </div>
                  <span className={clsx("pill text-[10px]", STATUS_STYLE[c.status] ?? STATUS_STYLE.disconnected)}>
                    {c.status}
                  </span>
                  {c.status === "active" && (
                    <button
                      onClick={() => handleDisconnect(c.client_id)}
                      className="text-xs text-muted hover:text-red-400 transition-colors"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Register form */}
      <div className="glass p-5 space-y-4">
        <p className="label">Register New Client</p>

        {msg && (
          <div className={clsx("p-3 rounded-lg text-sm", msg.type === "ok"
            ? "bg-green-500/10 border border-green-500/30 text-green-400"
            : "bg-red-500/10 border border-red-500/30 text-red-400"
          )}>
            {msg.text}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { key: "id",     placeholder: "Client ID",      label: "Client ID *" },
            { key: "secret", placeholder: "Secret key",     label: "Secret *",    type: "password" },
            { key: "device", placeholder: "e.g. Windows 11",label: "Device info" },
          ].map(({ key, placeholder, label, type }) => (
            <div key={key}>
              <p className="label mb-1.5">{label}</p>
              <input
                type={type ?? "text"}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2
                           text-sm text-white placeholder:text-muted font-mono
                           focus:outline-none focus:border-purple/60 transition-colors"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleRegister}
          disabled={submitting || !form.id || !form.secret}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={15} />
          {submitting ? "Registering…" : "Register Client"}
        </button>
      </div>
    </div>
  );
}
