import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-paper border border-rule-soft rounded-card",
        hover &&
          "transition-[transform,box-shadow] duration-fast ease-dorza hover:-translate-y-px hover:shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
