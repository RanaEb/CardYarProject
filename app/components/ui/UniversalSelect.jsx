import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function UniversalSelect({
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید...",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full flex items-center justify-between 
          border border-slate-300 rounded-2xl 
          bg-white px-4 py-3 
          text-right text-slate-700
          hover:bg-slate-50
          hover:border-[#0057A3]
          transition shadow-sm
        "
      >
        <span>{selectedLabel || placeholder}</span>

        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
      absolute top-full right-0 left-0 mt-2
      bg-white border border-slate-200
      rounded-2xl shadow-lg z-20
      overflow-y-auto max-h-64 
    "
        >
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="
    w-full flex items-center justify-between
    rounded-xl px-4 py-3 text-right
      hover:bg-[#E5F0FF] transition group
  "
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-slate-800 group-hover:text-[#0057A3] transition">
                  {o.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
