import React from "react";
import { StudyProvider } from "@/context/StudyContext";

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudyProvider>
      {children}
    </StudyProvider>
  );
}
