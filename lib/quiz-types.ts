/** Shape of a question row as stored in the Supabase `questions` table. */
export interface SupabaseQuestion {
  id: string;
  module_name: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
  created_at: string;
}

/** In-memory representation used by the quiz engine. */
export interface QuizQuestion {
  id: string;
  moduleName: string;
  questionText: string;
  choices: string[];
  correctIndex: number; // 0 = A, 1 = B, 2 = C, 3 = D
  explanation: string;
}

export const MODULE_NAMES = [
  "California Fireworks Law",
  "Pyrotechnic Chemistry",
  "Display Operations",
  "Emergency & Safety",
] as const;

export type ModuleName = (typeof MODULE_NAMES)[number];

/** Convert a Supabase row to the quiz-ready format. */
export function toQuizQuestion(row: SupabaseQuestion): QuizQuestion {
  const correctIndex =
    row.correct_answer === "A"
      ? 0
      : row.correct_answer === "B"
        ? 1
        : row.correct_answer === "C"
          ? 2
          : 3;

  return {
    id: row.id,
    moduleName: row.module_name,
    questionText: row.question_text,
    choices: [row.option_a, row.option_b, row.option_c, row.option_d],
    correctIndex,
    explanation: row.explanation,
  };
}