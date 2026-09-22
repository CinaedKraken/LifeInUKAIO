import React from "react";
import { useStudyContext } from "@/context/StudyContext";

interface Point {
  id: string;
  questionId: string;
  text: {
    en: string;
    zh: string;
  };
}

interface StudyCardProps {
  point: Point;
}

export default function StudyCard({ point }: StudyCardProps) {
  const { isEnglish, isBookmarked, toggleBookmark } = useStudyContext();
  const flagged = isBookmarked(point.id);

  const titleText = isEnglish ? "KEY LEARNING POINT" : "重點學習內容";

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-6 h-full min-h-[50vh]">
      <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
        <h2 className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">
          {titleText}
        </h2>

        {/* Bookmark / Flag Button */}
        <button
          type="button"
          onClick={() => toggleBookmark(point.id)}
          aria-pressed={flagged}
          aria-label={flagged ? "Remove from difficult points" : "Mark as difficult point"}
          className={`min-h-[44px] px-3.5 py-1.5 rounded-full border-2 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 shadow-xs ${
            flagged
              ? "border-amber-500 bg-amber-50 text-amber-950"
              : "border-gray-300 bg-white text-gray-600 hover:border-amber-400 hover:text-amber-600"
          }`}
        >
          <span className={flagged ? "text-amber-500 text-sm font-black" : "text-gray-400 text-sm"}>
            ★
          </span>
          <span>
            {flagged
              ? (isEnglish ? "Flagged" : "已標記難題 (Flagged)")
              : (isEnglish ? "Flag" : "標記難題 (Flag)")}
          </span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {/* English Text */}
        <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
          {point.text.en}
        </div>

        {/* Traditional Chinese Text (Shown if not purely English mode) */}
        {!isEnglish && point.text.zh && (
          <div className="text-lg sm:text-xl text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
            {point.text.zh}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-mono">
        <span>Point ID: {point.id}</span>
        <span>Official Study Material</span>
      </div>
    </div>
  );
}
