"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { safeGetItem, safeSetItem } from "@/utils/storage";

interface SettingsContextType {
  showChinese: boolean;
  toggleChinese: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showChinese, setShowChinese] = useState<boolean>(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedLang = safeGetItem("lifeinuk_showChinese");
    if (savedLang !== null) {
      setShowChinese(savedLang === "true");
    }

    const savedTheme = safeGetItem("lifeinuk_theme") as "light" | "dark" | null;
    const systemDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemDark ? "dark" : "light");
    
    setTheme(initialTheme);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleChinese = () => {
    setShowChinese((prev) => {
      const next = !prev;
      safeSetItem("lifeinuk_showChinese", next.toString());
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      safeSetItem("lifeinuk_theme", next);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", next);
      }
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ showChinese, toggleChinese, theme, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
