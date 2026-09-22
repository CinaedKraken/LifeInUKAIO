"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudyContext } from "@/context/StudyContext";
import StudyCard from "@/components/FocusedStudy/StudyCard";
import StudyControls from "@/components/FocusedStudy/StudyControls";

export default function StudyChapterClient({ chapterId, chapter }: { chapterId: string; chapter: any }) {
  const router = useRouter();
  const { progress, updateProgress, isEnglish, toggleLanguage, getAllFlaggedPoints } = useStudyContext();
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const isFlaggedChapter = chapterId === "flagged";
  const points = isFlaggedChapter ? getAllFlaggedPoints() : (chapter?.points || []);

  useEffect(() => {
    const savedIndex = progress[chapterId] || 0;
    setCurrentIndex(savedIndex);
  }, [chapterId, progress]);

  const totalPoints = points.length;
  if (totalPoints === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 w-full text-center flex flex-col items-center justify-center my-auto">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 text-2xl font-black rounded-2xl flex items-center justify-center mb-4 shadow-xs">
          ★
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {isEnglish ? "No Flagged Points Yet" : "目前未有標記難題"}
        </h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {isEnglish
            ? "Mark key learning points with the star button during lessons to review all your difficult concepts here."
            : "在各單元學習時，點擊卡片右上角的「★ 標記難題」，系統便會自動將其加入此處集中衝刺複習！"}
        </p>
        <Link
          href="/study"
          prefetch={false}
          className="min-h-[48px] px-8 rounded-xl bg-gray-900 text-white font-bold text-base flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"
        >
          {isEnglish ? "Back to Lessons" : "返回單元列表"}
        </Link>
      </div>
    );
  }

  // Ensure index is within bounds
  const safeIndex = Math.min(currentIndex, totalPoints - 1);
  const currentPoint = points[safeIndex];
  const progressPct = ((safeIndex + 1) / totalPoints) * 100;
  const isEnd = safeIndex === totalPoints - 1;

  const handleNext = () => {
    if (isEnd) {
      router.push("/study");
    } else {
      const nextIdx = safeIndex + 1;
      setCurrentIndex(nextIdx);
      updateProgress(chapterId, nextIdx);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      const prevIdx = safeIndex - 1;
      setCurrentIndex(prevIdx);
      updateProgress(chapterId, prevIdx);
    }
  };

  const chapterTitle = isFlaggedChapter
    ? (isEnglish ? "Flagged Difficult Points" : "★ flagged • 專屬難題庫")
    : (isEnglish ? chapter.title.en : chapter.title.zh);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
      
      {/* Top Bar */}
      <div className="sticky top-[72px] z-10 bg-[#f9fafb] py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b border-gray-200 sm:border-0 shadow-xs sm:shadow-none">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link href="/study" prefetch={false} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              {isEnglish ? "Back" : "返回單元列表"}
            </Link>
            <h1 className="text-xl font-black text-gray-900">
              {isFlaggedChapter ? chapterTitle : `${isEnglish ? "Lesson" : "單元"} ${chapter.chapterId}: ${chapterTitle}`}
            </h1>
          </div>
          
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-100 transition-colors shadow-xs cursor-pointer text-sm"
          >
            <span>EN / 繁</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isFlaggedChapter ? "bg-amber-500" : "bg-blue-600"}`} 
              style={{ width: `${progressPct}%` }} 
            />
          </div>
          <div className="text-sm font-bold text-gray-600 w-16 text-right font-mono">
            {safeIndex + 1}/{totalPoints}
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex-1 mb-8">
        <StudyCard point={currentPoint} />
      </div>

      {/* Bottom Dual Controls (Previous & Next) */}
      <StudyControls 
        onNext={handleNext} 
        onPrev={handlePrev}
        hasPrev={safeIndex > 0}
        isEnd={isEnd} 
        chapterId={chapterId} 
      />
      
    </div>
  );
}
