import { MockTestSet } from "../types";
import { isAnswerCorrect } from "./answer";

export function calculateScore(answers: Record<string, string | string[]>, mockTest: MockTestSet) {
  let score = 0;
  mockTest.questions.forEach((q) => {
    if (isAnswerCorrect(q, answers[q.id])) {
      score++;
    }
  });
  return score;
}
