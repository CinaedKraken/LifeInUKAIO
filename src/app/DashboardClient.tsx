"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MockTestSet, Progress } from "@/types";
import BilingualText from "@/components/BilingualText";
import { safeGetItem } from "@/utils/storage";

interface DashboardClientProps {
  mockTests: MockTestSet[];
}

export default function DashboardClient({ mockTests }: DashboardClientProps) {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    const saved = safeGetItem("lifeinuk_progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  return (
    <div className="grid gap-4">
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
