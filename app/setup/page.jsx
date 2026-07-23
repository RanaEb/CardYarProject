"use client";

import { useState, useEffect } from "react";
import majors from "@/app/setup/data/majors.json";
import {
  saveUserProfile,
  getUserProfile,
  saveFlashcards,
} from "@/app/lib/storage";
import Button from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import Input from "@/app/components/ui/input";
import UniversalSelect from "@/app/components/ui/UniversalSelect";
import { Sparkles } from "lucide-react";

export default function SetupPage() {
  const [degree, setDegree] = useState("karshenasi");
  const [major, setMajor] = useState("");
  const [userName, setUserName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = getUserProfile();
    if (saved) {
      window.location.replace("/");
      return;
    }
    setReady(true);
  }, []);

  const handleSubmit = () => {
    if (!major) {
      alert("لطفاً رشته را انتخاب کنید.");
      return;
    }
    if (!userName) {
      alert("لطفاً نام خود را وارد کنید.");
      return;
    }

    const profile = { degree, major, userName };
    saveUserProfile(profile);

    const defaultCourses = majors?.[degree]?.[major]?.courses || [];

    const flashcards = [];

    const coursesWithMeta = defaultCourses.map((course, index) => {
      const chapters = (course.chapters || []).map((chapter) => {
        (chapter.flashcards || []).forEach((card) => {
          flashcards.push({
            id: crypto.randomUUID(),
            courseId: String(course.id),
            chapterId: String(chapter.id),
            questionText: card.question,
            answerText: card.answer,
            questionImage: null,
            answerImage: null,
            interval: 1,
            nextReview: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isDefault: true,
          });
        });

        return {
          id: chapter.id,
          title: chapter.title,
          isDefault: true,
        };
      });

      return {
        id: course.id || String(index + 1),
        title: course.title || course.name || `درس ${index + 1}`,
        chapters,
        isDefault: true,
        createdAt: new Date().toISOString(),
      };
    });

    localStorage.setItem("courses", JSON.stringify(coursesWithMeta));
    saveFlashcards(flashcards);
    window.location.replace("/");
  };

  const majorsList = Object.keys(majors?.[degree] || {});

  if (!ready) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-20 sm:pt-0">
      <Card className="max-w-lg w-full p-10 pb-20 shadow-xl border-2 border-slate-200 bg-white">
        <div className="flex flex-row items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0057A3]">
            <Sparkles size={20} />
          </div>
          <h1 className="text-3xl font-medium text-[#0057A3]">
            ورود به کارت یار
          </h1>
        </div>

        {/* نام */}
        <div className="mb-6">
          <label className="block text-slate-800 mb-2 font-medium">نام</label>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="مثلاً: علی"
          />
        </div>

        {/* مقطع */}
        <div className="mb-6">
          <label className="block text-slate-700 mb-2 font-medium">
            مقطع تحصیلی
          </label>

          <UniversalSelect
            value={degree}
            onChange={(v) => {
              setDegree(v);
              setMajor("");
            }}
            options={[{ value: "karshenasi", label: "کارشناسی" }]}
          />
        </div>

        {/* رشته */}
        <div className="mb-6">
          <label className="block text-slate-700 mb-2 font-medium">
            رشته تحصیلی
          </label>

          <UniversalSelect
            value={major}
            onChange={(v) => setMajor(v)}
            options={majorsList.map((m) => ({
              value: m,
              label: m,
            }))}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          className="w-full"
        >
          شروع استفاده
        </Button>
      </Card>
    </div>
  );
}
