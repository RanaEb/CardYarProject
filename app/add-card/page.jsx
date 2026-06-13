"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCourses, addFlashcard } from "@/app/lib/storage";

import UniversalSelect from "@/app/components/ui/UniversalSelect";
import { Card } from "@/app/components/ui/card";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import { BookOpen, PlusCircle, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";

export default function AddCardPage() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [chapterId, setChapterId] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [questionImage, setQuestionImage] = useState(null);
  const [answerImage, setAnswerImage] = useState(null);

  const questionImageInput = useRef(null);
  const answerImageInput = useRef(null);

  useEffect(() => {
    const cs = getCourses();
    setCourses(cs || []);
  }, []);

  const chapters = courseId
    ? courses.find((c) => c.id === courseId)?.chapters || []
    : [];

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleCreate = async () => {
    if (!courseId) return alert("لطفاً ابتدا درس را انتخاب کنید");
    if (!chapterId) return alert("لطفاً ابتدا فصل را انتخاب کنید");
    if (!question.trim() && !questionImage)
      return alert("لطفاً سوال را وارد کنید یا عکس بگذارید");

    const qImg = questionImage ? await toBase64(questionImage) : null;
    const aImg = answerImage ? await toBase64(answerImage) : null;

    const newCard = {
      id: Date.now().toString(),
      courseId,
      chapterId,
      questionText: question,
      answerText: answer,
      questionImage: qImg,
      answerImage: aImg,
      interval: 1,
      nextReview: new Date().toISOString(),
    };

    addFlashcard(newCard);
    router.push(`/courses/${courseId}/chapters/${chapterId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6 mt-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0077C8]">
            <PlusCircle size={26} />
          </div>
          <h1 className="text-2xl font-medium text-[#0077C8]">ساخت فلش‌کارت</h1>
        </div>

        <Card className="p-6 space-y-5 rounded-xl border border-slate-300">
          <UniversalSelect
            placeholder="انتخاب درس..."
            value={courseId}
            onChange={(v) => {
              setCourseId(v);
              setChapterId("");
            }}
            options={courses.map((c) => ({
              value: c.id,
              label: (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#EAF3FF] text-[#0057A3] flex items-center justify-center">
                    <BookOpen size={18} />
                  </div>
                  <span>{c.title}</span>
                </div>
              ),
            }))}
          />

          <UniversalSelect
            placeholder="انتخاب فصل..."
            value={chapterId}
            disabled={!courseId}
            onChange={setChapterId}
            options={chapters.map((ch) => ({
              value: ch.id,
              label: (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0057A3] opacity-70"></div>
                  <span>{ch.title}</span>
                </div>
              ),
            }))}
          />

          {/* فیلد سوال */}
          <div className="relative">
            <Input
              placeholder="متن سوال..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="pl-10"
            />
            <ImageIcon
              className={`absolute left-3 top-3 cursor-pointer ${!courseId || !chapterId ? "text-slate-300 cursor-not-allowed" : "text-slate-400 hover:text-blue-500"}`}
              size={22}
              onClick={() => {
                if (!courseId || !chapterId)
                  return alert("ابتدا درس و فصل را انتخاب کنید");
                questionImageInput.current.click();
              }}
            />
            <input
              type="file"
              accept="image/*"
              ref={questionImageInput}
              className="hidden"
              onChange={(e) => setQuestionImage(e.target.files[0])}
            />
          </div>

          {questionImage && (
            <div className="relative w-32 mt-2">
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

          {/* فیلد جواب */}
          <div className="relative">
            <Input
              placeholder="متن پاسخ..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="pl-10"
            />
            <ImageIcon
              className={`absolute left-3 top-3 cursor-pointer ${!courseId || !chapterId ? "text-slate-300 cursor-not-allowed" : "text-slate-400 hover:text-blue-500"}`}
              size={22}
              onClick={() => {
                if (!courseId || !chapterId)
                  return alert("ابتدا درس و فصل را انتخاب کنید");
                answerImageInput.current.click();
              }}
            />
            <input
              type="file"
              accept="image/*"
              ref={answerImageInput}
              className="hidden"
              onChange={(e) => setAnswerImage(e.target.files[0])}
            />
          </div>

          {answerImage && (
            <div className="relative w-32 mt-2">
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

          <Button variant="primary" className="w-full" onClick={handleCreate}>
            ساخت فلش‌کارت
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
