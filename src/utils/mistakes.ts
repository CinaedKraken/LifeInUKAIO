import { Question } from "@/types";
import { safeGetItem, safeSetItem } from "./storage";

export interface MistakeItem {
  questionId: string;
  setId: number;
  question: Question;
  selectedAnswer: string | string[];
  failedAt: string;
}

const STORAGE_KEY = "lifeinuk_mistakes";

export function getMistakes(): Record<string, MistakeItem> {
  const data = safeGetItem(STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse mistakes", e);
    return {};
  }
}

export function getMistakesCount(): number {
  return Object.keys(getMistakes()).length;
}

export function recordTestResults(
  mockTest: { setId: number; questions: Question[] },
  answers: Record<string, string | string[]>
) {
  const currentMistakes = getMistakes();

  mockTest.questions.forEach((q) => {
    const userAnswer = answers[q.id.toString()];
    const correctOptionIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);

    let isCorrect = false;
    if (userAnswer) {
      if (Array.isArray(userAnswer)) {
        if (
          userAnswer.length === correctOptionIds.length &&
          userAnswer.every((id) => correctOptionIds.includes(id))
        ) {
          isCorrect = true;
        }
      } else {
        if (correctOptionIds.length === 1 && correctOptionIds[0] === userAnswer) {
          isCorrect = true;
        }
      }
    }

    if (isCorrect) {
      // If previously failed and now answered correctly, remove from mistakes (mastered!)
      if (currentMistakes[q.id.toString()]) {
        delete currentMistakes[q.id.toString()];
      }
    } else {
      // Add or update failed question
      currentMistakes[q.id.toString()] = {
        questionId: q.id.toString(),
        setId: mockTest.setId,
        question: q,
        selectedAnswer: userAnswer || "",
        failedAt: new Date().toISOString(),
      };
    }
  });

  safeSetItem(STORAGE_KEY, JSON.stringify(currentMistakes));
}

export function removeMistake(questionId: string) {
  const currentMistakes = getMistakes();
  if (currentMistakes[questionId]) {
    delete currentMistakes[questionId];
    safeSetItem(STORAGE_KEY, JSON.stringify(currentMistakes));
  }
}

export function clearAllMistakes() {
  safeSetItem(STORAGE_KEY, "{}");
}
