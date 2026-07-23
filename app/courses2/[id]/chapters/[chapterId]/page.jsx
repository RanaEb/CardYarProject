"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getCourses,
  getFlashcardsByCourse,
  addFlashcard,
  deleteFlashcard,
} from "@/app/lib/storage";
import { Card } from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import {
  Layers,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  X,
} from "lucide-react";
export default function CourseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = params.courseId || params.id;
  const chapterId = params.chapterId || searchParams.get("chapter") || null;
  const [course, setCourse] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const [questionImage, setQuestionImage] = useState(null);
  const [answerImage, setAnswerImage] = useState(null);

  const questionImageInputRef = useRef(null);
  const answerImageInputRef = useRef(null);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    const courses = getCourses();
    const found = courses.find((c) => String(c.id) === String(courseId));

    if (!found) {
      alert("درس پیدا نشد");
      router.push("/courses");
      return;
    }

    setCourse(found);

    if (chapterId && found.chapters) {
      const ch = found.chapters.find((x) => String(x.id) === String(chapterId));
      setChapter(ch || null);
    }

    const cards = getFlashcardsByCourse(courseId, chapterId);
    setFlashcards(cards);
  }, [courseId, chapterId, router]);

  const handleAddFlashcard = async () => {
    if (!newQuestion.trim() && !questionImage) {
      alert("سؤال یا عکس باید وارد شود");
      return;
    }

    const qImg = questionImage ? await toBase64(questionImage) : null;
    const aImg = answerImage ? await toBase64(answerImage) : null;

    const card = {
      id: Date.now().toString(),
      courseId,
      chapterId: chapterId || null,

      questionText: newQuestion.trim(),
      answerText: newAnswer.trim(),

      questionImage: qImg,
      answerImage: aImg,

      repetition: 0,
      interval: 1,
      easeFactor: 2.5,

      nextReview: new Date().toISOString(),
      lastReviewed: null,

      isDefault: false,
    };

    addFlashcard(card);
    setFlashcards((prev) => [...prev, card]);

    setNewQuestion("");
    setNewAnswer("");
    setQuestionImage(null);
    setAnswerImage(null);
  };


  const handleDeleteFlashcard = (cardId) => {
    if (!confirm("آیا این فلش‌کارت حذف شود؟")) return;

    deleteFlashcard(cardId);
    const updated = getFlashcardsByCourse(courseId, chapterId);
    setFlashcards(updated);
  };

  if (!course) return null;

  const today = new Date().toDateString();

  const dueToday = flashcards.filter(
    (fc) =>
      !fc.isDefault &&
      fc.createdAt &&
      new Date(fc.createdAt).toDateString() === today,
  );
  const courseTitle = course?.title || "بدون عنوان";
  const reviewCards = flashcards.filter((c) => !c.isDefault);
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* هدر */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center font-medium md:justify-between gap-3 text-2xl mt-12">
            <div className="flex items-center gap-2 text-[#34A38A]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F6F3]">
                <Layers size={18} />
              </div>
              <span>مدیریت فلش‌کارت‌های درس</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="rounded-xl bg-white px-3 py-2 border border-slate-200">
                {flashcards.length} فلش‌کارت
              </span>
              <span className="rounded-xl bg-[#E6F6F3] px-3 py-2 text-[#1D7361] border border-[#C7E8DF]">
                {dueToday.length} کارت امروز
              </span>
            </div>
          </div>

          {/* عنوان + فصل (ریسپانسیو اصلاح‌شده برای موبایل؛ دسکتاپ حفظ شده) */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 rounded-2xl bg-white px-3 py-4 border border-slate-300 text-sm text-slate-500 mb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#34A38A]" />
              <span>درس انتخاب‌شده:</span>
            </div>
            <span className="text-lg font-medium text-[#0A2142]">
              {courseTitle}
              {chapter && (
                <span className="text-sm text-slate-500">
                  {" "}
                  – فصل {chapter.title}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* دو ستون */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* فرم افزودن کارت */}
          <Card className="p-5 border-slate-200 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F8FC] text-[#0077C8]">
                <PlusCircle size={18} />
              </span>
              <span className="text-base font-semibold text-[#0077C8]">
                افزودن فلش‌کارت جدید
              </span>
            </div>

            {/* ==== سؤال ==== */}
            <div className="relative mt-3">
              <label className="text-sm text-slate-700 mb-2 block">سؤال</label>

              <Input
                placeholder="متن سؤال..."
                className="pl-10"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />

              {/* آیکون عکس */}
              <ImageIcon
                className="absolute left-3 top-[42px] text-slate-400 cursor-pointer hover:text-blue-500"
                size={22}
                onClick={() => questionImageInputRef.current.click()}
              />

              <input
                type="file"
                accept="image/*"
                ref={questionImageInputRef}
                className="hidden"
                onChange={(e) => setQuestionImage(e.target.files[0])}
              />

              {questionImage && (
                <div className="relative w-32 mt-3">
                  <img
                    src={URL.createObjectURL(questionImage)}
                    className="w-full rounded-lg border border-slate-400"
                  />
                  <button
                    onClick={() => setQuestionImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* ==== پاسخ ==== */}
            <div className="relative mt-4">
              <label className="text-sm text-slate-700 mb-2 block">پاسخ</label>

              <Input
                placeholder="متن پاسخ..."
                className="pl-10"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />

              <ImageIcon
                className="absolute left-3 top-[42px] text-slate-400 cursor-pointer hover:text-blue-500"
                size={22}
                onClick={() => answerImageInputRef.current.click()}
              />

              <input
                type="file"
                accept="image/*"
                ref={answerImageInputRef}
                className="hidden"
                onChange={(e) => setAnswerImage(e.target.files[0])}
              />

              {answerImage && (
                <div className="relative w-32 mt-3">
                  <img
                    src={URL.createObjectURL(answerImage)}
                    className="w-full rounded-lg border border-slate-400"
                  />
                  <button
                    onClick={() => setAnswerImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleAddFlashcard}
              className="w-full mt-4"
            >
              ذخیره فلش‌کارت
            </Button>
          </Card>

          {/* ===== لیست کارت‌ها ===== */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <span className="text-base font-semibold text-[#0077C8]">
              فلش‌کارت‌ها
            </span>

            <div className="mt-4 space-y-3 max-h-[290px] overflow-y-auto">
              {flashcards.length > 0 ? (
                flashcards.map((card) => (
                  <Card
                    key={card.id}
                    className="p-4 flex gap-3 border-slate-200 bg-white hover:border-blue-400 transition"
                  >
                    <div className="flex-1 flex flex-col gap-4">
                      {/* سوال */}
                      <div>
                        {card.isDefault && (
                          <span className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md mb-2">
                            پیش‌فرض
                          </span>
                        )}

                        <div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            سؤال :
                          </span>
                        </div>

                        {card.questionImage && (
                          <img
                            src={card.questionImage}
                            className="w-48 object-cover rounded-lg border border-slate-400 mt-2"
                          />
                        )}

                        {card.questionText && (
                          <div className="font-medium text-sm text-[#0A2142] mt-2 whitespace-pre-wrap">
                            {card.questionText}
                          </div>
                        )}
                      </div>

                      {/* پاسخ */}
                      <div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          پاسخ :
                        </span>

                        {card.answerImage && (
                          <img
                            src={card.answerImage}
                            className="w-48 object-cover rounded-lg border border-slate-400 mt-2"
                          />
                        )}

                        {card.answerText && (
                          <div className="font-medium text-sm text-[#0A2142] mt-2 whitespace-pre-wrap">
                            {card.answerText}
                          </div>
                        )}
                      </div>
                    </div>

                    <Trash2
                      size={18}
                      className="text-slate-300 cursor-pointer hover:text-red-500 mt-1"
                      onClick={() => handleDeleteFlashcard(card.id)}
                    />
                  </Card>
                ))
              ) : (
                <Card className="p-4 border-dashed border-slate-200 bg-white/60">
                  <p className="text-slate-500 text-sm">
                    هنوز فلش‌کارتی ساخته نشده.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* پایین صفحه */}
        <div className="flex flex-row gap-4 items-center justify-between pt-4 border-t border-slate-200">
          <Link href="/courses2" className="w-full md:w-auto">
            <Button variant="back" size="lg">
              بازگشت
            </Button>
          </Link>

          {reviewCards.length > 0 && (
            <Link
              href={`/review/${courseId}${
                chapterId ? `?chapter=${chapterId}` : ""
              }`}
            >
              <Button variant="secondary" size="lg">
                شروع مرور
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
