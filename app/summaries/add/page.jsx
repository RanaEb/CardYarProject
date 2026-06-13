"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourses, addSummary } from "@/app/lib/storage";

import UniversalSelect from "@/app/components/ui/UniversalSelect";
import { Card } from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";
import PersianMarkdownEditor from "@/app/components/PersianMarkdownEditor";

import { BookOpen, NotebookText } from "lucide-react";
import Link from "next/link";

export default function AddSummaryPage() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const cs = getCourses();
    setCourses(cs || []);
  }, []);

  const chapters = courseId
    ? courses.find((c) => c.id === courseId)?.chapters || []
    : [];

  const handleCreate = () => {
    if (!courseId) return alert("درس را انتخاب کن");
    if (!chapterId) return alert("فصل را انتخاب کن");
    if (!content.trim()) return alert("متن خلاصه را بنویس");

    const newSummary = {
      id: Date.now().toString(),
      courseId,
      chapterId,
      content,
      createdAt: new Date().toISOString(),
    };

    addSummary(newSummary);

    router.push(`/courses/${courseId}/chapters/${chapterId}/summary`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0077C8]">
            <NotebookText size={26} />
          </div>

          <h1 className="text-2xl font-medium text-[#0077C8]">
            نوشتن خلاصه
          </h1>
        </div>

        <Card className="p-6 space-y-5 rounded-xl border border-slate-300">

          {/* انتخاب درس */}
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

          {/* انتخاب فصل */}
          <div
            onClick={() => {
              if (!courseId) alert("ابتدا درس را انتخاب کنید");
            }}
            className={!courseId ? "opacity-50 cursor-not-allowed" : ""}
          >
            <UniversalSelect
              placeholder="انتخاب فصل..."
              value={chapterId}
              onChange={setChapterId}
              disabled={!courseId}
              options={chapters.map((ch) => ({
                value: ch.id,
                label: (
                  <div className="flex items-center gap-2">
                    <ChevronRightSmall />
                    <span>{ch.title}</span>
                  </div>
                ),
              }))}
            />
          </div>

          {/* ادیتور خلاصه */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-600">
              متن خلاصه
            </div>

            <PersianMarkdownEditor
              value={content}
              onChange={setContent}
              height={300}
            />
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleCreate}
          >
            ذخیره خلاصه
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

function ChevronRightSmall() {
  return <div className="w-2 h-2 rounded-full bg-[#0057A3] opacity-70"></div>;
}
