import { describe, it, expect } from "vitest";
import { calculateScore } from "../src/utils/score";
import { MockTestSet } from "../src/types";

describe("calculateScore", () => {
  it("should calculate the correct score", () => {
    const mockTest: MockTestSet = {
      setId: 1,
      title: { en: "Test", zh: "測試" },
      questions: [
        {
          id: "q1",
          question: { en: "Q1", zh: "問題 1" },
          explanation: { en: "A", zh: "B" },
          options: [
            { id: "A", text: { en: "Opt A", zh: "選項 A" }, isCorrect: true },
            { id: "B", text: { en: "Opt B", zh: "選項 B" }, isCorrect: false },
          ]
        },
        {
          id: "q2",
          question: { en: "Q2", zh: "問題 2" },
          explanation: { en: "A", zh: "B" },
          options: [
            { id: "C", text: { en: "Opt C", zh: "選項 C" }, isCorrect: false },
            { id: "D", text: { en: "Opt D", zh: "選項 D" }, isCorrect: true },
          ]
        }
      ]
    };

    const answers = {
      "q1": "A", // Correct
      "q2": "C"  // Incorrect
    };

    const score = calculateScore(answers, mockTest);
    expect(score).toBe(1);
  });
});
