import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { orchidService } from "./services/orchidService";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import OrchidsPage from "./pages/OrchidsPage";
import OrchidDetailPage from "./pages/OrchidDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardHome from "./pages/DashboardHome";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import OrchidModal from "./components/OrchidModal";
import "./styles/app.css";

function App() {
  const [favs, setFavs] = useState(() => orchidService.getFavorites());
  const [modalOrchid, setModalOrchid] = useState(null);

  const handleToggleFav = (id) => {
    const updated = orchidService.toggleFavorite(id);
    setFavs(updated);
  };

  const handleOpenModal = (orchid) => {
    setModalOrchid(orchid);
  };

  const handleCloseModal = () => {
    setModalOrchid(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout favCount={favs.length} />}>
          <Route
            index
            element={
              <HomePage
                favs={favs}
                onToggleFav={handleToggleFav}
                onOpenModal={handleOpenModal}
              />
            }
          />
          <Route
            path="orchids"
            element={
              <OrchidsPage
                favs={favs}
                onToggleFav={handleToggleFav}
                onOpenModal={handleOpenModal}
              />
            }
          />
          <Route
            path="orchids/:id"
            element={
              <OrchidDetailPage
                favs={favs}
                onToggleFav={handleToggleFav}
              />
            }
          />
          <Route
            path="dashboard"
            element={<DashboardLayout />}
          >
            <Route index element={<DashboardHome favCount={favs.length} />} />
            <Route
              path="favorites"
              element={
                <FavoritesPage
                  favs={favs}
                  onToggleFav={handleToggleFav}
                  onOpenModal={handleOpenModal}
                />
              }
            />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Lab 02 Bridge Modal */}
      <OrchidModal
        orchid={modalOrchid}
        show={Boolean(modalOrchid)}
        onHide={handleCloseModal}
        isFav={modalOrchid ? favs.includes(modalOrchid.id) : false}
        onToggleFav={handleToggleFav}
      />
    </BrowserRouter>
  );
}

export default App;
