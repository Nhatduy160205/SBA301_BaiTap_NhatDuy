import CourseHeader from "./components/CourseHeader";
import StudentProfile from "./components/StudentProfile";
import LearningChecklist from "./components/LearningChecklist";
import EnvironmentStatus from "./components/EnvironmentStatus";
import ProjectSummary from "./components/ProjectSummary";
import ArchitectureFlow from "./components/ArchitectureFlow";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="dashboard-container">
      <CourseHeader />
      <main className="dashboard-grid">
        <StudentProfile />
        <EnvironmentStatus />
        <LearningChecklist />
        <ProjectSummary />
        <ArchitectureFlow />
      </main>
      <Footer />
    </div>
  );
}

export default App;
