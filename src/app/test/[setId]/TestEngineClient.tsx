"use client";

import React, { useState, useEffect } from "react";
import { MockTestSet, Progress } from "@/types";
import BilingualText from "@/components/BilingualText";
import ResultsClient from "./ResultsClient";
import { calculateScore } from "@/utils/score";

import { safeGetItem, safeSetItem } from "@/utils/storage";

function readProgress(): Progress {
  const saved = safeGetItem("lifeinuk_progress");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse test progress", e);
    }
  }
  return {};
}

function writeProgress(progress: Progress) {
  safeSetItem("lifeinuk_progress", JSON.stringify(progress));
}

export default function TestEngineClient({ mockTest }: { mockTest: MockTestSet }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [score, setScore] = useState(0);

  const totalQuestions = mockTest.questions.length;
  const currentQuestion = mockTest.questions[currentIdx];
  const expectedAnswersCount = currentQuestion.options.filter(o => o.isCorrect).length;

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const finishTest = () => {
    const newScore = calculateScore(answers, mockTest);
    setScore(newScore);
    setIsFinished(true);

    const passed = newScore >= 18;
    const progress = readProgress();
    progress[mockTest.setId] = { score: newScore, passed, answers };
    writeProgress(progress);
  };

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => {
      const currentAnswer = prev[currentQuestion.id];
      if (expectedAnswersCount === 1) {
        return { ...prev, [currentQuestion.id]: optionId };
      } else {
        // Multi-select mode
        let currentArray = Array.isArray(currentAnswer) ? currentAnswer : [];
        if (currentArray.includes(optionId)) {
          return { ...prev, [currentQuestion.id]: currentArray.filter(id => id !== optionId) };
        } else {
          if (currentArray.length < expectedAnswersCount) {
            return { ...prev, [currentQuestion.id]: [...currentArray, optionId] };
          } else {
            // Replace the oldest selected option with the new one
            return { ...prev, [currentQuestion.id]: [...currentArray.slice(1), optionId] };
          }
        }
      }
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (isFinished) {
    return <ResultsClient mockTest={mockTest} answers={answers} score={score} />;
  }

  const progressPct = ((currentIdx + 1) / totalQuestions) * 100;

  return (
    <div className="flex flex-col flex-1">
      {/* 
        Fix: Overlap issue. 
        We enforce bg-[#f9fafb] to ensure the sticky header remains totally opaque.
      */}
      <div className="sticky top-[72px] z-10 bg-[#f9fafb] py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b border-gray-200 sm:border-0 shadow-sm sm:shadow-none">
        <div className="flex justify-between items-center mb-2">
          <BilingualText text={mockTest.title} enClassName="font-bold text-gray-800 text-xl" zhClassName="text-gray-600" />
          <div className="text-2xl font-bold text-red-700 tracking-wider font-mono bg-white px-3 py-1 rounded shadow-sm border border-red-100">
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="text-right text-sm text-gray-500 mt-1 font-medium">Question {currentIdx + 1} of {totalQuestions}</p>
      </div>

      <div className="mb-8">
        <BilingualText 
          text={currentQuestion.question} 
          enClassName="text-2xl font-bold text-gray-900 leading-snug" 
          zhClassName="text-xl text-gray-700 mt-2" 
        />
        {expectedAnswersCount > 1 && (
          <p className="mt-4 font-bold text-blue-700 bg-blue-50 inline-block px-4 py-2 rounded-lg">
            Choose {expectedAnswersCount} answers
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1 mb-8">
        {currentQuestion.options.map((opt) => {
          const currentAns = answers[currentQuestion.id];
          const isSelected = expectedAnswersCount === 1 
            ? currentAns === opt.id 
            : Array.isArray(currentAns) && currentAns.includes(opt.id);

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left min-h-[64px] p-4 rounded-xl border-2 transition-colors ${
                isSelected 
                  ? "border-blue-600 bg-blue-50" 
                  : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <BilingualText 
                text={opt.text} 
                enClassName={`text-lg ${isSelected ? "text-blue-900 font-bold" : "text-gray-800"}`} 
                zhClassName={`text-md mt-1 ${isSelected ? "text-blue-800 font-medium" : "text-gray-600"}`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
          disabled={currentIdx === 0}
          className="min-h-[56px] px-8 rounded-lg border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          Previous
        </button>
        {currentIdx === totalQuestions - 1 ? (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="min-h-[56px] px-8 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 text-lg shadow-md"
          >
            Submit Test
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx((p) => Math.min(totalQuestions - 1, p + 1))}
            className="min-h-[56px] px-8 rounded-lg border border-transparent bg-gray-900 text-white font-bold hover:bg-gray-800 text-lg shadow-md"
          >
            Next
          </button>
        )}
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <BilingualText 
              text={{ en: "Submit Test", zh: "提交考試" }} 
              enClassName="text-2xl font-bold text-gray-900" 
              zhClassName="text-xl text-gray-700 mt-1" 
            />
            <BilingualText 
              text={{ 
                en: "Are you sure you want to submit your test? You cannot change your answers after submitting.", 
                zh: "您確定要提交考試嗎？提交後將無法修改答案。" 
              }} 
              className="mt-4 mb-8"
              enClassName="text-gray-700"
              zhClassName="text-gray-500"
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 min-h-[48px] rounded-lg border border-gray-300 font-bold text-gray-700 bg-white hover:bg-gray-100"
              >
                Cancel / 取消
              </button>
              <button 
                onClick={() => {
                  setShowSubmitModal(false);
                  finishTest();
                }}
                className="flex-1 min-h-[48px] rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-md"
              >
                Submit / 提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
