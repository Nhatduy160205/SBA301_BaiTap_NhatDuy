import React from "react";
import { Container } from "react-bootstrap";
import AppNavbar from "./components/AppNavbar";
import HeroSection from "./components/HeroSection";
import QuickStats from "./components/QuickStats";
import OrchidGallery from "./components/OrchidGallery";
import CareTips from "./components/CareTips";
import LearningAlert from "./components/LearningAlert";
import AppFooter from "./components/AppFooter";
import "./app.css";

function App() {
  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">
      <AppNavbar />
      <HeroSection />
      <Container className="flex-grow-1">
        <LearningAlert />
        <QuickStats />
        <OrchidGallery />
        <CareTips />
      </Container>
      <AppFooter />
    </div>
  );
}

export default App;
