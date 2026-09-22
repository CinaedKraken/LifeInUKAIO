"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        const isGitHubPages = window.location.pathname.startsWith("/LifeInUKAIO");
        const swUrl = isGitHubPages ? "/LifeInUKAIO/sw.js" : "/sw.js";
        const swScope = isGitHubPages ? "/LifeInUKAIO/" : "/";

        navigator.serviceWorker
          .register(swUrl, { scope: swScope })
          .then((reg) => {
            console.log("Life in UK AIO Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("Service Worker registration failed:", err);
          });
      });
    }

    // 2. Online / Offline status listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    // 3. PWA Install Prompt handling
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
      window.dispatchEvent(new CustomEvent("pwa-install-available"));
    };

    const handleTriggerInstall = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            setCanInstall(false);
          }
          deferredPrompt = null;
        });
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("trigger-pwa-install", handleTriggerInstall);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("trigger-pwa-install", handleTriggerInstall);
    };
  }, []);

  return (
    <>
      {/* Offline Toast Notification */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg border border-gray-700 flex items-center gap-2 backdrop-blur-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>離線模式：所有試題與溫習指南均可正常使用 (Offline Mode)</span>
        </div>
      )}
    </>
  );
}
