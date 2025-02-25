import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateExerciseInput } from "../types/exam";
import { createExercise, getExamById } from "../services/storage/examStorage";

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;

export const AddExercisePage = () => {
  const navigate = useNavigate();
  const { id: examId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateExerciseInput>({
    topic: "",
    subtopic: "",
    isMultipleChoice: false,
    difficultyLevel: "Medium",
    statement: "",
    question: "",
    answer: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateExerciseInput, string>>
  >({});
  const [imageUploads, setImageUploads] = useState<{
    statement?: File;
    question?: File;
    answer?: File;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) {
      navigate("/");
      return;
    }

    const exam = getExamById(examId);
    if (!exam) {
      navigate("/");
      return;
    }
  }, [examId, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateExerciseInput, string>> = {};

    if (!formData.topic.trim()) {
      newErrors.topic = "Topic is required";
    }

    if (!formData.subtopic.trim()) {
      newErrors.subtopic = "Subtopic is required";
    }

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    if (formData.isMultipleChoice && !formData.correctAnswer) {
      newErrors.correctAnswer =
        "Correct answer is required for multiple choice questions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm() || !examId) {
      return;
    }

    setIsLoading(true);

    try {
      await createExercise(examId, formData, imageUploads);
      navigate(`/exam/${examId}`);
    } catch (error) {
      console.error("Failed to create exercise:", error);
      setSubmitError("Failed to create exercise. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (
    type: "statement" | "question" | "answer",
    file: File
  ) => {
    setImageUploads((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Add New Exercise
          </h2>
        </div>
      </div>

      {submitError && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700"
              >
                Topic
              </label>
              <input
                type="text"
                id="topic"
                value={formData.topic}
                onChange={(e) => {
                  setFormData({ ...formData, topic: e.target.value });
                  if (errors.topic) setErrors({ ...errors, topic: undefined });
                }}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.topic
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.topic && (
                <p className="mt-2 text-sm text-red-600">{errors.topic}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="subtopic"
                className="block text-sm font-medium text-gray-700"
              >
                Subtopic
              </label>
              <input
                type="text"
                id="subtopic"
                value={formData.subtopic}
                onChange={(e) => {
                  setFormData({ ...formData, subtopic: e.target.value });
                  if (errors.subtopic)
                    setErrors({ ...errors, subtopic: undefined });
                }}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.subtopic
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.subtopic && (
                <p className="mt-2 text-sm text-red-600">{errors.subtopic}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Question Type
              </label>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMultipleChoice"
                    checked={formData.isMultipleChoice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isMultipleChoice: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isMultipleChoice"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Multiple Choice
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="difficultyLevel"
                className="block text-sm font-medium text-gray-700"
              >
                Difficulty Level
              </label>
              <select
                id="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficultyLevel: e.target
                      .value as (typeof DIFFICULTY_LEVELS)[number],
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.isMultipleChoice && (
            <div>
              <label
                htmlFor="correctAnswer"
                className="block text-sm font-medium text-gray-700"
              >
                Correct Answer
              </label>
              <input
                type="text"
                id="correctAnswer"
                value={formData.correctAnswer || ""}
                onChange={(e) => {
                  setFormData({ ...formData, correctAnswer: e.target.value });
                  if (errors.correctAnswer)
                    setErrors({ ...errors, correctAnswer: undefined });
                }}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.correctAnswer
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.correctAnswer && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.correctAnswer}
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="statement"
              className="block text-sm font-medium text-gray-700"
            >
              Statement (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="statement"
                rows={3}
                value={formData.statement || ""}
                onChange={(e) =>
                  setFormData({ ...formData, statement: e.target.value })
                }
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload("statement", file);
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
            <div className="mt-1">
              <textarea
                id="question"
                rows={3}
                value={formData.question}
                onChange={(e) => {
                  setFormData({ ...formData, question: e.target.value });
                  if (errors.question)
                    setErrors({ ...errors, question: undefined });
                }}
                className={`shadow-sm block w-full sm:text-sm rounded-md ${
                  errors.question
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                required
              />
            </div>
            {errors.question && (
              <p className="mt-2 text-sm text-red-600">{errors.question}</p>
            )}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload("question", file);
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700"
            >
              Answer
            </label>
            <div className="mt-1">
              <textarea
                id="answer"
                rows={3}
                value={formData.answer}
                onChange={(e) => {
                  setFormData({ ...formData, answer: e.target.value });
                  if (errors.answer)
                    setErrors({ ...errors, answer: undefined });
                }}
                className={`shadow-sm block w-full sm:text-sm rounded-md ${
                  errors.answer
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                required
              />
            </div>
            {errors.answer && (
              <p className="mt-2 text-sm text-red-600">{errors.answer}</p>
            )}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload("answer", file);
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/exam/${examId}`)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Exercise...
                </>
              ) : (
                "Create Exercise"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
