"use client";

import "./globals.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { Menu } from "lucide-react";
import RegisterSW from "@/app/components/RegisterSW";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const hideSidebar = pathname === "/setup";

  return (
    <html lang="fa" dir="rtl">
      <body>
        {!hideSidebar && (
          <>
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-md"
            >
              <Menu size={24} />
            </button>

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </>
        )}

        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
