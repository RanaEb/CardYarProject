"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseSelectorModal({
  courses = [],
  onClose = () => {},
}) {
  const [openCourse, setOpenCourse] = useState(false);
  const [openChapter, setOpenChapter] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const router = useRouter();
  const flashcards =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("flashcards") || "[]")
      : [];

  const handleSelectChapter = (courseId, chapterId) => {
    router.push(`/review/${courseId}?chapter=${chapterId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md p-8 relative">
        <h2 className="text-lg font-semibold text-center text-gray-900 mb-6">
          انتخاب درس و فصل
        </h2>

        <div className="space-y-5 mb-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenCourse(!openCourse)}
              className="w-full h-12 rounded-2xl border border-slate-300 bg-white px-4 flex items-center justify-between text-sm text-slate-700 hover:border-[#0057A3] hover:bg-slate-50 transition"
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
              <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-20">
                <div className="max-h-72 overflow-y-auto p-2">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpenCourse(false);
                        setOpenChapter(false);
                      }}
                      className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-right hover:bg-[#F5F9FF] transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-[#EAF3FF] text-[#0057A3] flex items-center justify-center">
                          <BookOpen size={18} />
                        </div>

                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-slate-800 group-hover:text-[#0057A3] transition">
                            {course.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            آماده برای مرور
                          </span>
                        </div>
                      </div>

                      <div className="min-w-[36px] h-8 px-2 rounded-full bg-[#ECFEFF] text-[#00AEC2] text-xs font-semibold flex items-center justify-center">
                        {course.dueCount} کارت
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              disabled={!selectedCourse}
              onClick={() => selectedCourse && setOpenChapter(!openChapter)}
              className={`w-full h-12 rounded-2xl border bg-white px-4 flex items-center justify-between text-sm transition
                ${
                  selectedCourse
                    ? "border-slate-300 text-slate-700 hover:border-[#0057A3] hover:bg-slate-50"
                    : "border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50"
                }
              `}
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
              <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-20">
                <div className="max-h-60 overflow-y-auto p-2">
                  {selectedCourse.chapters?.map((ch) => {
                    const cardCount = flashcards.filter(
                      (fc) =>
                        String(fc.courseId) === String(selectedCourse.id) &&
                        String(fc.chapterId) === String(ch.id) &&
                        fc.isDefault !== true,
                    ).length;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() =>
                          handleSelectChapter(selectedCourse.id, ch.id)
                        }
                        className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-right hover:bg-[#F5F9FF] transition group"
                      >
                        <span className="text-sm font-medium text-slate-800 group-hover:text-[#0057A3] transition">
                          {ch.title}
                        </span>

                        <div className="min-w-[36px] h-8 px-2 rounded-full bg-[#ECFEFF] text-[#00AEC2] text-xs font-semibold flex items-center justify-center">
                          {cardCount} کارت
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="w-full h-12 rounded-2xl text-[#0057A3] border border-[#BFD8F8] hover:bg-[#EAF3FF] transition"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </div>
  );
}
