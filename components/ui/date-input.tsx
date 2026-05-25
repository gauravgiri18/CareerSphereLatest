"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="text-white/60 text-xs mb-1.5 block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none z-10" />
          <input
            type="date"
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border border-white/20 bg-white/5 pl-10 pr-3 py-2 text-sm text-white",
              "[color-scheme:dark]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput };
