"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Users, Activity } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/",         label: "Dashboard", icon: LayoutDashboard },
  { href: "/predict",  label: "Predict",   icon: MessageSquare   },
  { href: "/clients",  label: "Clients",   icon: Users           },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <nav className="border-b border-border bg-panel/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Activity className="text-purple" size={20} />
          <span className="font-syne font-bold text-lg tracking-tight">
            Senti<span className="text-purple">Fed</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                path === href
                  ? "bg-purple/15 text-purple"
                  : "text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Badge */}
        <span className="pill border-purple/30 text-purple bg-purple/10">
          AT-FedAvg
        </span>
      </div>
    </nav>
  );
}
