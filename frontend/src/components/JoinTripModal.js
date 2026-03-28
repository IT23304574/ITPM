import React, { useState } from 'react';
import { joinTrip } from '../api';

const JoinTripModal = ({ tripId, isOpen, onClose, onJoinSuccess }) => {
  const [formData, setFormData] = useState({
    dropLocation: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send join request with details
      await joinTrip({ tripId, ...formData });
      
      if (onJoinSuccess) onJoinSuccess();
      setFormData({ dropLocation: '', phoneNumber: '' }); // Reset form
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error joining trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md relative shadow-2xl">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
            &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center text-white">Join Trip Details</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Phone Number (Required)</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter your contact number"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 text-sm">Early Drop Location (Optional)</label>
            <input
              type="text"
              name="dropLocation"
              value={formData.dropLocation}
              onChange={handleChange}
              placeholder="e.g., Main Junction"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold transition"
            >
              Cancel
            </button>
            <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition disabled:bg-gray-500"
            >
              {loading ? 'Joining...' : 'Accept & Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinTripModal;