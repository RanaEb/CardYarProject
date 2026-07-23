import * as React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={
        "flex rounded-2xl border border-slate-300 bg-white px-4 py-3 text-md " +
        "placeholder:text-slate-400 focus:outline-none focus:border-1.5 focus:border-[#0057A3] focus:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-50 transition " +
        "w-full " + 
        className
      }
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
