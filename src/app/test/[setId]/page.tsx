import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { MockTestSet } from "@/types";
import TestEngineClient from "./TestEngineClient";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateMetadata(props: { params: Promise<{ setId: string }> }): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Mock Exam Set ${params.setId} | Life in UK AIO`,
    description: `Practice Life in the UK citizenship test with bilingual Mock Exam Set ${params.setId}. 24 questions, 45-minute timer, instant results.`,
  };
}

export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "mock_tests.json");
    if (!fs.existsSync(filePath)) return [];
    const fileContents = fs.readFileSync(filePath, "utf8");
    const mockTests: MockTestSet[] = JSON.parse(fileContents);
    return mockTests.map((test) => ({
      setId: test.setId.toString(),
    }));
  } catch {
    return [];
  }
}

export default async function TestPage(props: { params: Promise<{ setId: string }> }) {
  const params = await props.params;
  const setId = parseInt(params.setId, 10);
  
  let mockTest: MockTestSet | undefined;
  try {
    const filePath = path.join(process.cwd(), "src", "data", "mock_tests.json");
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const mockTests: MockTestSet[] = JSON.parse(fileContents);
      mockTest = mockTests.find((t) => t.setId === setId);
    }
  } catch (e) {
    console.error(e);
  }

  if (!mockTest) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
      <TestEngineClient mockTest={mockTest} />
    </div>
  );
}
