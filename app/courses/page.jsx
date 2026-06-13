"use client";

import { useEffect, useState } from "react";
import {
  getCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  deleteChapter,
  getUserProfile,
  reorderChapters,
} from "@/app/lib/storage";

import majors from "@/app/setup/data/majors.json";
import Link from "next/link";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import {
  BookOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";

// DnD KIT
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// ----------------------
//          Drag Handle Version
// ----------------------
function SortableChapter({ chapter, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [openCourse, setOpenCourse] = useState(null);
  const [chapterInputs, setChapterInputs] = useState({});
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  useEffect(() => {
    const profile = getUserProfile();
    if (!profile) {
      window.location.href = "/setup";
      return;
    }

    let savedCourses = getCourses();
    const majorCoursesData = majors[profile.degree][profile.major].courses;

    if (!savedCourses || savedCourses.length === 0) {
      const defaultCourses = majorCoursesData.map((c) => ({
        ...c,
        id: Date.now().toString() + Math.random(),
        isDefault: true,
        createdAt: new Date().toISOString(),
        chapters: c.chapters
          ? c.chapters.map((ch) => ({
              ...ch,
              isDefault: true,
            }))
          : [],
      }));

      localStorage.setItem("courses", JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    } else {
      const updated = savedCourses.map((course) => {
        // ✅ اگر کاربر خودش فصل‌ها را ویرایش کرده باشد، به هیچ وجه بازسازی نکن
        if (course.isChaptersModified) {
          return course;
        }

        // اگر درس پیش‌فرض بوده و فصل ندارد، فقط در اولین بار آن‌ها را بازسازی کن
        if (
          course.isDefault &&
          (!course.chapters || course.chapters.length === 0)
        ) {
          const src = majorCoursesData.find((mc) => mc.title === course.title);
          if (src?.chapters) {
            return {
              ...course,
              chapters: src.chapters.map((ch) => ({
                ...ch,
                isDefault: true,
              })),
            };
          }
        }

        return course;
      });

      localStorage.setItem("courses", JSON.stringify(updated));
      setCourses(updated);
    }
  }, []);

  // -------------------------
  //         ADD COURSE
  // -------------------------
  const handleAddCourse = () => {
    if (!newCourse.trim()) return;

    const id = Date.now().toString();
    const course = {
      id,
      title: newCourse,
      isDefault: false,
      createdAt: new Date().toISOString(),
      chapters: [],
    };

    addCourse(course);
    setCourses((prev) => [...prev, course]);
    setNewCourse("");
  };

  // -------------------------
  //       DELETE COURSE
  // -------------------------
  const handleDeleteCourse = (id, isDefault) => {
    if (isDefault) {
      alert("❌ درس‌های پیش‌فرض قابل حذف نیستند.");
      return;
    }

    if (!confirm("آیا از حذف این درس مطمئن هستی؟")) return;

    deleteCourse(id);
    setCourses(getCourses());
  };

  // -------------------------
  //        ADD CHAPTER
  // -------------------------
  const handleAddChapter = (courseId) => {
    const title = chapterInputs[courseId]?.trim();
    if (!title) return;

    const updated = courses.map((course) => {
      if (course.id === courseId) {
        const newChapter = {
          id: Date.now().toString(),
          title,
          isDefault: false,
        };

        return {
          ...course,
          chapters: [...course.chapters, newChapter],
        };
      }
      return course;
    });

    setCourses(updated);

    updateCourse(
      courseId,
      updated.find((c) => c.id === courseId),
    );

    setChapterInputs((prev) => ({ ...prev, [courseId]: "" }));
  };

  // -------------------------
  //      DELETE CHAPTER
  // -------------------------
  const handleDeleteChapterClick = (courseId, chapterId) => {
    if (!confirm("این فصل و تمام فلش‌کارت‌های آن حذف شوند؟")) return;

    deleteChapter(courseId, chapterId);
    setCourses(getCourses());
  };

  // -------------------------
  //         UI RENDER
  // -------------------------
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-row items-center gap-3 mb-6 mt-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0077C8]">
            <BookOpen size={22} />
          </div>
          <h1 className="text-2xl font-medium text-[#0077C8]">لیست درس‌ها</h1>
        </div>

        {/* ADD COURSE */}
        <div className="flex gap-2 mb-8">
          <Input
            placeholder="نام درس جدید..."
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
          />
          <Button variant="primary" size="md" onClick={handleAddCourse}>
            افزودن
          </Button>
        </div>

        {/* COURSES */}
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-400 shadow"
            >
              {/* COURSE HEADER */}
              <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setOpenCourse(openCourse === course.id ? null : course.id)
                }
              >
                <span className="text-[#0a2142] font-medium">
                  {course.title}
                </span>

                <div className="flex items-center gap-3">
                  {course.isDefault && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                      پیش‌فرض
                    </span>
                  )}

                  <Trash2
                    size={22}
                    className={
                      course.isDefault
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 cursor-pointer hover:text-red-800"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.id, course.isDefault);
                    }}
                  />

                  {openCourse === course.id ? (
                    <ChevronUp size={22} />
                  ) : (
                    <ChevronDown size={22} />
                  )}
                </div>
              </div>

              {/* CHAPTERS */}
              {openCourse === course.id && (
                <div className="px-4 pb-4 border-t border-slate-400 space-y-3">
                  {/* ADD CHAPTER */}
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="نام فصل..."
                      value={chapterInputs[course.id] || ""}
                      onChange={(e) =>
                        setChapterInputs((prev) => ({
                          ...prev,
                          [course.id]: e.target.value,
                        }))
                      }
                      className="h-11 px-6"
                    />

                    <Button
                      className="h-11 px-3"
                      variant="primary"
                      onClick={() => handleAddChapter(course.id)}
                    >
                      افزودن فصل
                    </Button>
                  </div>

                  {/* DRAGGABLE LIST */}
                  {course.chapters?.length > 0 ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (!over || active.id === over.id) return;

                        const oldIndex = course.chapters.findIndex(
                          (c) => c.id === active.id,
                        );
                        const newIndex = course.chapters.findIndex(
                          (c) => c.id === over.id,
                        );

                        const reordered = arrayMove(
                          course.chapters,
                          oldIndex,
                          newIndex,
                        );

                        const updatedAll = courses.map((c) =>
                          c.id === course.id
                            ? { ...c, chapters: reordered }
                            : c,
                        );

                        setCourses(updatedAll);
                        reorderChapters(course.id, reordered);
                      }}
                    >
                      <SortableContext
                        items={course.chapters.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2 mt-3">
                          {course.chapters.map((ch) => (
                            <SortableChapter key={ch.id} chapter={ch}>
                              {({ attributes, listeners }) => (
                                <div className="group flex items-center justify-between p-3 bg-white border border-slate-300 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#0077C8] transition-all">
                                  {/* LEFT PART */}
                                  <div className="flex items-center gap-3">
                                    {/* DRAG HANDLE */}
                                    <button
                                      className="text-slate-400 hover:text-[#0077C8] cursor-grab active:cursor-grabbing"
                                      {...attributes}
                                      {...listeners}
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <GripVertical size={18} />
                                    </button>

                                    <div className="h-9 w-9 rounded-xl bg-[#EAF4FF] flex items-center justify-center text-[#0077C8]">
                                      <BookOpen size={18} />
                                    </div>

                                    <Link
                                      href={`/courses/${course.id}/chapters/${ch.id}`}
                                      className=" text-sm md:text-base font-medium text-slate-700 group-hover:text-[#0077C8]"
                                    >
                                      {ch.title}
                                    </Link>

                                    {ch.isDefault && (
                                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
                                        پیش‌فرض
                                      </span>
                                    )}
                                  </div>

                                  {/* RIGHT PART */}
                                  <div className="flex items-center gap-1 md:gap-2 justify-end shrink-0">
                                    {/* دکمه فلش‌کارت */}
                                    <Link
                                      href={`/courses/${course.id}/chapters/${ch.id}?createFlashcard=true`}
                                      className="px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs font-medium rounded-lg md:rounded-xl bg-[#EAF4FF] text-[#0077C8] hover:bg-[#CFE8FF] whitespace-nowrap shrink-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      فلش‌کارت
                                    </Link>

                                    {/* دکمه خلاصه */}
                                    <Link
                                      href={`/courses/${course.id}/chapters/${ch.id}/summary`}
                                      className="px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs font-medium rounded-lg md:rounded-xl bg-[#EAF4FF] text-[#0077C8] hover:bg-[#CFE8FF] whitespace-nowrap shrink-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      خلاصه
                                    </Link>

                                    {/* دکمه حذف */}
                                    {!ch.isDefault && (
                                      <Trash2
                                        size={20}
                                        className="text-slate-500 hover:text-red-700 cursor-pointer ml-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteChapterClick(
                                            course.id,
                                            ch.id,
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              )}
                            </SortableChapter>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="group flex items-center justify-between p-3 bg-white border border-slate-300 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#0077C8] transition-all">
                      <p className="text-gray-500 text-sm py-2">
                        فصلی وجود ندارد. اولین فصل را اضافه کنید.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div className="mt-8">
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
