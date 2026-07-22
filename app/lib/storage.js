// ------------------------------
// فلش‌کارت‌ها
// ------------------------------

export const getFlashcards = () => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem("flashcards");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFlashcards = (cards) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("flashcards", JSON.stringify(cards));
};

export const addFlashcard = (card) => {
  const cards = getFlashcards();

  const normalizedCard = {
    ...card,
    id: String(card.id),
    courseId: String(card.courseId),
    chapterId:
      card.chapterId !== undefined && card.chapterId !== null
        ? String(card.chapterId)
        : null,
  };

  const updated = [...cards, normalizedCard];
  saveFlashcards(updated);
};

export const getFlashcardsByCourse = (courseId, chapterId = null) => {
  const cards = getFlashcards();

  const normalizedCourseId = String(courseId);
  const normalizedChapterId =
    chapterId !== undefined && chapterId !== null ? String(chapterId) : null;

  return cards.filter((c) => {
    const sameCourse = String(c.courseId) === normalizedCourseId;

    if (!sameCourse) return false;

    // اگر chapterId داده نشده، همه کارت‌های درس را برگردان
    if (normalizedChapterId === null) return true;

    // اگر chapterId داده شده، فقط کارت‌های همان فصل را برگردان
    return String(c.chapterId) === normalizedChapterId;
  });
};

// الگوریتم مرور
export const updateCardReview = (card, quality) => {
  const now = new Date();

  // اگر quality به صورت متن ارسال شده باشد
  const qualityMap = {
    again: 0,
    hard: 3,
    good: 4,
    easy: 5,
  };

  if (typeof quality === "string") {
    quality = qualityMap[quality] ?? 4;
  }

  let repetition = card.repetition ?? 0;
  let interval = card.interval ?? 1;
  let easeFactor = card.easeFactor ?? 2.5;

  if (quality < 3) {
    // پاسخ اشتباه
    repetition = 0;
    interval = 1;

    // کاهش EF
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );
  } else {
    // پاسخ صحیح
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    repetition++;

    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );
  }

  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + interval);

  return {
    ...card,
    repetition,
    interval,
    easeFactor,
    nextReview: nextReview.toISOString(),
    lastReviewed: now.toISOString(),
  };
};

// ------------------------------
// کاربر
// ------------------------------
export function saveUserProfile(profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_profile", JSON.stringify(profile));
}

export function getUserProfile() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("user_profile");
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object" && parsed.degree && parsed.major) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

// ------------------------------
// درس‌ها
// ------------------------------
export const getCourses = () => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem("courses");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCourses = (courses) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("courses", JSON.stringify(courses));
};

export const addCourse = (course) => {
  const courses = getCourses();
  saveCourses([...courses, course]);
};

// حذف یک درس
export function deleteCourse(courseId) {
  const courses = getCourses();
  const updated = courses.filter((c) => String(c.id) !== String(courseId));
  localStorage.setItem("courses", JSON.stringify(updated));
}
// حذف یک فصل از یک درس
export function deleteChapter(courseId, chapterId) {
  const courses = JSON.parse(localStorage.getItem("courses") || "[]");

  const updatedCourses = courses.map((c) => {
    if (c.id === courseId) {
      const newChapters = c.chapters.filter((ch) => ch.id !== chapterId);

      return {
        ...c,
        chapters: newChapters,
        isChaptersModified:
          newChapters.length === 0 ? true : c.isChaptersModified,
      };
    }
    return c;
  });

  localStorage.setItem("courses", JSON.stringify(updatedCourses));

  // ✅ حذف فلش‌کارت‌های مربوط به این فصل
  const flashcards = JSON.parse(localStorage.getItem("flashcards") || "[]");

  const filteredFlashcards = flashcards.filter(
    (card) => !(card.courseId === courseId && card.chapterId === chapterId),
  );

  localStorage.setItem("flashcards", JSON.stringify(filteredFlashcards));
  deleteSummary(courseId, chapterId);
}

// update course
export const updateCourse = (id, updatedCourse) => {
  const courses = getCourses();
  const newList = courses.map((c) =>
    String(c.id) === String(id) ? updatedCourse : c,
  );
  localStorage.setItem("courses", JSON.stringify(newList));
};

// حذف فلش‌کارت
export function deleteFlashcard(cardId) {
  const cards = getFlashcards();
  const updated = cards.filter((c) => String(c.id) !== String(cardId));
  localStorage.setItem("flashcards", JSON.stringify(updated));
}
export function reorderChapters(courseId, newChapters) {
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;

  course.chapters = newChapters;

  localStorage.setItem("courses", JSON.stringify(courses));
}
// ---------------------- Summaries ----------------------

export function getSummaries() {
  return JSON.parse(localStorage.getItem("summaries") || "[]");
}

export function getSummary(courseId, chapterId) {
  const all = getSummaries();
  return all.find((s) => s.courseId === courseId && s.chapterId === chapterId);
}

export function saveSummaries(list) {
  localStorage.setItem("summaries", JSON.stringify(list));
}

export function saveSummary(courseId, chapterId, content) {
  const all = getSummaries();
  const existing = all.find(
    (s) => s.courseId === courseId && s.chapterId === chapterId,
  );
  if (existing) {
    existing.content = content;
    existing.updatedAt = new Date().toISOString();
  } else {
    all.push({
      id: "summary-" + Date.now(),
      courseId,
      chapterId,
      content,
      updatedAt: new Date().toISOString(),
    });
  }

  saveSummaries(all);
}

export function deleteSummary(courseId, chapterId) {
  const all = getSummaries();
  const filtered = all.filter(
    (s) => !(s.courseId === courseId && s.chapterId === chapterId),
  );
  saveSummaries(filtered);
}

export function addSummary(summary) {
  const summaries = getSummaries();
  summaries.push(summary);
  saveSummaries(summaries); // ✔ اصلاح شد
}
