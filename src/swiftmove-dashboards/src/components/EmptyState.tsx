import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  title = "No information found",
  description = "There is currently no data to display in this section.",
  action,
  secondaryAction,
  className,
}: EmptyStateProps) => {

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center animate-fade-in",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-5 text-primary/80 ring-1 ring-primary/10 animate-float">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[260px] mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {secondaryAction && (
          <Button variant="outline" size="sm" onClick={secondaryAction.onClick} className="h-9 px-4 text-xs font-medium">
            {secondaryAction.label}
          </Button>
        )}
        {action && (
          <Button size="sm" onClick={action.onClick} className="h-9 px-5 text-xs font-medium shadow-sm">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};


export default EmptyState;
