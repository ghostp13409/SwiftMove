import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themes = [
  { name: "Zinc", value: "zinc", color: "bg-zinc-500" },
  { name: "Slate", value: "slate", color: "bg-slate-500" },
  { name: "Stone", value: "stone", color: "bg-stone-500" },
  { name: "Cream", value: "cream", color: "bg-orange-100" },
];

const colors = [
  { name: "Emerald", value: "emerald", color: "bg-emerald-600" },
  { name: "Blue", value: "blue", color: "bg-blue-600" },
  { name: "Violet", value: "violet", color: "bg-violet-600" },
  { name: "Orange", value: "orange", color: "bg-orange-600" },
  { name: "Rose", value: "rose", color: "bg-rose-600" },
];

const ThemeSettings = () => {
  const [profile, setProfileState] = useState("zinc");
  const [primary, setPrimaryState] = useState("emerald");

  useEffect(() => {
    const savedProfile = localStorage.getItem("theme-profile") || "zinc";
    const savedColor = localStorage.getItem("theme-color") || "emerald";
    setProfileState(savedProfile);
    setPrimaryState(savedColor);
    document.documentElement.setAttribute("data-theme", savedProfile);
    document.documentElement.setAttribute("data-color", savedColor);
  }, []);

  const updateTheme = (p: string) => {
    setProfileState(p);
    localStorage.setItem("theme-profile", p);
    document.documentElement.setAttribute("data-theme", p);
  };

  const updateColor = (c: string) => {
    setPrimaryState(c);
    localStorage.setItem("theme-color", c);
    document.documentElement.setAttribute("data-color", c);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl">
          <Palette className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-4 rounded-2xl border-border/50 shadow-xl space-y-4">
        <div className="space-y-2">
          <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground p-0 ml-1">
            Base
          </DropdownMenuLabel>
          <div className="flex items-center gap-2 px-1">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => updateTheme(t.value)}
                title={t.name}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95",
                  t.color,
                  profile === t.value ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground p-0 ml-1">
            Accent
          </DropdownMenuLabel>
          <div className="flex flex-wrap items-center gap-2 px-1">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => updateColor(c.value)}
                title={c.name}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95",
                  c.color,
                  primary === c.value ? "border-foreground ring-2 ring-primary/20" : "border-transparent"
                )}
              />
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSettings;
