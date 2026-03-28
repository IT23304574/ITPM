import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the session
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white tracking-tight">
        Student<span className="text-blue-500">Ride</span>
      </h1>
      <button 
        onClick={handleLogout}
        className="text-slate-400 hover:text-white text-sm font-medium transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;