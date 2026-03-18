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
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  trigger?: React.ReactNode;
}

export function DateTimePicker({ date, setDate, placeholder = "Pick a date", trigger }: DateTimePickerProps) {

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  
  // Hours (1-12), minutes, and period (AM/PM)
  const [hour12, setHour12] = React.useState<string>(date ? format(date, "h") : "12");
  const [minute, setMinute] = React.useState<string>(date ? format(date, "mm") : "00");
  const [period, setPeriod] = React.useState<string>(date ? format(date, "aa") : "AM");

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setHour12(format(date, "h"));
      setMinute(format(date, "mm"));
      setPeriod(format(date, "aa"));
    }
  }, [date]);

  const handleSelectDate = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      const updatedDate = new Date(newDate);
      const hours24 = calculate24Hour(hour12, period);
      updatedDate.setHours(hours24, parseInt(minute));
      setDate(updatedDate);
    } else {
      setDate(undefined);
    }
  };

  const calculate24Hour = (h12: string, p: string) => {
    let h = parseInt(h12);
    if (p === "PM" && h < 12) h += 12;
    if (p === "AM" && h === 12) h = 0;
    return h;
  };

  const handleTimeChange = (type: "hour" | "minute" | "period", value: string) => {
    let newHour12 = hour12;
    let newMinute = minute;
    let newPeriod = period;

    if (type === "hour") {
      setHour12(value);
      newHour12 = value;
    } else if (type === "minute") {
      setMinute(value);
      newMinute = value;
    } else {
      setPeriod(value);
      newPeriod = value;
    }

    if (selectedDate) {
      const updatedDate = new Date(selectedDate);
      const hours24 = calculate24Hour(newHour12, newPeriod);
      updatedDate.setHours(hours24, parseInt(newMinute));
      setDate(updatedDate);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
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
        )}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          disabled={{ before: new Date() }}
          initialFocus
        />
        <div className="p-3 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-50" />
            <span className="text-xs font-medium">Time</span>
          </div>
          <div className="flex items-center gap-1">
            <Select value={hour12} onValueChange={(v) => handleTimeChange("hour", v)}>
              <SelectTrigger className="h-8 w-[55px] text-xs">
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
              <SelectTrigger className="h-8 w-[60px] text-xs">
                <SelectValue placeholder="mm" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={(v) => handleTimeChange("period", v)}>
              <SelectTrigger className="h-8 w-[65px] text-xs">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

