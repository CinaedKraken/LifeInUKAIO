import React from "react";
import type { Metadata } from "next";
import { StudyProvider } from "@/context/StudyContext";

export const metadata: Metadata = {
  title: "溫習指南 Study Guide | Life in UK AIO",
  description: "Comprehensive bilingual study guide covering all official Life in the UK test syllabus chapters with key learning points.",
};

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudyProvider>
      {children}
    </StudyProvider>
  );
}
