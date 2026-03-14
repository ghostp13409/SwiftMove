import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOrder = "newest" | "oldest";

interface SortToggleProps {
  order: SortOrder;
  setOrder: (order: SortOrder) => void;
  className?: string;
}

const SortToggle = ({ order, setOrder, className }: SortToggleProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 gap-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground ${className}`}
        >
          <ArrowUpDown className="w-3 h-3" />
          Sort: {order}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-border/50">
        <DropdownMenuItem 
          onClick={() => setOrder("newest")}
          className="text-xs font-bold gap-2 cursor-pointer py-2.5"
        >
          <ArrowDown className="w-3.5 h-3.5 text-primary" />
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setOrder("oldest")}
          className="text-xs font-bold gap-2 cursor-pointer py-2.5"
        >
          <ArrowUp className="w-3.5 h-3.5 text-primary" />
          Oldest First
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortToggle;
