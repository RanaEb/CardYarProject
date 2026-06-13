"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getFlashcardsByCourse,
  saveFlashcards,
  getFlashcards,
  updateCardReview,
  getCourses,
} from "@/app/lib/storage";
import Flashcard from "@/app/components/Flashcard";
import Button from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, LayoutGrid } from "lucide-react";

export default function ReviewPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courseName, setCourseName] = useState("");
  const [chapterName, setChapterName] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const all = getFlashcardsByCourse(courseId);
    const today = new Date().toISOString().split("T")[0];

    const due = all.filter(
      (card) => !card.nextReview || card.nextReview.split("T")[0] <= today,
    );

    setCards(due);

    const courses = getCourses() || [];
    const course = courses.find((c) => String(c.id) === String(courseId));

    if (course) {
      setCourseName(course?.name?.title || course?.title || "");
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId || cards.length === 0 || !cards[currentIndex]) {
      setChapterName("");
      return;
    }

    const currentCard = cards[currentIndex];
    const courses = getCourses() || [];
    const course = courses.find((c) => String(c.id) === String(courseId));

    if (!course || !course.chapters || !currentCard.chapterId) {
      setChapterName("");
      return;
    }

    const chapter = course.chapters.find(
      (ch) => String(ch.id) === String(currentCard.chapterId),
    );

    setChapterName(chapter?.title || "");
  }, [courseId, cards, currentIndex]);

  const handleAnswer = (isSuccess) => {
    const card = cards[currentIndex];
    const updatedCard = updateCardReview(card, isSuccess);

    const allCards = getFlashcards().map((c) =>
      c.id === card.id ? updatedCard : c,
    );

    saveFlashcards(allCards);
    setCurrentIndex((prev) => prev + 1);
  };

  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;

  if (cards.length === 0 || currentIndex >= cards.length) {
    const isFinished = currentIndex >= cards.length && cards.length > 0;

    return (
      <div className="max-w-xl mx-auto p-8 mt-10">
        <div className="bg-white border border-[#BFD8F8] rounded-[24px] p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#EAF3FF] text-[#0057A3] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LayoutGrid size={32} />
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {isFinished ? "مرور تمام شد!" : "کارتی برای مرور نیست"}
          </h2>

          <p className="text-slate-500 mb-8">
            {isFinished
              ? "همه کارت‌های این درس را مرور کردی."
              : "فعلاً همه چیز به‌روز است."}
          </p>

          <Button
            variant="back"
            size="lg"
            className="w-full"
            onClick={() => router.push("/review")}
          >
            بازگشت به مرور
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-20 p-8 space-y-6">
      <div className="flex items-center justify-between bg-white border border-[#BFD8F8] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#D9E8FF] text-[#0057A3] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0057A3] rounded-full animate-pulse" />
            {courseName}
            {chapterName ? ` - ${chapterName}` : ""}
          </div>
        </div>

        <div className="text-sm font-medium text-[#0057A3] bg-[#F5F9FF] px-3 py-1 rounded-lg border border-[#E0EDFF]">
          {currentIndex + 1} از {cards.length}
        </div>
      </div>

      <div className="px-2">
        <div className="w-full h-1.5 bg-[#EAF3FF] rounded-full overflow-hidden border border-[#D9E8FF]">
          <div
            className="h-full bg-[#0057A3] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Flashcard card={cards[currentIndex]} onAnswer={handleAnswer} />

      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 text-sm font-bold text-[#0057A3] disabled:text-slate-300 transition-colors"
        >
          <ChevronRight size={18} />
          قبلی
        </button>

        <button
          onClick={() => setCurrentIndex((i) => i + 1)}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-1 text-sm font-bold text-[#0057A3] disabled:text-slate-300 transition-colors"
        >
          بعدی
          <ChevronLeft size={18} />
        </button>
      </div>

      <Button
        variant="back"
        size="lg"
        className="w-full"
        onClick={() => router.push("/review")}
      >
        بازگشت به مرور
      </Button>
    </div>
  );
}
