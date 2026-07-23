"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  PlusCircle,
  RotateCcw,
  X,
  Home,
  NotebookText,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({ open, onClose }) {
  const [activeItem, setActiveItem] = useState("/");
  const handleLinkClick = (href) => {
    setActiveItem(href);
    onClose();
  };

  const menuItems = [
    {
      href: "/",
      label: "خانه",
      icon: Home,
      description: "نمای کلی فعالیت‌ها",
      color: "#00AEC2",
    },
    {
      href: "/courses2",
      label: "درس‌ها",
      icon: BookOpen,
      description: "مدیریت لیست درس‌ها",
      color: "#00AEC2",
    },
    {
      href: "/review",
      label: "مرور",
      icon: Brain,
      description: "شروع مرور کارت‌های امروز",
      color: "#00AEC2",
    },
    {
      href: "/add-card",
      label: "ساخت فلش‌کارت",
      icon: PlusCircle,
      description: "افزودن کارت جدید",
      color: "#00AEC2",
    },
    {
      href: "/summaries/add",
      label: "نوشتن خلاصه",
      icon: NotebookText,
      description: "ایجاد خلاصه متنی",
      color: "#00AEC2",
    },
  ];

  return (
    <>
      {/* بک‌دراپ */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      {/* سایدبار */}
      <aside
        dir="rtl"
        className={`
          fixed top-0 right-0 h-full w-72
          bg-[rgba(255,255,255,0.92)] backdrop-blur-xl
          border-l border-white/60
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          z-50 transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-50 rounded-xl p-2
             text-gray-600 hover:text-gray-900
             bg-white/70 hover:bg-white/90
             border border-white/60 shadow-sm
             transition"
          aria-label="بستن سایدبار"
        >
          <X size={20} />
        </button>

        <div className="relative flex h-full flex-col px-5 py-6">
          {/* subtle gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EAF6FF]/60 via-white to-[#F4FEFF]/70 rounded-none" />

          {/* content */}
          <div className="relative z-10 flex h-full flex-col">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-[#E5E7EB]">
                  <Image
                    src="/CardYarLogo2.jpg"
                    alt="CardYar Logo"
                    width={92}
                    height={92}
                    className="object-contain rounded-xl"
                    priority
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-[17px] font-bold text-[#1F2937]">
                  CardYar
                </h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  دستیار هوشمند مرور با فلش‌کارت
                </p>
              </div>
            </div>

            {/* Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className={`
                    group relative flex flex-row items-center justify-between overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium text-[#374151] transition-all duration-200 hover:bg-white/90 hover:shadow-sm
                    ${activeItem === item.href ? "bg-white/90 shadow-sm" : ""} 
                  `}
                >
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all ${
                      activeItem === item.href
                        ? `bg-[${item.color}] opacity-100`
                        : "bg-transparent group-hover:bg-[#0077C8]/70"
                    }`}
                  />

                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105
                        ${
                          activeItem === item.href
                            ? `bg-[#EAF4FF] text-[${item.color}]`
                            : `bg-[#F3F8FC] text-[#0077C8] group-hover:bg-[#EAF4FF]` 
                        }
                      `}
                    >
                      <item.icon size={18} />
                    </span>

                    <div className="flex flex-col items-start text-right">
                      <span
                        className={`text-[#111827] ${activeItem === item.href ? "font-bold" : ""}`}
                      >
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

            {/* bottom */}
            <div className="mt-auto pt-6">
              <Link
                href="/reset"
                onClick={() => handleLinkClick("/reset")}
                className={`
                  group flex flex-row items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    activeItem === "/reset"
                      ? "border border-red-100 bg-red-50 shadow-sm"
                      : "border border-red-100 bg-white/70 hover:bg-red-50 hover:shadow-sm"
                  }
                  text-[#DC2626]
                `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`
                      flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all group-hover:scale-105
                      ${activeItem === "/reset" ? "bg-red-50 text-[#DC2626]" : "bg-red-50 text-[#DC2626]"}
                    `}
                  >
                    <RotateCcw size={18} />
                  </span>

                  <div className="flex flex-col items-start text-right">
                    <span>بازنشانی</span>
                    <span className="text-[11px] text-red-400">
                      پاک کردن اطلاعات اولیه
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
