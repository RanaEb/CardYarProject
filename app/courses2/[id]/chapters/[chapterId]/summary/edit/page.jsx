"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PersianMarkdownEditor from "@/app/components/PersianMarkdownEditor";
import { getSummary, saveSummary } from "@/app/lib/storage";
import Link from "next/link";
import Button from "@/app/components/ui/button";
import { Edit3, PlusCircle } from "lucide-react";

export default function EditSummaryPage() {
  const router = useRouter();
  const { id: courseId, chapterId } = useParams();

  const [content, setContent] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const s = getSummary(courseId, chapterId);
    if (s) {
      setContent(s.content);
      setIsEdit(true);
    }
  }, [courseId, chapterId]);

  const handleSave = () => {
    saveSummary(courseId, chapterId, content);
    router.push(`/courses2/${courseId}/chapters/${chapterId}/summary`);
  };

  return (
    <div className="min-h-screen mt-14 max-w-5xl mx-auto p-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0077C8]">
          {isEdit ? <Edit3 size={26} /> : <PlusCircle size={26} />}
        </div>

        <h1 className="text-2xl font-medium text-[#0077C8]">
          {isEdit ? "ویرایش خلاصه" : "ایجاد خلاصه"}
        </h1>
      </div>

      <PersianMarkdownEditor value={content} onChange={setContent} />

      <div className="flex flex-row justify-between items-center gap-3 mt-4">
        {/* دکمه ذخیره (سمت راست در موبایل و دسکتاپ) */}
        <Button
          onClick={handleSave}
          variant="primary"
          size="lg"
          className="w-[45%] md:w-48" 
        >
          ذخیره
        </Button>

        {/* دکمه بازگشت (سمت چپ در موبایل و دسکتاپ) */}
        <Link href="/courses2" className="w-[45%] md:w-48">
          <Button variant="back" size="lg" className="w-full">
            بازگشت
          </Button>
        </Link>
      </div>
    </div>
  );
}
