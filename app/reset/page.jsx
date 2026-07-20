"use client";

import { Card } from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function ResetPage() {
  const handleReset = () => {
    const ok = confirm("آیا مطمئنی؟ همهٔ اطلاعات حذف می‌شود!");
    if (!ok) return;

    localStorage.removeItem("user_profile");
    localStorage.removeItem("courses");
    localStorage.removeItem("flashcards");
    localStorage.removeItem("review_history");
    localStorage.removeItem("progress");
    localStorage.removeItem("summaries");
    window.location.replace("/setup");
    localStorage.removeItem("notificationsEnabled");
  };

  return (
    <div className="min-h-screen p-10 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="flex flex-row items-center gap-3 mb-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all group-hover:scale-105 bg-red-50 text-[#DC2626]">
            <RotateCcw size={22} />
          </div>

          <h1 className="text-3xl font-medium text-[#DC2626]">
            بازنشانی کامل{" "}
          </h1>
        </div>

        <Card className="p-8 space-y-10 border-slate-600">
          <p className="text-slate-800 leading-relaxed">
            با انجام بازنشانی:
            <br />
            • تمام درس‌ها حذف می‌شوند
            <br />
            • تمام فلش‌کارت‌ها حذف می‌شوند
            <br />
            • اطلاعات کاربری حذف می‌شود
            <br />و دوباره به مرحلهٔ انتخاب رشته هدایت میشوید.
          </p>

          <Button
            variant="danger"
            size="lg"
            className="w-full"
            onClick={handleReset}
          >
            بازنشانی کامل
          </Button>
        </Card>

        <div className="mt-6">
          <Link href="/">
            <Button variant="back" size="lg" className="w-full">
              بازگشت به خانه
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
