"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BilingualText from "@/components/BilingualText";
import { getMistakes, removeMistake, clearAllMistakes, MistakeItem } from "@/utils/mistakes";
import { useSettings } from "@/context/SettingsContext";

export default function MistakesClient() {
  const { showChinese } = useSettings();
  const [mistakes, setMistakes] = useState<Record<string, MistakeItem>>({});
  const [activeFilterSet, setActiveFilterSet] = useState<string>("all");

  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  const mistakeList = Object.values(mistakes);
  const totalCount = mistakeList.length;

  const handleRemove = (questionId: string) => {
    removeMistake(questionId);
    setMistakes(getMistakes());
  };

  const handleClearAll = () => {
    const msg = showChinese
      ? "確定要清空所有錯題記錄嗎？此操作無法還原。"
      : "Are you sure you want to clear all mistake records? This cannot be undone.";
    if (window.confirm(msg)) {
      clearAllMistakes();
      setMistakes({});
    }
  };

  const filteredList = activeFilterSet === "all"
    ? mistakeList
    : mistakeList.filter((m) => m.setId.toString() === activeFilterSet);

  const availableSets = Array.from(new Set(mistakeList.map((m) => m.setId))).sort((a, b) => a - b);

  if (totalCount === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 w-full text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-100 text-green-700 text-3xl font-black rounded-3xl flex items-center justify-center mb-6 shadow-xs">
          ✓
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {showChinese ? "太棒了！目前暫無錯題" : "Awesome! No Mistakes Recorded"}
        </h2>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-sm">
          {showChinese
            ? "在進行模擬考試時，若有回答錯誤的題目會自動收集至此處。隨時進行錯題重溫，迅速掃除盲點！"
            : "Whenever you answer incorrectly in mock exams, questions are automatically collected here so you can review and master them."}
        </p>
        <Link
          href="/"
          prefetch={false}
          className="min-h-[48px] px-8 rounded-xl bg-gray-900 text-white font-bold text-base flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          {showChinese ? "前往模擬考試" : "Go to Mock Tests"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Link href="/" prefetch={false} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {showChinese ? "返回首頁 Dashboard" : "Back to Dashboard"}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <span>📕</span>
            <span>{showChinese ? "錯題溫習庫 (Mistakes Bank)" : "Mistakes Bank"}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {showChinese ? `共收錄 ${totalCount} 道待鞏固錯題，掌握後可點擊「標記為已掌握」移除` : `${totalCount} failed questions to master.`}
          </p>
        </div>

        <button
          onClick={handleClearAll}
          className="px-4 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Clear all mistakes"
        >
          <span>🗑️</span>
          <span>{showChinese ? "清空錯題庫" : "Clear All"}</span>
        </button>
      </div>

      {/* Set Filter Pill Bar */}
      {availableSets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          <button
            onClick={() => setActiveFilterSet("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilterSet === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showChinese ? "全部套卷 All" : "All Sets"} ({totalCount})
          </button>
          {availableSets.map((setId) => {
            const count = mistakeList.filter((m) => m.setId === setId).length;
            return (
              <button
                key={setId}
                onClick={() => setActiveFilterSet(setId.toString())}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilterSet === setId.toString()
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Set {setId} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Question Cards List */}
      <div className="flex flex-col gap-6">
        {filteredList.map((item) => {
          const q = item.question;
          const userChosen = item.selectedAnswer;
          const correctOpts = q.options.filter((o) => o.isCorrect).map((o) => o.id);

          return (
            <div key={q.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs transition-colors flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md">
                  Set {item.setId} • Q{q.id}
                </span>

                <button
                  onClick={() => handleRemove(item.questionId)}
                  className="px-3 py-1 rounded-full border border-green-600 bg-green-50 text-green-800 hover:bg-green-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Mark as Mastered and remove from mistakes"
                >
                  <span>✓</span>
                  <span>{showChinese ? "標記已掌握 (Mastered)" : "Mastered"}</span>
                </button>
              </div>

              {/* Question Text */}
              <BilingualText
                text={q.question}
                enClassName="text-lg sm:text-xl font-bold text-gray-900 leading-snug"
                zhClassName="text-base sm:text-lg text-gray-700 mt-1"
              />

              {/* Options */}
              <div className="flex flex-col gap-2.5 mt-2">
                {q.options.map((opt) => {
                  const isCorrect = opt.isCorrect;
                  const isUserChosen = correctOpts.length === 1
                    ? userChosen === opt.id
                    : Array.isArray(userChosen) && userChosen.includes(opt.id);

                  let borderStyle = "border-gray-200 bg-gray-50/50";
                  let badge = null;

                  if (isCorrect) {
                    borderStyle = "border-green-500 bg-green-50/60 font-semibold";
                    badge = <span className="text-xs bg-green-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">✓ 正確答案</span>;
                  } else if (isUserChosen) {
                    borderStyle = "border-red-400 bg-red-50/60";
                    badge = <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">✗ 你的答案</span>;
                  }

                  return (
                    <div key={opt.id} className={`border-2 rounded-xl p-3.5 flex justify-between items-center gap-3 ${borderStyle}`}>
                      <BilingualText
                        text={opt.text}
                        enClassName="text-sm sm:text-base text-gray-900"
                        zhClassName="text-xs sm:text-sm text-gray-600 mt-0.5"
                      />
                      {badge}
                    </div>
                  );
                })}
              </div>

              {/* Explanation & Chapter Reference */}
              {q.explanation && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 mt-2 transition-colors">
                  <div className="text-xs font-black text-amber-900 mb-1 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>{showChinese ? "考點詳細解析：" : "Official Explanation:"}</span>
                  </div>
                  <BilingualText
                    text={q.explanation}
                    enClassName="text-xs sm:text-sm text-gray-800 leading-relaxed"
                    zhClassName="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
