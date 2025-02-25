import { Exercise, Exam } from "../../types/exam";

// Helper function to convert File to Base64 for temporary storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to generate markdown content for an exercise
const generateExerciseMarkdown = (exercise: Exercise): string => {
  let markdown = `## Exercise ${exercise.orderNumber}\n\n`;
  markdown += `**Topic:** ${exercise.topic}\n`;
  markdown += `**Subtopic:** ${exercise.subtopic}\n`;
  markdown += `**Difficulty:** ${exercise.difficultyLevel}\n\n`;

  if (exercise.statement) {
    markdown += `### Statement\n\n${exercise.statement}\n\n`;
  }

  markdown += `### Question\n\n${exercise.question}\n\n`;

  if (exercise.isMultipleChoice) {
    markdown += `**Correct Answer:** ${exercise.correctAnswer}\n\n`;
  }

  markdown += `### Answer\n\n${exercise.answer}\n\n`;

  if (exercise.images && exercise.images.length > 0) {
    markdown += `### Images\n\n`;
    exercise.images.forEach((image) => {
      markdown += `- ${image.type}: ${image.path}\n`;
    });
  }

  markdown += `---\n\n`;
  return markdown;
};

// Helper function to generate markdown content for an exam
const generateExamMarkdown = (exam: Exam, exercises: Exercise[]): string => {
  let markdown = `# ${exam.subject} Exam (${exam.examYear})\n\n`;
  markdown += `School Year: ${exam.schoolYear}\n`;
  markdown += `Created: ${new Date(exam.createdAt).toLocaleDateString()}\n\n`;
  markdown += `---\n\n`;

  exercises.forEach((exercise) => {
    markdown += generateExerciseMarkdown(exercise);
  });

  return markdown;
};

// Function to save an image and return its path
export const saveImage = async (
  examId: string,
  exerciseId: string,
  type: "statement" | "question" | "answer",
  file: File
): Promise<string> => {
  try {
    // For now, we'll store images as base64 in localStorage
    // In a real app, this would upload to a server
    const base64 = await fileToBase64(file);
    const path = `/images/${examId}/${exerciseId}/${type}/${file.name}`;
    localStorage.setItem(`image_${path}`, base64);
    return path;
  } catch (error) {
    console.error("Failed to save image:", error);
    throw new Error("Failed to save image");
  }
};

// Function to get an image by path
export const getImage = (path: string): string | null => {
  return localStorage.getItem(`image_${path}`);
};

// Function to save exam content as markdown
export const saveExamMarkdown = (exam: Exam, exercises: Exercise[]): void => {
  try {
    const markdown = generateExamMarkdown(exam, exercises);
    localStorage.setItem(`markdown_${exam.id}`, markdown);
  } catch (error) {
    console.error("Failed to save markdown:", error);
    throw new Error("Failed to save markdown");
  }
};

// Function to get exam markdown content
export const getExamMarkdown = (examId: string): string | null => {
  return localStorage.getItem(`markdown_${examId}`);
};
