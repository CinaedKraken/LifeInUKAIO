"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
  showChinese: boolean;
  toggleChinese: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

import { safeGetItem, safeSetItem } from "@/utils/storage";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showChinese, setShowChinese] = useState<boolean>(true);

  // Load from localStorage on mount, but never block rendering on it.
  useEffect(() => {
    const saved = safeGetItem("lifeinuk_showChinese");
    if (saved !== null) {
      setShowChinese(saved === "true");
    }
  }, []);

  const toggleChinese = () => {
    setShowChinese((prev) => {
      const next = !prev;
      safeSetItem("lifeinuk_showChinese", next.toString());
      return next;
    });
  };


  return (
    <SettingsContext.Provider value={{ showChinese, toggleChinese }}>
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
