import {
  Exam,
  CreateExamInput,
  Exercise,
  CreateExerciseInput,
  ExerciseImage,
} from "../../types/exam";
import { saveImage, saveExamMarkdown } from "./fileStorage";

const EXAMS_STORAGE_KEY = "exams";
const EXERCISES_STORAGE_KEY = "exercises";

// Helper function to generate UUID
const generateId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Helper functions to manage localStorage
const getStoredExams = (): Exam[] => {
  const exams = localStorage.getItem(EXAMS_STORAGE_KEY);
  return exams ? JSON.parse(exams) : [];
};

const getStoredExercises = (): Exercise[] => {
  const exercises = localStorage.getItem(EXERCISES_STORAGE_KEY);
  return exercises ? JSON.parse(exercises) : [];
};

const storeExams = (exams: Exam[]): void => {
  localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
};

const storeExercises = (exercises: Exercise[]): void => {
  localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(exercises));
};

// Exam management functions
export const createExam = (input: CreateExamInput): Exam => {
  const exams = getStoredExams();
  const now = new Date();

  const newExam: Exam = {
    id: generateId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  exams.push(newExam);
  storeExams(exams);

  // Create initial markdown file
  saveExamMarkdown(newExam, []);

  return newExam;
};

export const getExams = (): Exam[] => {
  return getStoredExams();
};

export const getExamById = (id: string): Exam | undefined => {
  const exams = getStoredExams();
  return exams.find((exam) => exam.id === id);
};

// Exercise management functions
export const createExercise = async (
  examId: string,
  input: CreateExerciseInput,
  imageFiles?: {
    statement?: File;
    question?: File;
    answer?: File;
  }
): Promise<Exercise> => {
  const exercises = getStoredExercises();
  const examExercises = exercises.filter((ex) => ex.examId === examId);
  const exerciseId = generateId();

  const images: ExerciseImage[] = [];

  // Handle image uploads
  if (imageFiles) {
    try {
      if (imageFiles.statement) {
        const path = await saveImage(
          examId,
          exerciseId,
          "statement",
          imageFiles.statement
        );
        images.push({ id: generateId(), exerciseId, type: "statement", path });
      }
      if (imageFiles.question) {
        const path = await saveImage(
          examId,
          exerciseId,
          "question",
          imageFiles.question
        );
        images.push({ id: generateId(), exerciseId, type: "question", path });
      }
      if (imageFiles.answer) {
        const path = await saveImage(
          examId,
          exerciseId,
          "answer",
          imageFiles.answer
        );
        images.push({ id: generateId(), exerciseId, type: "answer", path });
      }
    } catch (error) {
      console.error("Failed to save images:", error);
      throw new Error("Failed to save one or more images");
    }
  }

  const newExercise: Exercise = {
    id: exerciseId,
    examId,
    orderNumber: examExercises.length + 1,
    ...input,
    images,
  };

  exercises.push(newExercise);
  storeExercises(exercises);

  // Update markdown file
  const exam = getExamById(examId);
  if (exam) {
    const updatedExercises = getExercisesByExamId(examId);
    saveExamMarkdown(exam, updatedExercises);
  }

  return newExercise;
};

export const getExercisesByExamId = (examId: string): Exercise[] => {
  const exercises = getStoredExercises();
  return exercises
    .filter((exercise) => exercise.examId === examId)
    .sort((a, b) => a.orderNumber - b.orderNumber);
};

export const getExerciseById = (exerciseId: string): Exercise | undefined => {
  const exercises = getStoredExercises();
  return exercises.find((exercise) => exercise.id === exerciseId);
};
