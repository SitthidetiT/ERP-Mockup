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
    <button type="button" className="quick-action-card" onClick={onClick}>
      <span className="quick-action-card__icon">{icon}</span>
      <span className="quick-action-card__content">
        <span className="quick-action-card__eyebrow">{eyebrow}</span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <span className="quick-action-card__action" aria-hidden="true">
        <ArrowRight size={17} />
      </span>
    </button>
  );
}
