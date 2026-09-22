"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import studyGuideData from "@/data/study_guide.json";
import { StudyPoint } from "@/types";
import { safeGetItem, safeSetItem } from "@/utils/storage";

interface StudyContextType {
  isEnglish: boolean;
  toggleLanguage: () => void;
  progress: Record<string, number>;
  updateProgress: (chapterId: string, pointIndex: number) => void;
  bookmarks: Record<string, boolean>;
  toggleBookmark: (pointId: string) => void;
  isBookmarked: (pointId: string) => boolean;
  getAllFlaggedPoints: () => StudyPoint[];
  getAllFlaggedCount: () => number;
  getFlaggedCountByChapter: (pointIds: string[]) => number;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [isEnglish, setIsEnglish] = useState<boolean>(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedLang = safeGetItem("lifeinuk_study_lang");
    if (savedLang !== null) {
      setIsEnglish(savedLang === "true");
    }

    const savedProgress = safeGetItem("lifeinuk_study_progress");
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to parse study progress", e);
      }
    }

    const savedBookmarks = safeGetItem("lifeinuk_study_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to parse study bookmarks", e);
      }
    }
  }, []);

  const toggleLanguage = () => {
    setIsEnglish((prev) => {
      const next = !prev;
      safeSetItem("lifeinuk_study_lang", next.toString());
      return next;
    });
  };

  const updateProgress = (chapterId: string, pointIndex: number) => {
    setProgress((prev) => {
      const next = { ...prev, [chapterId]: pointIndex };
      safeSetItem("lifeinuk_study_progress", JSON.stringify(next));
      return next;
    });
  };

  const toggleBookmark = (pointId: string) => {
    setBookmarks((prev) => {
      const next = { ...prev };
      if (next[pointId]) {
        delete next[pointId];
      } else {
        next[pointId] = true;
      }
      safeSetItem("lifeinuk_study_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (pointId: string): boolean => {
    return !!bookmarks[pointId];
  };

  const getAllFlaggedPoints = (): StudyPoint[] => {
    const points: StudyPoint[] = [];
    studyGuideData.forEach((ch) => {
      ch.points.forEach((p) => {
        if (bookmarks[p.id]) {
          points.push(p as StudyPoint);
        }
      });
    });
    return points;
  };

  const getAllFlaggedCount = (): number => {
    return Object.values(bookmarks).filter(Boolean).length;
  };

  const getFlaggedCountByChapter = (pointIds: string[]): number => {
    return pointIds.filter((id) => bookmarks[id]).length;
  };

  return (
    <StudyContext.Provider
      value={{
        isEnglish,
        toggleLanguage,
        progress,
        updateProgress,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        getAllFlaggedPoints,
        getAllFlaggedCount,
        getFlaggedCountByChapter,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudyContext() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudyContext must be used within a StudyProvider");
  }
  return context;
}
