// src/App.jsx
import NavBar from './components/NavBar';
import Orchids from './components/Orchids';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Orchids />
      </main>
      <footer className="bg-light text-center py-3 border-top mt-auto text-muted">
        <small>SBA301 - Lab 02: Orchid Gallery SPA &copy; 2026</small>
      </footer>
    </div>
  );
}
