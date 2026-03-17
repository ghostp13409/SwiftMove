import * as React from "react";
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";

// --- Types ---

interface DataPoint {
  name: string;
  value: number;
}

interface TrendPoint {
  date: string;
  amount: number;
}

// --- Configs ---

const defaultChartConfig: ChartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

const statusChartConfig: ChartConfig = {
  CREATED: { label: "Created", color: "hsl(var(--muted-foreground))" },
  ACCEPTED: { label: "Accepted", color: "hsl(var(--primary))" },
  SCHEDULED: { label: "Scheduled", color: "hsl(162, 84%, 40%)" },
  IN_PROGRESS: { label: "In Progress", color: "hsl(var(--primary))" },
  COMPLETED: { label: "Completed", color: "hsl(162, 84%, 20%)" },
  CANCELLED: { label: "Cancelled", color: "hsl(var(--destructive))" },
};

// --- Components ---

export const SimpleBarChart = ({ data, title }: { data: DataPoint[], title?: string }) => {
  return (
    <div className="w-full h-[250px]">
      {title && <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{title}</h4>}
      <ChartContainer config={defaultChartConfig} className="h-full w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="name" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export const SimpleLineChart = ({ data, title }: { data: TrendPoint[], title?: string }) => {
  return (
    <div className="w-full h-[250px]">
      {title && <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{title}</h4>}
      <ChartContainer config={defaultChartConfig} className="h-full w-full">
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3} 
            dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export const StatusPieChart = ({ data, title }: { data: any[], title?: string }) => {
  return (
    <div className="w-full h-[250px]">
      {title && <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{title}</h4>}
      <ChartContainer config={statusChartConfig} className="h-full w-full">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={statusChartConfig[entry.name as keyof typeof statusChartConfig]?.color || 'hsl(var(--muted))'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
        </PieChart>
      </ChartContainer>
    </div>
  );
};
