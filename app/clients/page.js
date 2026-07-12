"use client";
import { useState, useEffect } from "react";
import { getClients, registerClient, loginClient } from "../../lib/api";
import { UserPlus, LogIn, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

function StatusBadge({ status }) {
  const cfg = {
    active:       { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
    registered:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
    disconnected: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)"  },
  }[status] ?? { color: "#64748b", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.3)" };

  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-mono"
          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {status}
    </span>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [tab, setTab]         = useState("list");   // list | register | login
  const [form, setForm]       = useState({ client_id: "", client_secret: "", device_info: "" });
  const [msg, setMsg]         = useState(null);     // { type: ok|err, text }
  const [loading, setLoading] = useState(false);

  async function load() { setClients(await getClients()); }
  useEffect(() => { load(); }, []);

  async function handleRegister() {
    setLoading(true); setMsg(null);
    try {
      const r = await registerClient(
        form.client_id, form.client_secret,
        form.device_info ? { info: form.device_info } : {}
      );
      if (r.detail) throw new Error(r.detail);
      setMsg({ type: "ok", text: `Client "${r.client_id}" registered successfully.` });
      setForm({ client_id: "", client_secret: "", device_info: "" });
      load();
    } catch (e) { setMsg({ type: "err", text: e.message }); }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true); setMsg(null);
    try {
      const r = await loginClient(form.client_id, form.client_secret);
      if (r.detail) throw new Error(r.detail);
      setMsg({ type: "ok", text: `Client "${r.client_id}" authenticated. Status → active.` });
      load();
    } catch (e) { setMsg({ type: "err", text: e.message }); }
    setLoading(false);
  }

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="block text-xs text-muted font-mono uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input type={type} value={form[name]} placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        className="w-full bg-transparent border border-border rounded-lg px-3 py-2.5
                   text-sm text-text placeholder:text-muted font-mono outline-none
                   focus:border-purple transition-colors" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text">Client Management</h1>
          <p className="text-subtle text-sm mt-1">Register, authenticate, and monitor FL participants</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-purple glass glass-hover font-mono">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: registered client list */}
        <div className="col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-display font-semibold text-text">Registered Clients</p>
            <span className="text-xs font-mono text-muted">{clients.length} total</span>
          </div>
          {clients.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Client ID", "Status", "Last Seen", "Device"].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-xs text-muted font-mono uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.client_id} className="border-b border-border/40 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4 font-mono text-purple text-xs">{c.client_id}</td>
                    <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
                    <td className="py-3 pr-4 text-subtle text-xs font-mono">
                      {c.last_seen ? new Date(c.last_seen).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 text-subtle text-xs font-mono truncate max-w-[120px]">
                      {c.device_info || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-muted">
              <Clock size={28} className="mb-2 opacity-40" />
              <p className="text-sm font-mono">No clients registered yet.</p>
              <p className="text-xs mt-1 opacity-60">Use the form on the right to add one.</p>
            </div>
          )}
        </div>

        {/* Right: register / login form */}
        <div className="glass rounded-xl p-5">
          {/* Tab switcher */}
          <div className="flex rounded-lg overflow-hidden border border-border mb-5">
            {[
              { key: "register", label: "Register", icon: UserPlus },
              { key: "login",    label: "Login",    icon: LogIn    },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => { setTab(key); setMsg(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-mono
                            transition-all ${tab === key
                              ? "text-purple bg-purple/10"
                              : "text-muted hover:text-text"}`}>
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Field label="Client ID"     name="client_id"     placeholder="e.g. client_1" />
            <Field label="Secret"        name="client_secret" type="password" placeholder="••••••••" />
            {tab === "register" && (
              <Field label="Device Info (optional)" name="device_info" placeholder="e.g. Windows GPU" />
            )}
          </div>

          {/* Feedback */}
          {msg && (
            <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-xs font-mono
              ${msg.type === "ok"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red/10 border border-red/30 text-red"}`}>
              {msg.type === "ok"
                ? <CheckCircle size={13} className="mt-0.5 shrink-0" />
                : <XCircle    size={13} className="mt-0.5 shrink-0" />}
              {msg.text}
            </div>
          )}

          <button
            onClick={tab === "register" ? handleRegister : handleLogin}
            disabled={loading || !form.client_id || !form.client_secret}
            className="w-full mt-4 py-2.5 rounded-lg text-sm font-mono font-medium
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                     boxShadow: "0 0 20px #a855f720" }}>
            {loading ? "Processing…" : tab === "register" ? "Register Client" : "Authenticate"}
          </button>
        </div>
      </div>
    </div>
  );
}
