import React, { useState } from 'react';
import { registerStudent } from '../api';

const AdminPanel = () => {
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerStudent({ studentId });
      setStatus(`Success: ${studentId} registered with default password.`);
      setStudentId('');
    } catch (err) {
      setStatus("Error: Student ID might already exist.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-10 flex flex-col items-center">
      <div className="bg-slate-900 p-10 rounded-2xl border border-slate-800 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-2">Admin: Register Student</h1>
        <p className="text-slate-400 mb-8">Add new student IDs to the system.</p>
        
        <form onSubmit={handleRegister} className="flex gap-2">
          <input 
            className="flex-1 bg-slate-800 p-3 rounded border border-slate-700 text-white"
            placeholder="Enter Student ID (e.g. STU1001)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <button className="bg-emerald-600 px-6 py-3 rounded font-bold text-white">Add</button>
        </form>
        {status && <p className="mt-6 text-sm text-blue-400">{status}</p>}
      </div>
    </div>
  );
};

export default AdminPanel;