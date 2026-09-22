import fs from "fs";
import path from "path";
import { MockTestSet } from "@/types";
import TestEngineClient from "./TestEngineClient";
import { notFound } from "next/navigation";

export const dynamicParams = false;

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
