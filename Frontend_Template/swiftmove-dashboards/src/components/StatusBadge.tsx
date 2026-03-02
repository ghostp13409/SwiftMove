import { Badge } from "@/components/ui/badge";
import type { MoveRequestStatus, MoveOfferStatus, MoveTripStatus } from "@/types";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  ACCEPTED: { label: "Accepted", variant: "default" },
  IN_PROGRESS: { label: "In Progress", variant: "default" },
  COMPLETED: { label: "Completed", variant: "outline" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  SCHEDULED: { label: "Scheduled", variant: "default" },
};

interface StatusBadgeProps {
  status: MoveRequestStatus | MoveOfferStatus | MoveTripStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default StatusBadge;
