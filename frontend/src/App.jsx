import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from './components/Profile';
import Leaderboards from './components/Leaderboards';
import Tournaments from './components/Tournaments';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">♔ Lichess Dashboard</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Profile</Link>
              <Link to="/leaderboards" className="nav-link">Leaderboards</Link>
              <Link to="/tournaments" className="nav-link">Tournaments</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/tournaments" element={<Tournaments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
