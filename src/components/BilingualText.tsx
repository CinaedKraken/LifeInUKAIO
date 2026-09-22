"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { TranslatedText } from "@/types";

interface BilingualTextProps {
  text: TranslatedText | string; // If string, just render string
  className?: string;
  enClassName?: string;
  zhClassName?: string;
}

export default function BilingualText({ text, className = "", enClassName = "", zhClassName = "" }: BilingualTextProps) {
  const { showChinese } = useSettings();

  if (typeof text === "string") {
    return <div className={className}>{text}</div>;
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className={`font-semibold ${enClassName}`}>{text.en}</span>
      {showChinese && text.zh && (
        <span className={`text-gray-600 ${zhClassName}`}>{text.zh}</span>
      )}
    </div>
  );
}
