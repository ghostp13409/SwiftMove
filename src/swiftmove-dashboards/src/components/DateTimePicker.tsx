import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateTimePicker({ date, setDate, placeholder = "Pick a date" }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  
  // Hours and minutes
  const [hour, setHour] = React.useState<string>(date ? format(date, "HH") : "12");
  const [minute, setMinute] = React.useState<string>(date ? format(date, "mm") : "00");

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setHour(format(date, "HH"));
      setMinute(format(date, "mm"));
    }
  }, [date]);

  const handleSelectDate = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      const updatedDate = new Date(newDate);
      updatedDate.setHours(parseInt(hour), parseInt(minute));
      setDate(updatedDate);
    } else {
      setDate(undefined);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (type === "hour") setHour(value);
    else setMinute(value);

    if (selectedDate) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(
        type === "hour" ? parseInt(value) : parseInt(hour),
        type === "minute" ? parseInt(value) : parseInt(minute)
      );
      setDate(updatedDate);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-11 rounded-xl bg-secondary/30 px-3 overflow-hidden",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <span className="truncate">
            {date ? format(date, "PPp") : <span>{placeholder}</span>}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          initialFocus
        />
        <div className="p-3 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-50" />
            <span className="text-xs font-medium">Time</span>
          </div>
          <div className="flex items-center gap-1">
            <Select value={hour} onValueChange={(v) => handleTimeChange("hour", v)}>
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs">:</span>
            <Select value={minute} onValueChange={(v) => handleTimeChange("minute", v)}>
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue placeholder="mm" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
