"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFlashcards, getCourses, getSummaries } from "@/app/lib/storage";
import Button from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { Brain, FileText } from "lucide-react";
import FlashcardCourseSelectorModal from "../components/CourseSelectorModal";
import SummaryReviewSelectorModal from "../components/SummaryReviewSelectorModal";

export default function ReviewHome() {
  const [reviewType, setReviewType] = useState(null);
  const [dueCards, setDueCards] = useState([]);
  const [coursesWithDue, setCoursesWithDue] = useState([]);

  const [showFlashcardSelector, setShowFlashcardSelector] = useState(false);
  const [showSummarySelector, setShowSummarySelector] = useState(false);

  const [summaryMessage, setSummaryMessage] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const cards = getFlashcards() || [];
    const courses = getCourses() || [];
    const today = new Date().toISOString().split("T")[0];

    const due = cards.filter(
      (card) => !card.nextReview || card.nextReview.split("T")[0] <= today,
    );

    setDueCards(due);

    const coursesDue = courses
      .map((course) => {
        const count = due.filter(
          (c) => String(c.courseId) === String(course.id),
        ).length;
        return { ...course, dueCount: count };
      })
      .filter((c) => c.dueCount > 0);

    setCoursesWithDue(coursesDue);
  }, []);

  const handleSummaryReview = () => {
    setSummaryMessage(null);

    const summaries = getSummaries() || [];

    if (summaries.length === 0) {
      setSummaryMessage("هیچ خلاصه‌ای ثبت نشده است.");
      return;
    }

    const validSummaries = summaries.filter((s) => s.courseId && s.chapterId);

    if (validSummaries.length === 0) {
      setSummaryMessage(
        "خلاصه‌ها وجود دارند اما به درس یا فصل مشخصی متصل نشده‌اند.",
      );
      return;
    }

    setShowSummarySelector(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        {/* HEADER */}
        <div className="flex flex-row items-center gap-3 mb-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFEFF] text-[#00AEC2]">
            <Brain size={22} />
          </div>

          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-medium tracking-tight text-[#00AEC2]">
              مرور امروز
            </h1>
            <p className="text-sm text-gray-500 mt-3">
              انتخاب کن چه چیزی را می‌خواهی مرور کنی
            </p>
          </div>
        </div>

        {/* SELECTION STEP */}
        {!reviewType && (
          <div className="flex flex-col gap-4">
            {/* FLASHCARD REVIEW */}
            <button
              onClick={() => setReviewType("flashcard")}
              className="bg-white border border-slate-300 rounded-2xl p-6 text-right hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <Brain className="text-[#00AEC2]" size={20} />
                <div className="text-lg font-medium text-gray-900">
                  مرور فلش‌کارت
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                مرور با الگوریتم تکرار فاصله‌دار
              </p>
            </button>

            {/* SUMMARY REVIEW */}
            <button
              onClick={handleSummaryReview}
              className="bg-white border border-slate-300 rounded-2xl p-6 text-right hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-[#22B8A6]" size={20} />
                <div className="text-lg font-medium text-gray-900">
                  مرور خلاصه‌ها
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                انتخاب درس و فصل، سپس نمایش خلاصه‌های مربوطه
              </p>
            </button>

            {/* MESSAGE */}
            {summaryMessage && (
              <div className="bg-[#FEEAEC] border border-[#F5AEB5] text-[#B4232C] font-medium rounded-2xl p-4 text-center text-sm">
                {summaryMessage}
              </div>
            )}

            <Link href="/">
              <Button variant="back" size="lg" className="w-full mt-4">
                بازگشت به خانه
              </Button>
            </Link>
          </div>
        )}

        {/* FLASHCARD REVIEW UI */}
        {reviewType === "flashcard" && (
          <>
            <div className="bg-white border border-slate-300 rounded-2xl p-12 text-center mb-8">
              <p className="text-slate-700 text-sm mb-3">کارت‌های آماده مرور</p>

              <div className="text-8xl font-semibold text-[#00AEC2] tracking-tight mb-4">
                {dueCards.length}
              </div>
            </div>

            {dueCards.length > 0 ? (
              <div className="flex flex-col gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => setShowFlashcardSelector(true)}
                >
                  شروع مرور
                </Button>

                <Button
                  variant="back"
                  size="lg"
                  className="w-full"
                  onClick={() => setReviewType(null)}
                >
                  بازگشت به مرور
                </Button>
              </div>
            ) : (
              <Button
                variant="back"
                size="lg"
                className="w-full"
                onClick={() => setReviewType(null)}
              >
                بازگشت به مرور
              </Button>
            )}
          </>
        )}
      </div>

      {/* FLASHCARD MODAL */}
      {showFlashcardSelector && (
        <FlashcardCourseSelectorModal
          courses={coursesWithDue}
          onClose={() => setShowFlashcardSelector(false)}
        />
      )}

      {/* SUMMARY MODAL */}
      {showSummarySelector && (
        <SummaryReviewSelectorModal
          onClose={() => setShowSummarySelector(false)}
        />
      )}
    </div>
  );
}
