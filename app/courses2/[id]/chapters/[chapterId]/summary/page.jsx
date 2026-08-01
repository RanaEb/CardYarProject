"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getSummary, deleteSummary } from "@/app/lib/storage";
import { Card } from "@/app/components/ui/card";
import Button from "@/app/components/ui/button";
import {
  NotebookText,
  Edit3,
  ArrowRight,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function SummaryPage() {
  const router = useRouter();
  const { id: courseId, chapterId } = useParams();

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const s = getSummary(courseId, chapterId);
    setSummary(s);
  }, [courseId, chapterId]);
  const handleDelete = () => {
    const confirmDelete = window.confirm("آیا از حذف این خلاصه مطمئن هستید؟");

    if (!confirmDelete) return;

    deleteSummary(courseId, chapterId);
    router.push(`/courses2`);
  };
  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <Card className="p-10 border border-slate-300 flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-[#EAF4FF] text-[#0077C8] flex items-center justify-center mb-4">
              <NotebookText size={32} />
            </div>
            <h2 className="text-xl font-medium text-slate-800 mb-2">
              هنوز خلاصه‌ای ثبت نشده
            </h2>
            <p className="text-slate-500 mb-6 text-sm">
              برای این فصل هنوز متنی به عنوان خلاصه یادداشت نکرده‌اید.
            </p>
            <div className="flex flex-col gap-4">
              <Button
                variant="primary"
                size="lg"
                className="px-8 flex items-center gap-2"
                onClick={() =>
                  router.push(
                    `/courses2/${courseId}/chapters/${chapterId}/summary/edit`,
                  )
                }
              >
                <PlusCircle size={18} />
                <span>ایجاد اولین خلاصه</span>
              </Button>
              <Link href="/courses2" className="w-full md:w-auto">
                <Button variant="back" size="lg">
                  بازگشت به لیست درس‌ها
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 mt-12">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0077C8]">
              <NotebookText size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-[#0077C8]">خلاصه فصل</h1>
              <p className="text-xs text-slate-500 mt-1">
                مرور و مطالعه نکات مهم
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <Card className="p-8 border border-[#0057A3] bg-white min-h-[400px]">
          <div
            className="prose prose-slate max-w-none 
            prose-headings:text-[#0057A3] prose-headings:font-bold
            prose-p:text-slate-700 prose-p:leading-8
            prose-strong:text-blue-700
            prose-blockquote:border-r-4 prose-blockquote:border-blue-200 prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-4
            prose-li:text-slate-700"
          >
            <ReactMarkdown>{summary.content}</ReactMarkdown>
          </div>
        </Card>

        {/* Navigation Button */}
        <div className="flex flex-row justify-between mt-6">
          <Link href="/courses2" className="w-full md:w-auto">
            <Button variant="back" size="lg">
              بازگشت به لیست درس‌ها
            </Button>
          </Link>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
              onClick={() =>
                router.push(
                  `/courses2/${courseId}/chapters/${chapterId}/summary/edit`,
                )
              }
            >
              <Edit3 size={16} />
              <span>ویرایش</span>
            </Button>

            <Button
              variant="danger"
              size="lg"
              className="flex items-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              <span>حذف</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
