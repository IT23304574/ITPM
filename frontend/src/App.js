import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import ChangePassword from './pages/ChangePassword';
import Navbar from './components/Navbar';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        
        {/* Main application route */}
        <Route path="/" element={
          !user ? (
            <Home />
          ) : user.isFirstLogin ? (
            <Navigate to="/change-password" />
          ) : user.role === 'admin' ? (
            <AdminPanel />
          ) : (
            <Dashboard user={user} />
          )
        } />

        <Route path="/change-password" element={user ? <ChangePassword user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        {/* Explicit admin route for direct access */}
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;