import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import './index.css'; // Ensure Tailwind is imported here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* The App component now handles all the routing logic for the application */}
    <App />
  </BrowserRouter>
);