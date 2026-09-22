"use client";

import React from "react";
import Link from "next/link";
import { MockTestSet } from "@/types";
import BilingualText from "@/components/BilingualText";

interface ResultsClientProps {
  mockTest: MockTestSet;
  answers: Record<string, string | string[]>;
  score: number;
}

export default function ResultsClient({ mockTest, answers, score }: ResultsClientProps) {
  const passed = score >= 18;

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
          Score: {score} / 24 ({Math.round((score / 24) * 100)}%)
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review Questions</h2>
        <Link 
          href="/"
          prefetch={false}
          className="min-h-[48px] px-6 rounded-lg border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-100 flex items-center"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {mockTest.questions.map((q) => {
          const chosen = answers[q.id];
          const correctOpts = q.options.filter((o) => o.isCorrect).map(o => o.id);
          
          let isUserCorrect = false;
          if (correctOpts.length === 1) {
            isUserCorrect = chosen === correctOpts[0] || (Array.isArray(chosen) && chosen.length === 1 && chosen[0] === correctOpts[0]);
          } else {
            isUserCorrect = Array.isArray(chosen) && chosen.length === correctOpts.length && correctOpts.every(opt => chosen.includes(opt));
          }

          return (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
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
                        <div key={opt.id} className={`p-4 rounded-lg border ${borderClass} ${bgClass}`}>
                          <div className="flex items-start gap-2">
                            {isOptionChosen && !isOptionCorrect && <span className="font-bold text-red-600 mt-0.5 shrink-0">Your Answer:</span>}
                            {isOptionCorrect && <span className="font-bold text-green-700 mt-0.5 shrink-0">Correct Answer:</span>}
                            <BilingualText 
                              text={opt.text} 
                              enClassName={`font-semibold ${textClass}`} 
                              zhClassName={`text-sm opacity-80 ${textClass}`} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!isUserCorrect && q.explanation && (
                    <div className="mt-6 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
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
    </div>
  );
}
