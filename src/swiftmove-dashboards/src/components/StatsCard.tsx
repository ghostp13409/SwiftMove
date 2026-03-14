import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card className="shadow-sm border-border/50 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 var(--ease-out-quart)">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">

      <CardTitle className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
      <div className="text-primary/80">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {description && <p className="text-[11px] text-muted-foreground mt-1 font-medium">{description}</p>}
    </CardContent>
  </Card>
);


export default StatsCard;
