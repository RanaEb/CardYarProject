import React from "react";
import { cn } from "@/app/lib/utils";

const variants = {
  primary:
    "bg-[#0077C8] text-white hover:bg-[#006BB4] shadow-sm hover:shadow-md",
  secondary:
    "bg-[#009FB2] text-white hover:bg-[#008C9D] shadow-sm hover:shadow-md",

  outline:
    "border border-[#0057A3] bg-white/80 text-[#0057A3] hover:bg-[#EAF4FF]",
  ghost: "text-[#0057A3] border border-[#BFD8F8] hover:bg-[#EAF3FF]",
  danger:
    "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm hover:shadow-md",
  back: "bg-[#D9E8FF] text-[#0057A3] hover:bg-[#C5D9F5] transition-colors",
};

const sizes = {
  sm: "h-9 px-3 text-sm rounded-xl",
  md: "py-3 px-5 text-sm rounded-2xl",
  lg: "h-12 px-6 text-base rounded-2xl",
  icon: "h-10 w-10 rounded-xl",
};

export default function Button({
  className,
  children,
  variant = "",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-tight transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#0077C8]/20",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
