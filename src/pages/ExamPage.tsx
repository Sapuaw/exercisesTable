import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exam, Exercise } from "../types/exam";
import {
  getExamById,
  getExercisesByExamId,
} from "../services/storage/examStorage";

export const ExamPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!id) return;

    const examData = getExamById(id);
    if (!examData) {
      navigate("/");
      return;
    }

    setExam(examData);
    setExercises(getExercisesByExamId(id));
  }, [id, navigate]);

  if (!exam) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Exame {exam.subject} {exam.examYear}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              School Year: {exam.schoolYear}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Created: {new Date(exam.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={() => navigate(`/exam/${id}/add-exercise`)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Exercise
          </button>
        </div>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No exercises
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new exercise.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate(`/exam/${id}/add-exercise`)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Exercise
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {exercises.map((exercise) => (
              <li key={exercise.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        Exercise {exercise.orderNumber}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {exercise.topic} - {exercise.subtopic}
                      </p>
                    </div>
                    <div className="flex items-center">
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
                      <button
                        onClick={() =>
                          navigate(`/exam/${id}/exercise/${exercise.id}`)
                        }
                        className="ml-4 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
