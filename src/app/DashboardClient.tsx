"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Progress, TranslatedText } from "@/types";
import BilingualText from "@/components/BilingualText";
import { safeGetItem } from "@/utils/storage";
import { getMistakesCount } from "@/utils/mistakes";
import { useSettings } from "@/context/SettingsContext";

interface TestSetSummary {
  setId: number;
  title: TranslatedText;
}

interface DashboardClientProps {
  mockTests: TestSetSummary[];
}

export default function DashboardClient({ mockTests }: DashboardClientProps) {
  const { showChinese } = useSettings();
  const [progress, setProgress] = useState<Progress>({});
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  useEffect(() => {
    const saved = safeGetItem("lifeinuk_progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setMistakesCount(getMistakesCount());
  }, []);

  return (
    <div className="grid gap-4">
      {/* Mistakes Bank Quick Card */}
      <Link
        href="/mistakes"
        prefetch={false}
        className="block border border-amber-300 dark:border-amber-700/60 rounded-xl p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-950/40 dark:hover:to-orange-950/30 transition-all shadow-sm focus:ring-4 focus:ring-amber-200"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📕</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {showChinese ? "錯題溫習庫" : "Mistakes Bank"}
                </h2>
                {showChinese && (
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                    Mistakes Bank
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {showChinese
                  ? "自動記錄模擬考試答錯的題目，隨時重點複習攻克弱點"
                  : "Auto-saved failed exam questions. Focus and master your weak spots."}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 self-start sm:self-center">
            {mistakesCount > 0 ? (
              <span className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm text-sm transition-colors">
                {showChinese ? `${mistakesCount} 題待複習` : `${mistakesCount} to review`} →
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white font-medium rounded-lg text-sm">
                {showChinese ? "✓ 暫無錯題" : "✓ No Mistakes"}
              </span>
            )}
          </div>
        </div>
      </Link>

      {mockTests.map((set) => {
        const result = progress[set.setId];
        const status = result
          ? result.passed
            ? "passed"
            : "failed"
          : "not-started";

        return (
          <Link
            key={set.setId}
            href={`/test/${set.setId}`}
            prefetch={false}
            className="block border border-gray-200 rounded-lg p-6 bg-white hover:bg-gray-50 transition-colors shadow-sm focus:ring-4 focus:ring-blue-200 min-h-[48px]"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <BilingualText
                text={set.title}
                enClassName="text-xl font-medium"
                zhClassName="text-lg"
              />
              <div className="flex-shrink-0">
                {status === "passed" && (
                  <span className="inline-block px-4 py-2 bg-green-800 text-white font-medium rounded min-h-[48px] flex items-center justify-center">
                    Passed: {result?.score}/24
                  </span>
                )}
                {status === "failed" && (
                  <span className="inline-block px-4 py-2 bg-red-800 text-white font-medium rounded min-h-[48px] flex items-center justify-center">
                    Failed: {result?.score}/24
                  </span>
                )}
                {status === "not-started" && (
                  <span className="inline-block px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded min-h-[48px] flex items-center justify-center">
                    Not Started
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
