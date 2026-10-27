import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ListOfOrchids from "./pages/ListOfOrchids";
import EditOrchid from "./pages/EditOrchid";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/orchids" replace />} />
        <Route path="/orchids" element={<ListOfOrchids />} />
        <Route path="/orchids/:id/edit" element={<EditOrchid />} />
      </Routes>
    </>
  );
}
