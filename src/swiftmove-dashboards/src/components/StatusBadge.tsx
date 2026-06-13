import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  MoveRequestStatus,
  MoveOfferStatus,
  MoveTripStatus,
} from "@/types";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline" | "success";
  }
> = {
  // MoveRequest statuses
  CREATED: { label: "Created", variant: "secondary" },
  ACCEPTED: { label: "Accepted", variant: "success" },
  OFFER_AVAILABLE: { label: "Offer Available", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  // MoveOffer statuses
  OFFER_SENT: { label: "Offer Sent", variant: "secondary" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  // MoveTrip statuses
  SCHEDULED: { label: "Scheduled", variant: "success" },
  IN_PROGRESS: { label: "In Progress", variant: "default" },
  PAYMENT_PENDING: { label: "Payment Pending", variant: "secondary" },
  DRIVER_COMPLETED: { label: "Driver Completed", variant: "secondary" },
  COMPLETED_BY_DRIVER: { label: "Waiting for Confirmation", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "outline" },
};



interface StatusBadgeProps {
  status: MoveRequestStatus | MoveOfferStatus | MoveTripStatus | string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || {
    label: status,
    variant: "secondary" as const,
  };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};



export default StatusBadge;
