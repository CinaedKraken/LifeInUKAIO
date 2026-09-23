import { Question } from "@/types";

/**
 * Check whether a user's answer to a question is correct.
 * Handles both single-answer and multi-answer question formats.
 */
export function isAnswerCorrect(
  question: Question,
  userAnswer: string | string[] | undefined
): boolean {
  if (!userAnswer) return false;

  const correctIds = question.options
    .filter((o) => o.isCorrect)
    .map((o) => o.id);

  if (correctIds.length === 1) {
    // Single correct answer
    if (Array.isArray(userAnswer)) {
      return userAnswer.length === 1 && userAnswer[0] === correctIds[0];
    }
    return userAnswer === correctIds[0];
  }

  // Multiple correct answers
  if (!Array.isArray(userAnswer)) return false;
  return (
    userAnswer.length === correctIds.length &&
    correctIds.every((id) => userAnswer.includes(id))
  );
}
