"use client";

import { useMemo, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSummaries, getCourses } from "@/app/lib/storage";

export default function SummaryReviewSelectorModal({ onClose = () => {} }) {
  const [openCourse, setOpenCourse] = useState(false);
  const [openChapter, setOpenChapter] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const router = useRouter();

  const summaries =
    typeof window !== "undefined" ? getSummaries() || [] : [];

  const courses =
    typeof window !== "undefined" ? getCourses() || [] : [];

  const coursesWithSummaries = useMemo(() => {
    return courses
      .map((course) => {
        const count = summaries.filter(
          (s) => String(s.courseId) === String(course.id),
        ).length;

        return { ...course, summaryCount: count };
      })
      .filter((course) => course.summaryCount > 0);
  }, [courses, summaries]);

  const getChapterSummaryCount = (chapterId) => {
    return summaries.filter(
      (s) =>
        String(s.courseId) === String(selectedCourse?.id) &&
        String(s.chapterId) === String(chapterId),
    ).length;
  };

  const handleSelectChapter = (courseId, chapterId) => {
    router.push(
      `/summaries/review?courseId=${courseId}&chapterId=${chapterId}`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-300 bg-white p-8">
        <h2 className="mb-6 text-center text-lg font-semibold text-gray-900">
          انتخاب درس و فصل خلاصه‌ها
        </h2>

        <div className="mb-6 space-y-5">
          {/* انتخاب درس */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenCourse((prev) => !prev);
                setOpenChapter(false);
              }}
              className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-700 transition hover:border-[#22B8A6] hover:bg-slate-50"
            >
              <span>
                {selectedCourse ? selectedCourse.title : "انتخاب درس…"}
              </span>

              <ChevronDown
                size={18}
                className={`transition-transform ${openCourse ? "rotate-180" : ""}`}
              />
            </button>

            {openCourse && (
              <div className="absolute right-0 left-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="max-h-72 overflow-y-auto p-2">
                  {coursesWithSummaries.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500 text-center">
                      درسی با خلاصه موجود نیست
                    </div>
                  ) : (
                    coursesWithSummaries.map((course) => (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => {
                          setSelectedCourse(course);
                          setOpenCourse(false);
                          setOpenChapter(false);
                        }}
                        className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-right transition hover:bg-[#F5F9FF]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6FBF8] text-[#22B8A6]">
                            <FileText size={18} />
                          </div>

                          <span className="text-sm font-medium text-slate-800 transition group-hover:text-[#22B8A6]">
                            {course.title}
                          </span>
                        </div>

                        {/* باکس تعداد خلاصه‌ها */}
                        <span className="rounded-xl bg-[#E6FBF8] px-3 py-1 text-xs font-medium text-[#22B8A6]">
                          {course.summaryCount} خلاصه
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* انتخاب فصل */}
          <div className="relative">
            <button
              type="button"
              disabled={!selectedCourse}
              onClick={() => {
                if (selectedCourse) {
                  setOpenChapter((prev) => !prev);
                  setOpenCourse(false);
                }
              }}
              className={`flex h-12 w-full items-center justify-between rounded-2xl border bg-white px-4 text-sm transition ${
                selectedCourse
                  ? "border-slate-300 text-slate-700 hover:border-[#22B8A6] hover:bg-slate-50"
                  : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <span>
                {selectedCourse ? "انتخاب فصل…" : "ابتدا درس را انتخاب کنید"}
              </span>

              <ChevronDown
                size={18}
                className={`transition-transform ${openChapter ? "rotate-180" : ""}`}
              />
            </button>

            {openChapter && selectedCourse && (
              <div className="absolute right-0 left-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="max-h-60 overflow-y-auto p-2">
                  {selectedCourse?.chapters?.length === 0 ? (
                    <div className="px-4 py-3 text-center text-sm text-slate-500">
                      برای این درس فصلی ثبت نشده
                    </div>
                  ) : (
                    selectedCourse.chapters.map((chapter) => {
                      const summaryCount = getChapterSummaryCount(chapter.id);

                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() =>
                            handleSelectChapter(
                              selectedCourse.id,
                              chapter.id,
                            )
                          }
                          className="group flex w-full items-center justify-between rounded-xl px-4 py-3 text-right transition hover:bg-[#F5F9FF]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6FBF8] text-[#22B8A6]">
                              <FileText size={18} />
                            </div>

                            <span className="text-sm font-medium text-slate-800 transition group-hover:text-[#22B8A6]">
                              {chapter.title}
                            </span>
                          </div>

                          {/* باکس تعداد خلاصه‌های فصل */}
                          <span className="rounded-xl bg-[#E6FBF8] px-3 py-1 text-xs font-medium text-[#22B8A6]">
                            {summaryCount} خلاصه
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="h-12 w-full rounded-2xl border border-[#B4F2E5] text-[#22B8A6] transition hover:bg-[#E6FBF8]"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </div>
  );
}
