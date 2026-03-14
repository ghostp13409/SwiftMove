import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card className="shadow-sm border-border/50 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 var(--ease-out-quart) bg-card/50 backdrop-blur-sm overflow-hidden relative group">
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      {icon}
    </div>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
      <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
      {description && <p className="text-[11px] text-muted-foreground mt-1 font-medium leading-none">{description}</p>}
    </CardContent>
  </Card>
);



export default StatsCard;
