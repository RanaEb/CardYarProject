"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/ui/button";
import { getSummaries, getCourses } from "@/app/lib/storage";

export default function SummariesReviewPage() {
  const [summaries, setSummaries] = useState([]);
  const [courses, setCourses] = useState([]);
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");

  useEffect(() => {
    setSummaries(getSummaries() || []);
    setCourses(getCourses() || []);
  }, []);

  const selectedCourse = useMemo(() => {
    return courses.find((c) => String(c.id) === String(courseId));
  }, [courses, courseId]);

  const selectedChapter = useMemo(() => {
    if (!selectedCourse?.chapters || !chapterId) return null;
    return selectedCourse.chapters.find(
      (ch) => String(ch.id) === String(chapterId),
    );
  }, [selectedCourse, chapterId]);

  const filteredSummaries = useMemo(() => {
    return summaries.filter((s) => {
      const sameCourse = String(s.courseId) === String(courseId);
      const sameChapter = String(s.chapterId) === String(chapterId);
      return sameCourse && sameChapter;
    });
  }, [summaries, courseId, chapterId]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6FBF8] text-[#22B8A6]">
            <FileText size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-medium tracking-tight text-[#22B8A6]">
              مرور خلاصه‌ها
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              {selectedCourse?.title || "درس نامشخص"}
              {" - "}
              {selectedChapter?.title || "فصل نامشخص"}
            </p>
          </div>
        </div>

        {/* Content */}
        {!courseId || !chapterId ? (
          <div className="bg-[#FEEAEC] border border-[#F5AEB5] rounded-2xl p-10 text-center">
            <p className="text-[#B4232C] mb-2">
              درس یا فصل برای مرور مشخص نشده است
            </p>
            <p className="text-sm text-[#B4232C] mb-6 opacity-80">
              لطفاً دوباره از صفحه مرور، درس و فصل را انتخاب کن
            </p>

            <Link href="/review">
              <Button variant="back" size="lg">
                بازگشت
              </Button>
            </Link>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <div className="bg-white border border-slate-300 rounded-2xl p-10 text-center">
            <p className="text-gray-700 mb-2">
              برای این درس و فصل خلاصه‌ای پیدا نشد
            </p>
            <p className="text-sm text-gray-500 mb-6">
              خلاصه‌ای برای{" "}
              <span className="font-medium">
                {selectedCourse?.title || "درس نامشخص"}
              </span>
              {" / "}
              <span className="font-medium">
                {selectedChapter?.title || "فصل نامشخص"}
              </span>{" "}
              ثبت نشده است
            </p>

            <Link href="/review">
              <Button variant="back" size="lg">
                بازگشت
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSummaries.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-slate-300 rounded-2xl p-5"
              >
                <p className="text-sm text-[#22B8A6] mb-2">
                  {selectedCourse?.title || "درس نامشخص"} -{" "}
                  {selectedChapter?.title || "فصل نامشخص"}
                </p>

                <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">
                  {s.content}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/review">
            <Button variant="back" size="lg" className="w-full">
              بازگشت به انتخاب مرور
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
