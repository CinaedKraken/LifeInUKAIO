"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function NavBar() {
  const { showChinese, toggleChinese, theme, toggleTheme } = useSettings();
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleInstallAvailable = () => setCanInstall(true);
    window.addEventListener("pwa-install-available", handleInstallAvailable);
    return () => {
      window.removeEventListener("pwa-install-available", handleInstallAvailable);
    };
  }, []);

  const triggerInstall = () => {
    window.dispatchEvent(new CustomEvent("trigger-pwa-install"));
  };

  return (
    <header className="header-nav bg-white shadow-xs sticky top-0 z-10 w-full transition-colors border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center gap-2">
        <Link href="/" prefetch={false} className="hover:opacity-75 transition-opacity mr-2 sm:mr-4 shrink-0" title="Back to Home">
          <h1 className="text-lg sm:text-xl font-bold header-title">Life in UK AIO</h1>
        </Link>
        <div className="flex-1 flex gap-3 sm:gap-4 px-1 sm:px-4 text-sm sm:text-base">
          <Link href="/" prefetch={false} className="font-bold nav-link transition-colors whitespace-nowrap">
            {showChinese ? "模擬考試" : "Tests"}
          </Link>
          <Link href="/study" prefetch={false} className="font-bold nav-link transition-colors whitespace-nowrap">
            {showChinese ? "溫習指南" : "Study"}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {canInstall && (
            <button
              onClick={triggerInstall}
              className="min-h-[44px] px-3 py-1.5 rounded-lg border border-blue-600 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
              title="Install App / 安裝應用程式"
            >
              <span>📲</span>
              <span>{showChinese ? "安裝" : "Install"}</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="min-h-[44px] w-[44px] rounded-lg border btn-tool text-base flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle theme mode"
            title={theme === "dark" ? "切換至淺色模式 (Switch to Light Mode)" : "切換至深色模式 (Switch to Dark Mode)"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={toggleChinese}
            className="min-h-[44px] px-3 sm:px-4 rounded-lg border btn-tool font-bold text-sm transition-colors cursor-pointer"
            aria-label="Toggle language mode"
            title="Toggle Language (A / 中)"
          >
            {showChinese ? "A / 中" : "A"}
          </button>
        </div>
      </div>
    </header>
  );
}
