//FlashCards
//// Get all flashcards from localStorage
export const getFlashcards = () => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem("flashcards");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
// Save all flashcards to localStorage
export const saveFlashcards = (cards) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("flashcards", JSON.stringify(cards));
};
// Add a new flashcard
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
// Get flashcards by course and optional chapter
export const getFlashcardsByCourse = (courseId, chapterId = null) => {
  const cards = getFlashcards();

  const normalizedCourseId = String(courseId);
  const normalizedChapterId =
    chapterId !== undefined && chapterId !== null ? String(chapterId) : null;

  return cards.filter((c) => {
    const sameCourse = String(c.courseId) === normalizedCourseId;

    if (!sameCourse) return false;

    if (normalizedChapterId === null) return true;

    return String(c.chapterId) === normalizedChapterId;
  });
};
// Delete a flashcard
export function deleteFlashcard(cardId) {
  const cards = getFlashcards();
  const updated = cards.filter((c) => String(c.id) !== String(cardId));
  localStorage.setItem("flashcards", JSON.stringify(updated));
}

// Update review progress using the SM-2 algorithm
export const updateCardReview = (card, quality) => {
  const now = new Date();

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
  
    repetition = 0;
    interval = 1;

    
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );
  } else {

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
//Profile 
// Save the user profile
export function saveUserProfile(profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_profile", JSON.stringify(profile));
}
// Get the saved user profile
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

//Courses
// Get all courses from localStorage
export const getCourses = () => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem("courses");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
// Save all courses to localStorage
export const saveCourses = (courses) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("courses", JSON.stringify(courses));
};
// Add a new course
export const addCourse = (course) => {
  const courses = getCourses();
  saveCourses([...courses, course]);
};
// Delete a course
export function deleteCourse(courseId) {
  const courses = getCourses();
  const updated = courses.filter((c) => String(c.id) !== String(courseId));
  localStorage.setItem("courses", JSON.stringify(updated));
}
// Delete a chapter and its related flashcards and summary
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

  const flashcards = JSON.parse(localStorage.getItem("flashcards") || "[]");

  const filteredFlashcards = flashcards.filter(
    (card) => !(card.courseId === courseId && card.chapterId === chapterId),
  );

  localStorage.setItem("flashcards", JSON.stringify(filteredFlashcards));
  deleteSummary(courseId, chapterId);
}
// Update an existing course
export const updateCourse = (id, updatedCourse) => {
  const courses = getCourses();
  const newList = courses.map((c) =>
    String(c.id) === String(id) ? updatedCourse : c,
  );
  localStorage.setItem("courses", JSON.stringify(newList));
};
// Reorder chapters within a course
export function reorderChapters(courseId, newChapters) {
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;

  course.chapters = newChapters;

  localStorage.setItem("courses", JSON.stringify(courses));
}
//Summery
// Get all summaries
export function getSummaries() {
  return JSON.parse(localStorage.getItem("summaries") || "[]");
}
// Get a summary by course and chapter
export function getSummary(courseId, chapterId) {
  const all = getSummaries();
  return all.find((s) => s.courseId === courseId && s.chapterId === chapterId);
}
// Save all summaries
export function saveSummaries(list) {
  localStorage.setItem("summaries", JSON.stringify(list));
}
// Create or update a summary
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
// Delete a summary
export function deleteSummary(courseId, chapterId) {
  const all = getSummaries();
  const filtered = all.filter(
    (s) => !(s.courseId === courseId && s.chapterId === chapterId),
  );
  saveSummaries(filtered);
}
// Add a new summary
export function addSummary(summary) {
  const summaries = getSummaries();
  summaries.push(summary);
  saveSummaries(summaries); 
}
