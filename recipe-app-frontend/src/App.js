// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';   // Import styles

import Feed from './pages/Feed';
import CreateRecipe from './pages/CreateRecipe';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import RequireAuth from './components/RequireAuth';

// ✅ Logout helper
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

export default function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="app-wrapper">
      {/* Header / Navbar */}
      <header className="header">
        <div className="container nav-bar">
          <div className="brand">🍴 Savorly</div>
          <nav className="nav-links">
            <Link to="/">Feed</Link>
            <Link to="/create">Create</Link>
            {isLoggedIn ? (
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route
            path="/create"
            element={
              <RequireAuth>
                <CreateRecipe />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} RecipeShare. Built with ❤️ in React.</p>
      </footer>
    </div>
  );
}
