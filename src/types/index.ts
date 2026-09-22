export interface TranslatedText {
  en: string;
  zh: string;
}

export interface Option {
  id: string;
  text: TranslatedText;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  question: TranslatedText;
  options: Option[];
  explanation: TranslatedText;
  reference?: string;
}

export interface MockTestSet {
  setId: number;
  title: TranslatedText;
  questions: Question[];
}

export interface TestResult {
  score: number;
  passed: boolean;
  answers: Record<string, string | string[]>; // questionId -> optionId(s)
}

export type Progress = Record<number, TestResult>;

export interface StudyPoint {
  id: string;
  questionId: string;
  text: TranslatedText;
}

export interface StudyChapter {
  chapterId: number | string;
  title: TranslatedText;
  points: StudyPoint[];
}
