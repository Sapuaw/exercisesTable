import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exercise, Exam } from "../types/exam";
import {
  getExamById,
  getExercisesByExamId,
} from "../services/storage/examStorage";
import { getImage } from "../services/storage/fileStorage";

export const ExerciseDetailPage = () => {
  const { id: examId, exerciseId } = useParams<{
    id: string;
    exerciseId: string;
  }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!examId || !exerciseId) {
          navigate("/");
          return;
        }

        const examData = getExamById(examId);
        if (!examData) {
          navigate("/");
          return;
        }

        const exercises = getExercisesByExamId(examId);
        const exerciseData = exercises.find((e) => e.id === exerciseId);
        if (!exerciseData) {
          navigate(`/exam/${examId}`);
          return;
        }

        // Load images
        const imagePromises = exerciseData.images?.map(async (image) => {
          const base64Data = getImage(image.path);
          if (base64Data) {
            setImageData((prev) => ({
              ...prev,
              [image.path]: base64Data,
            }));
          }
        });

        if (imagePromises) {
          await Promise.all(imagePromises);
        }

        setExam(examData);
        setExercise(exerciseData);
      } catch (err) {
        console.error("Failed to load exercise:", err);
        setError("Failed to load exercise details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [examId, exerciseId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
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
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!exam || !exercise) {
    return null;
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Exercise {exercise.orderNumber}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              {exercise.topic} - {exercise.subtopic}
            </div>
            <div className="mt-2 flex items-center">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  exercise.difficultyLevel === "Easy"
                    ? "bg-green-100 text-green-800"
                    : exercise.difficultyLevel === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {exercise.difficultyLevel}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={() => navigate(`/exam/${examId}`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Exam
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Exercise Details
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {exercise.statement && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">Statement</h4>
              <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                {exercise.statement}
              </div>
              {exercise.images?.some((img) => img.type === "statement") && (
                <div className="mt-2">
                  {exercise.images
                    .filter((img) => img.type === "statement")
                    .map((img) => (
                      <img
                        key={img.id}
                        src={imageData[img.path]}
                        alt="Statement illustration"
                        className="max-w-full h-auto rounded-lg shadow-sm"
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500">Question</h4>
            <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
              {exercise.question}
            </div>
            {exercise.images?.some((img) => img.type === "question") && (
              <div className="mt-2">
                {exercise.images
                  .filter((img) => img.type === "question")
                  .map((img) => (
                    <img
                      key={img.id}
                      src={imageData[img.path]}
                      alt="Question illustration"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  ))}
              </div>
            )}
          </div>

          {exercise.isMultipleChoice && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">
                Correct Answer
              </h4>
              <div className="mt-2 text-sm text-gray-900">
                {exercise.correctAnswer}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-500">Answer/Tips</h4>
            <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
              {exercise.answer}
            </div>
            {exercise.images?.some((img) => img.type === "answer") && (
              <div className="mt-2">
                {exercise.images
                  .filter((img) => img.type === "answer")
                  .map((img) => (
                    <img
                      key={img.id}
                      src={imageData[img.path]}
                      alt="Answer illustration"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
