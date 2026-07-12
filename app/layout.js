"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, Users, BarChart3,
  Brain, Activity
} from "lucide-react";

const NAV = [
  { href: "/",        label: "Dashboard",  icon: LayoutDashboard },
  { href: "/predict", label: "Predict",    icon: MessageSquare   },
  { href: "/clients", label: "Clients",    icon: Users           },
  { href: "/results", label: "Results",    icon: BarChart3       },
];

function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-56 flex flex-col z-50"
           style={{ background: "rgba(8,8,18,0.95)", borderRight: "1px solid #1e1e3f" }}>

      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
            <Brain size={16} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-text tracking-wide">SentiFed</p>
            <p className="text-xs text-muted font-mono">AT-FedAvg</p>
          </div>
        </div>
      </div>

      {/* Live status */}
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="pulse-dot w-2 h-2 rounded-full bg-green-500 block" />
          <span className="text-xs text-subtle font-mono">Server active</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${active
                  ? "text-purple font-medium"
                  : "text-subtle hover:text-text"
                }`}
              style={active ? {
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.25)"
              } : {}}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-xs text-muted font-mono">SentiFed v1.0</p>
        <p className="text-xs text-muted mt-0.5">IMDB · S140 · Amazon</p>
      </div>
    </aside>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SentiFed — Federated Sentiment Analysis</title>
        <meta name="description" content="AT-FedAvg federated learning dashboard" />
      </head>
      <body>
        <Sidebar />
        <main className="ml-56 min-h-screen p-6"
              style={{
                background: "radial-gradient(ellipse at top left,#7c3aed18,transparent 50%), radial-gradient(ellipse at bottom right,#ec489912,transparent 50%)"
              }}>
          {children}
        </main>
      </body>
    </html>
  );
}
