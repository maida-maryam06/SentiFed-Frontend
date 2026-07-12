import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: boolean;
}

export default function MetricCard({ label, value, sub, icon: Icon, accent }: Props) {
  return (
    <div className={clsx("glass p-5 flex flex-col gap-3", accent && "border-purple/40 shadow-glow")}>
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        <Icon size={16} className={accent ? "text-purple" : "text-muted"} />
      </div>
      <div>
        <p className={clsx("font-syne font-bold text-3xl", accent ? "text-purple" : "text-white")}>
          {value}
        </p>
        {sub && <p className="text-muted text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}
