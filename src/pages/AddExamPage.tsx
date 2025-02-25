import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateExamInput } from "../types/exam";
import { createExam } from "../services/storage/examStorage";

export const AddExamPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateExamInput>({
    subject: "",
    schoolYear: "",
    examYear: new Date().getFullYear(),
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateExamInput, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateExamInput, string>> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.schoolYear.trim()) {
      newErrors.schoolYear = "School year is required";
    } else if (!/^\d{4}-\d{4}$/.test(formData.schoolYear)) {
      newErrors.schoolYear = "School year must be in format YYYY-YYYY";
    }

    const currentYear = new Date().getFullYear();
    if (!formData.examYear) {
      newErrors.examYear = "Exam year is required";
    } else if (
      formData.examYear < 2000 ||
      formData.examYear > currentYear + 1
    ) {
      newErrors.examYear = `Exam year must be between 2000 and ${
        currentYear + 1
      }`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const exam = createExam(formData);
      navigate(`/exam/${exam.id}`);
    } catch (error) {
      console.error("Failed to create exam:", error);
      // In a real app, we'd show a proper error message to the user
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Exam</h1>
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => {
                setFormData({ ...formData, subject: e.target.value });
                if (errors.subject) {
                  setErrors({ ...errors, subject: undefined });
                }
              }}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.subject
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
              required
            />
            {errors.subject && (
              <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="schoolYear"
              className="block text-sm font-medium text-gray-700"
            >
              School Year (YYYY-YYYY)
            </label>
            <input
              type="text"
              id="schoolYear"
              placeholder="2023-2024"
              value={formData.schoolYear}
              onChange={(e) => {
                setFormData({ ...formData, schoolYear: e.target.value });
                if (errors.schoolYear) {
                  setErrors({ ...errors, schoolYear: undefined });
                }
              }}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.schoolYear
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
              required
            />
            {errors.schoolYear && (
              <p className="mt-2 text-sm text-red-600">{errors.schoolYear}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="examYear"
              className="block text-sm font-medium text-gray-700"
            >
              Exam Year
            </label>
            <input
              type="number"
              id="examYear"
              value={formData.examYear}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  examYear: parseInt(e.target.value),
                });
                if (errors.examYear) {
                  setErrors({ ...errors, examYear: undefined });
                }
              }}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.examYear
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
              required
            />
            {errors.examYear && (
              <p className="mt-2 text-sm text-red-600">{errors.examYear}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
