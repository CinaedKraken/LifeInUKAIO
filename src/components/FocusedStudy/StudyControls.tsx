import React from "react";
import { useStudyContext } from "@/context/StudyContext";

interface StudyControlsProps {
  onNext: () => void;
  onPrev?: () => void;
  hasPrev?: boolean;
  isEnd: boolean;
  chapterId: string;
}

export default function StudyControls({ onNext, onPrev, hasPrev = false, isEnd, chapterId }: StudyControlsProps) {
  const { isEnglish } = useStudyContext();

  const isFlaggedChapter = chapterId === "flagged";
  const btnText = isEnd 
    ? (isEnglish 
        ? (isFlaggedChapter ? "Back to Lessons" : "Finish Chapter") 
        : (isFlaggedChapter ? "返回單元列表" : "完成本章")) 
    : (isEnglish ? "Next" : "下一頁");

  return (
    <div className="flex items-center justify-between gap-4 mt-auto pt-6 border-t border-gray-200">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex-1 sm:flex-initial min-h-[56px] px-6 sm:px-8 rounded-xl border-2 border-gray-300 bg-white text-gray-800 font-bold hover:bg-gray-100 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>{isEnglish ? "Previous" : "上一頁"}</span>
      </button>

      <button
        onClick={onNext}
        className="flex-1 sm:flex-initial min-h-[56px] px-8 sm:px-12 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
      >
        <span>{btnText}</span>
        {!isEnd && (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        )}
      </button>
    </div>
  );
}
