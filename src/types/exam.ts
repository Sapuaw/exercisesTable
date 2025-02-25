export interface Exam {
  id: string;
  subject: string;
  schoolYear: string;
  examYear: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  examId: string;
  orderNumber: number;
  topic: string;
  subtopic: string;
  isMultipleChoice: boolean;
  correctAnswer?: string;
  difficultyLevel: "Easy" | "Medium" | "Hard";
  statement?: string;
  question: string;
  answer: string;
  images?: ExerciseImage[];
}

export interface ExerciseImage {
  id: string;
  exerciseId: string;
  type: "statement" | "question" | "answer";
  path: string;
}

export interface CreateExamInput {
  subject: string;
  schoolYear: string;
  examYear: number;
}

export interface CreateExerciseInput {
  topic: string;
  subtopic: string;
  isMultipleChoice: boolean;
  correctAnswer?: string;
  difficultyLevel: "Easy" | "Medium" | "Hard";
  statement?: string;
  question: string;
  answer: string;
}
