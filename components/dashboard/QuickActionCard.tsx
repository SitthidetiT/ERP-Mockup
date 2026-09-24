import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type QuickActionCardProps = {
  eyebrow: string;
  title: string;
  detail: string;
  icon: ReactNode;
  onClick: () => void;
};

export function QuickActionCard({
  eyebrow,
  title,
  detail,
  icon,
  onClick,
}: QuickActionCardProps) {
  return (
    <button className="quick-action-card" onClick={onClick}>
      <div className="qa-icon">{icon}</div>
      <div className="qa-content">
        <span className="qa-eyebrow">{eyebrow}</span>
        <strong className="qa-title">{title}</strong>
        <p className="qa-detail">{detail}</p>
      </div>
      <div className="qa-arrow">
        <ArrowRight size={18} />
      </div>
    </button>
  );
}
