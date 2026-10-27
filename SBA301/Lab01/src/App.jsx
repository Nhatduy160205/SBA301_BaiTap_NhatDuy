import AppFooter from "./components/AppFooter";
import AppNavbar from "./components/AppNavbar";
import HeroSection from "./components/HeroSection";
import OrchidExplorer from "./components/OrchidExplorer";
import OrchidList from "./components/OrchidList";
import UserContext from "./context/UserContext";
const currentUser = {
  name: "HanNHCE192048",
  role: "Learner"
};
function App() {
  return (
    <>
      <AppNavbar />
      <main>
        <OrchidList />
      </main>
      <AppFooter />
    </>
  );
}
export default App;