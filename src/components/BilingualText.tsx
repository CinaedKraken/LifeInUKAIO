"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { TranslatedText } from "@/types";

interface BilingualTextProps {
  text: TranslatedText | string; // If string, just render string
  className?: string;
  enClassName?: string;
  zhClassName?: string;
  as?: "div" | "span";
}

export default function BilingualText({ text, className = "", enClassName = "", zhClassName = "", as = "div" }: BilingualTextProps) {
  const { showChinese } = useSettings();
  const Tag = as;

  if (typeof text === "string") {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={`flex flex-col gap-1 ${className}`}>
      <span className={`font-semibold ${enClassName}`}>{text.en}</span>
      {showChinese && text.zh && (
        <span className={`text-gray-600 ${zhClassName}`}>{text.zh}</span>
      )}
    </Tag>
  );
}
