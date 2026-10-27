import React, { useState, useMemo } from "react";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import { eventService } from "./services/eventService";
import AppNavbar from "./components/AppNavbar";
import HeroSection from "./components/HeroSection";
import EventList from "./components/EventList";
import EventModal from "./components/EventModal";
import AppFooter from "./components/AppFooter";
import "./App.css";

function App() {
  const [allEvents] = useState(() => eventService.getAllEvents());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Business calculations delegated to Service layer
  const categories = useMemo(() => eventService.getCategories(allEvents), [allEvents]);
  const metrics = useMemo(() => eventService.getMetrics(allEvents), [allEvents]);

  const filteredEvents = useMemo(() => {
    return eventService.filterEvents(allEvents, {
      category: selectedCategory,
      keyword,
      onlyFeatured
    });
  }, [allEvents, selectedCategory, keyword, onlyFeatured]);

  const handleRegister = (eventId) => {
    const result = eventService.registerForEvent(registeredEventIds, eventId);
    if (result.success) {
      setRegisteredEventIds(result.registeredSet);
    }
    setToastMessage(result.message);
    setShowToast(true);
  };

  const handleReset = () => {
    setSelectedCategory("All");
    setKeyword("");
    setOnlyFeatured(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar registeredCount={registeredEventIds.size} />
      <HeroSection metrics={metrics} />
      <Container className="flex-grow-1">
        <EventList
          events={filteredEvents}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onlyFeatured={onlyFeatured}
          onToggleFeatured={setOnlyFeatured}
          onSelectEvent={setSelectedEvent}
          registeredEventIds={registeredEventIds}
          onReset={handleReset}
        />
      </Container>
      <EventModal
        event={selectedEvent}
        show={Boolean(selectedEvent)}
        onHide={() => setSelectedEvent(null)}
        onRegister={handleRegister}
        isRegistered={selectedEvent ? registeredEventIds.has(selectedEvent.id) : false}
      />
      <AppFooter />

      {/* Floating notification toast */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide bg="dark">
          <Toast.Header>
            <strong className="me-auto text-primary">🎓 EventHub</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
