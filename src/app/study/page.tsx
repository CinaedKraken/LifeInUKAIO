"use client";

import React from "react";
import Link from "next/link";
import studyGuideData from "@/data/study_guide.json";
import { useStudyContext } from "@/context/StudyContext";
import BilingualText from "@/components/BilingualText";

export default function StudyIndexPage() {
  const { progress, isEnglish, toggleLanguage, getAllFlaggedCount, getFlaggedCountByChapter } = useStudyContext();

  const flaggedCount = getAllFlaggedCount();
  const flaggedReviewed = Math.min(progress["flagged"] || 0, flaggedCount);
  const flaggedPct = flaggedCount > 0 ? Math.round((flaggedReviewed / flaggedCount) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            {isEnglish ? "Study Guide" : "溫習指南"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEnglish ? "Official syllabus key learning points" : "官方核心考點精華溫習"}
          </p>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-100 transition-colors shadow-xs cursor-pointer text-sm"
        >
          <span>EN / 繁</span>
        </button>
      </div>

      {/* THE 6TH SECTOR: Only revealed after the first content is flagged! */}
      {flaggedCount > 0 ? (
        <div className="mb-6">
          <Link href="/study/flagged" prefetch={false} className="block group">
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/10 border-2 border-amber-500 ring-2 ring-amber-400/40 rounded-2xl p-5 shadow-sm hover:border-amber-600 hover:shadow-md transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3.5">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-xl group-hover:scale-105 transition-transform">
                    ★
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                        ★ flagged • 專屬難題庫
                      </span>
                      <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md animate-pulse">
                        {isEnglish ? "Unlocked" : "已解鎖"}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mt-1 group-hover:text-amber-950 transition-colors">
                      {isEnglish ? "Flagged Difficult Points" : "已標記難題庫"}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {isEnglish
                        ? "Review difficult concepts collected across all chapters"
                        : "集中溫習各單元收藏之難題，衝刺突破必備"}
                    </p>
                  </div>
                </div>
                <div className="text-amber-900 font-bold text-sm bg-white px-3 py-1.5 rounded-xl border border-amber-300 shrink-0 font-mono shadow-2xs">
                  {flaggedCount} {isEnglish ? "points" : "題難題"}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-amber-900/80 mt-4 mb-1">
                <span>{isEnglish ? "Review Progress" : "難題溫習進度"}</span>
                <span className="font-mono font-bold">{flaggedReviewed} / {flaggedCount} ({flaggedPct}%)</span>
              </div>
              <div className="w-full bg-amber-200/70 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300 rounded-full" 
                  style={{ width: `${flaggedPct}%` }}
                />
              </div>
            </div>
          </Link>
        </div>
      ) : (
        /* Hint tip when 0 cards are flagged */
        <div className="mb-6 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-xs sm:text-sm text-blue-900 leading-relaxed">
            <p className="font-bold mb-0.5">
              {isEnglish ? "How to unlock the Difficult Points Bank?" : "如何解鎖專屬難題庫？"}
            </p>
            <p className="text-blue-800/90">
              {isEnglish
                ? "During any lesson, tap ★ Flag on challenging cards to automatically unlock the dedicated ★ flagged • 專屬難題庫 here!"
                : "在各單元學習時，點擊卡片右上角的「★ 標記難題」，系統便會自動解鎖「★ flagged • 專屬難題庫」，方便您集中衝刺溫習！"}
            </p>
          </div>
        </div>
      )}

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
        {isEnglish ? "Syllabus Chapters" : "官方課程單元 (1 - 5)"}
      </div>

      <div className="flex flex-col gap-4">
        {studyGuideData.map((chapter) => {
          const total = chapter.points.length;
          const current = progress[chapter.chapterId.toString()] || 0;
          const progressPct = total === 0 ? 0 : Math.round((current / total) * 100);
          const flaggedInChapter = getFlaggedCountByChapter(chapter.points.map((p) => p.id));

          return (
            <Link href={`/study/${chapter.chapterId}`} prefetch={false} key={chapter.chapterId}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-blue-100 text-blue-900 font-black w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors text-base shadow-2xs">
                      {chapter.chapterId}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          {isEnglish ? `Sector ${chapter.chapterId}` : `單元 ${chapter.chapterId}`}
                        </span>
                        {flaggedInChapter > 0 && (
                          <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
                            ★ {flaggedInChapter} {isEnglish ? "flagged" : "難題"}
                          </span>
                        )}
                      </div>
                      {/* Bilingual Title */}
                      <BilingualText 
                        text={chapter.title} 
                        enClassName={`text-lg font-bold ${isEnglish ? "text-gray-900" : "text-gray-500"}`}
                        zhClassName={`text-lg font-bold ${isEnglish ? "text-gray-500" : "text-gray-900"}`}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-bold text-gray-700 font-mono">
                      {current} / {total}
                    </span>
                    <span className="text-[11px] font-bold text-blue-600 ml-1">
                      ({progressPct}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-3">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300 rounded-full" 
                    style={{ width: `${progressPct}%` }} 
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
