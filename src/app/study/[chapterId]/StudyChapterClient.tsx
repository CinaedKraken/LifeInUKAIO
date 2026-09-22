"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudyContext } from "@/context/StudyContext";
import StudyCard from "@/components/FocusedStudy/StudyCard";
import StudyControls from "@/components/FocusedStudy/StudyControls";

export default function StudyChapterClient({ chapterId, chapter }: { chapterId: string; chapter: any }) {
  const router = useRouter();
  const { progress, updateProgress, isEnglish, getAllFlaggedPoints, clearAllFlagged } = useStudyContext();
  
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
          className="min-h-[48px] px-8 rounded-xl bg-gray-900 text-white font-bold text-base flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextIdx = parseInt(e.target.value, 10);
    setCurrentIndex(nextIdx);
    updateProgress(chapterId, nextIdx);
  };

  const handleClearAllFlagged = () => {
    const msg = isEnglish
      ? "Are you sure you want to clear all flagged questions? This cannot be undone."
      : "確定要清除所有已標記難題嗎？此操作無法復原。";
    if (window.confirm(msg)) {
      clearAllFlagged();
      router.push("/study");
    }
  };

  const chapterTitle = isFlaggedChapter
    ? (isEnglish ? "Flagged Difficult Points" : "★ flagged • 專屬難題庫")
    : (isEnglish ? chapter.title.en : chapter.title.zh);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
      
      {/* Top Bar */}
      <div className="sticky top-[72px] z-10 bg-[#f9fafb] py-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b border-gray-200 sm:border-0 shadow-xs sm:shadow-none transition-colors">
        <div className="flex justify-between items-center mb-3">
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

          {/* Clear All Flagged Button (Only in Flagged Chapter) */}
          {isFlaggedChapter && (
            <button
              onClick={handleClearAllFlagged}
              className="px-3.5 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear all flagged questions"
            >
              <span>🗑️</span>
              <span>{isEnglish ? "Clear All" : "清除所有"}</span>
            </button>
          )}
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
      <div className="flex-1 mb-6">
        <StudyCard point={currentPoint} />
      </div>

      {/* Interactive Jump Slider (Scrubber) */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-3 sm:p-4 mb-4 flex flex-col gap-2 shadow-xs transition-colors">
        <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-700">
          <span className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{isEnglish ? "Jump to Point:" : "快速跳轉考點："}</span>
            <span className="font-mono text-blue-600 font-black">{safeIndex + 1} / {totalPoints}</span>
          </span>
          <span className="text-gray-500 font-mono text-xs">
            {Math.round(progressPct)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setCurrentIndex(0); updateProgress(chapterId, 0); }}
            disabled={safeIndex === 0}
            className="text-xs font-bold px-2.5 py-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title={isEnglish ? "Jump to first point" : "跳至第一頁"}
          >
            |&lt;
          </button>
          <input
            type="range"
            min="0"
            max={totalPoints - 1}
            value={safeIndex}
            onChange={handleSliderChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Jump to study point"
          />
          <button
            onClick={() => { const last = totalPoints - 1; setCurrentIndex(last); updateProgress(chapterId, last); }}
            disabled={safeIndex === totalPoints - 1}
            className="text-xs font-bold px-2.5 py-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title={isEnglish ? "Jump to last point" : "跳至最後一頁"}
          >
            &gt;|
          </button>
        </div>
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
