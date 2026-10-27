import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import ListOfOrchids from "./components/ListOfOrchids.jsx";
import EditOrchid from "./components/EditOrchid.jsx";

export default function App() {
  return (
    <>
      <NavBar />
      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<ListOfOrchids />} />
          <Route path="/orchids/:id/edit" element={<EditOrchid />} />
          <Route path="/orchids/new" element={<EditOrchid createMode />} />
        </Routes>
      </div>
    </>
  );
}
