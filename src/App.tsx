import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/common/Layout";
import { HomePage } from "./pages/HomePage";
import { AddExamPage } from "./pages/AddExamPage";
import { ExamPage } from "./pages/ExamPage";
import { AddExercisePage } from "./pages/AddExercisePage";
import { ExerciseDetailPage } from "./pages/ExerciseDetailPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-exam" element={<AddExamPage />} />
          <Route path="/exam/:id" element={<ExamPage />} />
          <Route path="/exam/:id/add-exercise" element={<AddExercisePage />} />
          <Route
            path="/exam/:id/exercise/:exerciseId"
            element={<ExerciseDetailPage />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
