import React, { useState } from 'react';
import { createTrip } from '../api';

const CreateTrip = ({ userId, onclose }) => {
  const [formData, setFormData] = useState({
    destination: '',
    vehicleType: 'TukTuk',
    totalFare: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTrip({ ...formData, userId });
    onclose(); // Close modal after success
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-6">Create a New Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full bg-slate-800 p-3 rounded border border-slate-700 text-white"
            placeholder="Where are you going?"
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            required
          />
          
          <select 
            className="w-full bg-slate-800 p-3 rounded border border-slate-700 text-white"
            onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
          >
            <option value="TukTuk">TukTuk (2 Seats)</option>
            <option value="Car">Car (3 Seats)</option>
            <option value="Van">Van (5 Seats)</option>
          </select>

          <input 
            type="number"
            className="w-full bg-slate-800 p-3 rounded border border-slate-700 text-white"
            placeholder="Estimated Total Fare (Rs.)"
            onChange={(e) => setFormData({...formData, totalFare: e.target.value})}
            required
          />

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onclose} className="flex-1 bg-slate-700 py-2 rounded font-bold text-white">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 py-2 rounded font-bold text-white">Post Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;