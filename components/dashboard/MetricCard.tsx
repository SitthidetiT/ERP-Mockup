import { ArrowUpRight, ChevronRight, ArrowUp } from "lucide-react";
import type { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "purple" | "amber" | "green";
};

export function MetricCard({
  icon,
  label,
  value,
  detail,
  tone,
}: MetricCardProps) {
  return (
    <article className={`dashboard-kpi-card tone-${tone}`}>
      <div className="kpi-top">
        <div className="kpi-icon-wrapper">
          {icon}
          <span className="kpi-label">{label}</span>
        </div>
        <button className="kpi-arrow-btn">
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>
      <div className="kpi-body">
        <div className="kpi-stats">
          <strong className="kpi-value">{value}</strong>
          <p className="kpi-detail">
            <ArrowUp size={14} strokeWidth={2.5} />
            {detail}
          </p>
        </div>
        <div className="kpi-sparkline">
          {/* Mock sparkline graphic using CSS */}
          <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 25C10 25 15 15 25 15C35 15 45 25 55 10C65 -5 75 20 80 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M0 25C10 25 15 15 25 15C35 15 45 25 55 10C65 -5 75 20 80 15L80 30L0 30Z" fill="currentColor" fillOpacity="0.1"/>
          </svg>
        </div>
      </div>
    </article>
  );
}
