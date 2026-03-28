import React, { useState } from 'react';
import { createTrip } from '../api';
import LocationPicker from './LocationPicker';

const CreateTripModal = ({ onClose, onTripCreated }) => {
  const [formData, setFormData] = useState({
    startLocation: '',
    phoneNumber: '',
    destination: '',
    vehicleType: 'TukTuk',
    totalFare: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pickingField, setPickingField] = useState(null); // 'startLocation' or 'destination'

  const vehicleOptions = ['TukTuk', 'Small Car', 'Medium Car', 'Van'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Retrieve profile details from localStorage to attach to the trip
    const profileData = {
      organizerGender: localStorage.getItem('user_profile_gender'),
      organizerAge: localStorage.getItem('user_profile_age'),
      organizerYear: localStorage.getItem('user_profile_year'),
      organizerSemester: localStorage.getItem('user_profile_semester'),
    };

    try {
      await createTrip({ ...formData, ...profileData });
      onTripCreated(); // This will trigger a refresh in the parent
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationPicked = (address) => {
    setFormData({ ...formData, [pickingField]: address });
    setPickingField(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Post a New Trip</h2>
        
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Your Current Location (Pickup)</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                placeholder="e.g. University Main Gate"
                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <button 
                type="button"
                onClick={() => setPickingField('startLocation')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded transition"
              >
                Map
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. 0771234567"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Destination</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Type your destination"
                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <button 
                type="button"
                onClick={() => setPickingField('destination')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded transition"
              >
                Map
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
            >
              {vehicleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 mb-2 text-sm">Total Fare (LKR)</label>
            <input
              type="number"
              name="totalFare"
              value={formData.totalFare}
              onChange={handleChange}
              placeholder="e.g. 1500"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-bold transition text-white disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Trip'}
          </button>
        </form>
      </div>

      {pickingField && (
        <LocationPicker 
          onConfirm={handleLocationPicked} 
          onClose={() => setPickingField(null)} 
        />
      )}
    </div>
  );
};

export default CreateTripModal;