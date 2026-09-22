import React from "react";
import type { Metadata } from "next";
import MistakesClient from "./MistakesClient";

export const metadata: Metadata = {
  title: "錯題溫習庫 | Life in UK AIO",
  description: "Review your failed mock exam questions and master them.",
};

export default function MistakesPage() {
  return <MistakesClient />;
}
