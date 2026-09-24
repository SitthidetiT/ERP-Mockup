import { ArrowUpRight, ChevronRight } from "lucide-react";
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
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__top">
        <span className="metric-card__icon">{icon}</span>
        <span className="metric-card__action" aria-hidden="true">
          <ChevronRight size={18} />
        </span>
      </div>
      <p className="metric-card__label">{label}</p>
      <strong className="metric-card__value">{value}</strong>
      <p className="metric-card__detail">
        <ArrowUpRight size={14} />
        {detail}
      </p>
      <span className="metric-card__spark" aria-hidden="true" />
    </article>
  );
}
