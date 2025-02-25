import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Exam } from "../types/exam";
import { getExams } from "../services/storage/examStorage";

export const HomePage = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    // Load exams from storage
    setExams(getExams());
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Exams</h1>
      {exams.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No exams</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new exam.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate("/add-exam")}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Exam
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Exame {exam.subject} {exam.examYear}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                School Year: {exam.schoolYear}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(exam.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => navigate(`/exam/${exam.id}`)}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
