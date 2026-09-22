import { MockTestSet } from "../types";

export function calculateScore(answers: Record<string, string | string[]>, mockTest: MockTestSet) {
  let score = 0;
  mockTest.questions.forEach((q) => {
    const chosen = answers[q.id];
    const correctOpts = q.options.filter((o) => o.isCorrect).map(o => o.id);
    
    if (correctOpts.length === 1) {
      if (chosen === correctOpts[0] || (Array.isArray(chosen) && chosen.length === 1 && chosen[0] === correctOpts[0])) {
        score++;
      }
    } else {
      // Multiple correct answers expected
      if (Array.isArray(chosen) && chosen.length === correctOpts.length) {
        const isAllCorrect = correctOpts.every(opt => chosen.includes(opt));
        if (isAllCorrect) score++;
      }
    }
  });
  return score;
}
