"use client";

import { useEffect, useState } from "react";
import {
  getUserProfile,
  getCourses,
  getFlashcards,
  getSummaries,
} from "@/app/lib/storage";
import Link from "next/link";
import Button from "@/app/components/ui/button";
import { BookOpen, Brain, Layers, FileText, NotebookText } from "lucide-react";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    courses: 0,
    flashcards: 0,
    dueToday: 0,
    summaries: 0,
  });

  useEffect(() => {
    const saved = getUserProfile();

    if (!saved) {
      window.location.replace("/setup");
      return;
    }

    setProfile(saved);

    const courses = getCourses() || [];
    const flashcards = getFlashcards() || [];
    const summaries = getSummaries() || [];

    const today = new Date().toISOString().split("T")[0];

    const dueCards = flashcards.filter(
      (card) => card.nextReview && card.nextReview.split("T")[0] <= today,
    );

    setStats({
      courses: courses.length,
      flashcards: flashcards.length,
      dueToday: dueCards.length,
      summaries: summaries.length,
    });
  }, []);

  if (!profile) return null;

  return (
    <div className="min-h-screen flex bg-slate-100 relative">
      <main dir="rtl" className="flex-1 p-12 pt-20">
        <div className="max-w-6xl mx-auto text-right">
          {/* Header */}
          <div className="mb-10 rounded-[24px] border border-[#BFD8F8] bg-[#FCFEFF] px-6 py-5">
            <h1 className="text-3xl font-bold text-[#111827] tracking-tight">
              سلام {profile.userName} 👋
            </h1>

            <p className="mt-4 text-sm text-[#6B7280]">
              {profile.degree === "karshenasi" ? "کارشناسی" : ""}{" "}
              {profile.major}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Flashcards */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#BFD8F8] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-row-reverse items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#6B7280]">فلش‌کارت‌ها</p>
                  <p className="text-center mt-2 text-3xl font-bold text-[#34A38A]">
                    {stats.flashcards}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F6F3] text-[#34A38A]">
                  <Layers size={22} />
                </div>
              </div>
            </div>
            {/* Due Today */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#BFD8F8] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-row-reverse items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#6B7280]">مرور امروز</p>
                  <p className="text-center mt-2 text-3xl font-bold text-[#00AEC2]">
                    {stats.dueToday}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFEFF] text-[#00AEC2]">
                  <Brain size={22} />
                </div>
              </div>
            </div>
            {/* Courses */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#BFD8F8] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-row-reverse items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#6B7280]">درس‌ها</p>
                  <p className="text-center mt-2 text-3xl font-bold text-[#0077C8]">
                    {stats.courses}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0077C8]">
                  <BookOpen size={22} />
                </div>
              </div>
            </div>

            {/* Summaries */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#BFD8F8] bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-row-reverse items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#6B7280]">خلاصه‌ها</p>
                  <p className="text-center mt-2 text-3xl font-bold text-[#7C3AED]">
                    {stats.summaries}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E8FF] text-[#7C3AED]">
                  <NotebookText size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-[#EAF6FF] to-[#E8FCFF] p-6 md:p-8 shadow-sm">
            {/* در حالت موبایل ستونی است، در دسکتاپ ردیفی معکوس */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-5">
              {/* دکمه - در موبایل زیر قرار می‌گیرد (order-2)، در دسکتاپ در جایگاه خود می‌ماند */}
              <div className="w-full flex justify-end md:justify-end order-2 md:order-1">
                <Link href="/review">
                  <Button variant="secondary" size="lg">
                    شروع مرور
                  </Button>
                </Link>
              </div>

              {/* متن - در موبایل بالا قرار می‌گیرد (order-1)، در دسکتاپ در جایگاه خود می‌ماند */}
              <div className="w-full text-right order-1 md:order-2">
                <h2 className="text-xl font-semibold text-[#111827]">
                  امروز آماده‌ای برای پیشرفت؟
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#6B7280] md:max-w-xl">
                  فقط چند دقیقه مرور منظم می‌تواند یادگیریت را ماندگارتر و
                  مؤثرتر کند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
