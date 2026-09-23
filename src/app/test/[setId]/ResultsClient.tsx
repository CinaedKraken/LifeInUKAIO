"use client";

import React from "react";
import Link from "next/link";
import { MockTestSet } from "@/types";
import BilingualText from "@/components/BilingualText";
import { isAnswerCorrect } from "@/utils/answer";
import { useSettings } from "@/context/SettingsContext";

interface ResultsClientProps {
  mockTest: MockTestSet;
  answers: Record<string, string | string[]>;
  score: number;
}

export default function ResultsClient({ mockTest, answers, score }: ResultsClientProps) {
  const { showChinese } = useSettings();
  const [filter, setFilter] = React.useState<"all" | "mistakes">("all");
  const passed = score >= 18;
  const mistakesCount = mockTest.questions.length - score;

  const displayedQuestions = filter === "mistakes"
    ? mockTest.questions.filter((q) => !isAnswerCorrect(q, answers[q.id]))
    : mockTest.questions;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col flex-1 pb-12">
      <div className={`p-8 rounded-xl mb-8 text-center ${passed ? "bg-green-800 text-white" : "bg-red-800 text-white"}`}>
        <BilingualText 
          text={{ 
            en: passed ? "PASS" : "FAIL", 
            zh: passed ? "及格" : "不及格" 
          }} 
          enClassName="text-5xl font-black block tracking-widest"
          zhClassName="text-3xl font-bold block mt-2 text-white/90"
        />
        <div className="mt-4 text-xl font-medium bg-black/20 inline-block px-6 py-2 rounded-full">
          {showChinese ? `分數：${score} / 24（${Math.round((score / 24) * 100)}%）` : `Score: ${score} / 24 (${Math.round((score / 24) * 100)}%)`}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {showChinese ? "題目回顧 (Review Questions)" : "Review Questions"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {showChinese
              ? "所有錯題已自動存入「錯題溫習庫」，可隨時複習鞏固"
              : "All failed questions have been auto-saved to the Mistakes Bank for review."}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link 
            href="/mistakes"
            prefetch={false}
            className="flex-1 sm:flex-initial min-h-[44px] px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <span>📕</span>
            <span>{showChinese ? "錯題本 Mistakes" : "Mistakes Bank"}</span>
          </Link>
          <Link 
            href="/"
            prefetch={false}
            className="flex-1 sm:flex-initial min-h-[44px] px-4 rounded-lg border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-100 text-sm flex items-center justify-center transition-colors"
          >
            {showChinese ? "首頁" : "Dashboard"}
          </Link>
        </div>
      </div>

      {/* #10 Fix: Filter tabs with transition-colors for dark mode */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl mb-6 border border-gray-200 transition-colors">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
            filter === "all"
              ? "bg-white shadow-xs text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {showChinese ? `全部題目 All (${mockTest.questions.length})` : `All Questions (${mockTest.questions.length})`}
        </button>
        <button
          onClick={() => setFilter("mistakes")}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            filter === "mistakes"
              ? "bg-white shadow-xs text-red-600"
              : "text-gray-600 hover:text-red-600"
          }`}
        >
          <span>✗</span>
          <span>{showChinese ? `只重溫錯題 Failed Only (${mistakesCount})` : `Failed Only (${mistakesCount})`}</span>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {displayedQuestions.map((q) => {
          const chosen = answers[q.id];
          const correctOpts = q.options.filter((o) => o.isCorrect).map(o => o.id);
          const isUserCorrect = isAnswerCorrect(q, chosen);

          return (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-colors">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {isUserCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">✓</div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xl">✗</div>
                  )}
                </div>
                <div className="flex-1">
                  <BilingualText 
                    text={q.question} 
                    enClassName="text-xl font-bold text-gray-900 leading-snug" 
                    zhClassName="text-lg text-gray-700 mt-1" 
                  />
                  
                  <div className="mt-6 flex flex-col gap-3">
                    {q.options.map((opt) => {
                      const isOptionCorrect = opt.isCorrect;
                      const isOptionChosen = correctOpts.length === 1 
                        ? chosen === opt.id 
                        : Array.isArray(chosen) && chosen.includes(opt.id);
                      
                      let borderClass = "border-gray-200";
                      let bgClass = "bg-gray-50";
                      let textClass = "text-gray-500";
                      
                      if (isOptionCorrect) {
                        borderClass = "border-green-600 border-2";
                        bgClass = "bg-green-50";
                        textClass = "text-green-900";
                      } else if (isOptionChosen && !isOptionCorrect) {
                        borderClass = "border-red-500 border-2";
                        bgClass = "bg-red-50";
                        textClass = "text-red-900";
                      }

                      return (
                        <div key={opt.id} className={`p-4 rounded-lg border ${borderClass} ${bgClass} transition-colors`}>
                          <div className="flex items-start gap-2">
                            {isOptionChosen && !isOptionCorrect && (
                              <span className="font-bold text-red-600 mt-0.5 shrink-0">
                                {showChinese ? "你的答案：" : "Your Answer:"}
                              </span>
                            )}
                            {isOptionCorrect && (
                              <span className="font-bold text-green-700 mt-0.5 shrink-0">
                                {showChinese ? "正確答案：" : "Correct Answer:"}
                              </span>
                            )}
                            <BilingualText 
                              text={opt.text}
                              as="span"
                              enClassName={`font-semibold ${textClass}`} 
                              zhClassName={`text-sm opacity-80 ${textClass}`} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* #11 Fix: Explanation box with transition-colors */}
                  {!isUserCorrect && q.explanation && (
                    <div className="mt-6 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg transition-colors">
                      <BilingualText 
                        text={{ en: "Explanation", zh: "知識點解析" }} 
                        enClassName="text-sm font-bold text-blue-800 uppercase tracking-wide" 
                        zhClassName="text-xs text-blue-700 font-bold ml-2 inline-block" 
                      />
                      <div className="mt-2">
                        <BilingualText 
                          text={q.explanation} 
                          enClassName="text-gray-900 font-medium" 
                          zhClassName="text-gray-700 mt-1" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* #27 Fix: Floating "Back to Top" button */}
      {displayedQuestions.length > 3 && (
        <button
          onClick={scrollToTop}
          aria-label={showChinese ? "返回頂部" : "Back to top"}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gray-900/80 text-white shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center text-xl backdrop-blur-sm cursor-pointer border border-gray-700"
        >
          ↑
        </button>
      )}
    </div>
  );
}
