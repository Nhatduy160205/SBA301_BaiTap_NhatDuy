import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import AppFooter from "../components/AppFooter";

function MainLayout({ favCount }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar favCount={favCount} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

export default MainLayout;
