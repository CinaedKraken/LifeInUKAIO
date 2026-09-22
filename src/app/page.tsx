import React from "react";
import fs from "fs";
import path from "path";
import { MockTestSet } from "@/types";
import BilingualText from "@/components/BilingualText";
import DashboardClient from "./DashboardClient";

export default function Home() {
  let mockTests: MockTestSet[] = [];
  try {
    const filePath = path.join(process.cwd(), "src", "data", "mock_tests.json");
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      mockTests = JSON.parse(fileContents);
    }
  } catch (e) {
    console.error("Failed to load mock tests", e);
  }

  // If no tests are generated yet, provide a fallback for testing the UI
  if (mockTests.length === 0) {
    mockTests = [
      {
        setId: 1,
        title: { en: "Mock Exam Set 1", zh: "模擬考試 第一套" },
        questions: []
      },
      {
        setId: 2,
        title: { en: "Mock Exam Set 2", zh: "模擬考試 第二套" },
        questions: []
      }
    ];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <BilingualText 
          text={{ en: "Welcome to Life in the UK Mock Tests", zh: "歡迎來到英國生活模擬考試" }} 
          enClassName="text-2xl font-bold text-gray-900" 
          zhClassName="text-xl text-gray-700 mt-1"
        />
        <BilingualText 
          text={{ en: "Select a test set below to begin your practice. Pass mark is 75% (18/24).", zh: "請在下方選擇一套試題開始練習。及格分數為75%（18/24）。" }} 
          className="mt-4"
        />
        <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">關於本模擬考試平台：</p>
          <p className="leading-relaxed">本網站是專為準備「Life in the UK」入籍試的香港人而設的免費雙語練習平台。收錄 18 套共 444 題完整的英文及繁體中文對照題目，並附有詳細答案解析與倒計時功能。建議將此網頁「儲存至主畫面」，即可獲得如原生手機 App 般的流暢使用體驗。</p>
        </div>
      </div>
      <DashboardClient mockTests={mockTests} />
    </div>
  );
}
