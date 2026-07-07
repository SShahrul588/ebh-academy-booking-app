import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-2xl border border-navy-700/10 bg-white px-4 text-sm font-medium outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15",
        className
      )}
      {...props}
    />
  );
}
