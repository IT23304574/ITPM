import React, { useState } from 'react';

const RateTripModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
        alert("Please select a rating");
        return;
    }
    onSubmit(rating);
    setRating(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-sm relative shadow-2xl text-center">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
            &times;
        </button>
        <h3 className="text-2xl font-bold mb-2 text-white">Rate Trip</h3>
        <p className="text-gray-400 mb-6 text-sm">How was your experience?</p>
        
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl transition transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
            >
              ★
            </button>
          ))}
        </div>

        <button 
            onClick={handleSubmit} 
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
        >
          Submit & Start
        </button>
      </div>
    </div>
  );
};

export default RateTripModal;