import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Mapping your move...",
  "Herding the fleet...",
  "Checking vehicle capacity...",
  "Calculating the best routes...",
  "Securing your items...",
  "Gathering moving quotes...",
];

const LoadingDelight = ({ label }: { label?: string }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <Loader2 className="w-8 h-8 animate-spin text-primary relative z-10" />
      </div>
      <p className="mt-6 text-sm font-medium text-foreground tracking-tight animate-slide-up">
        {label || MESSAGES[index]}
      </p>
      <div className="mt-2 flex gap-1">
        <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" />
      </div>
    </div>
  );
};

export default LoadingDelight;
