import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useTheme } from "../context/ThemeContext";

function AppNavbar({ onOpenAddModal }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar bg={theme === "dark" ? "dark" : "primary"} variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#top" className="fw-bold d-flex align-items-center gap-2">
          📦 <span>Product Manager</span>
        </Navbar.Brand>
        <div className="d-flex align-items-center gap-2 ms-auto">
          <Button variant="outline-light" size="sm" onClick={onOpenAddModal}>
            + Add Product
          </Button>
          <Button variant="light" size="sm" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
