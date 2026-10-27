import React from "react";
import { Container } from "react-bootstrap";
import { OrchidProvider } from "./context/OrchidContext";
import AppNavbar from "./components/AppNavbar";
import HeroSection from "./components/HeroSection";
import OrchidExplorer from "./components/OrchidExplorer";
import OrchidModal from "./components/OrchidModal";
import AppFooter from "./components/AppFooter";
import "./app.css";

function App() {
  return (
    <OrchidProvider>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <AppNavbar />
        <HeroSection />
        <Container className="flex-grow-1">
          <OrchidExplorer />
        </Container>
        <OrchidModal />
        <AppFooter />
      </div>
    </OrchidProvider>
  );
}

export default App;
