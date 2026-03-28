import React, { useEffect, useState } from 'react';
import { getTrips, joinTrip } from '../api';

const TripList = ({ userId }) => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getTrips().then(res => setTrips(res.data));
  }, []);

  const handleJoin = async (id) => {
    await joinTrip({ tripId: id, userId });
    window.location.reload(); // Refresh to show updated seats
  };

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <div key={trip._id} className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex justify-between items-center">
          <div>
            <h4 className="text-white font-bold text-lg">{trip.destination}</h4>
            <p className="text-slate-400 text-sm">{trip.vehicleType} • {trip.maxSeats - trip.joinedStudents.length} seats left</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-400 font-mono font-bold text-xl">
              Rs. {(trip.totalFare / trip.joinedStudents.length).toFixed(0)}
            </p>
            <p className="text-slate-500 text-xs uppercase">Per Person</p>
            <button 
              onClick={() => handleJoin(trip._id)}
              disabled={trip.joinedStudents.length >= trip.maxSeats}
              className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-1 rounded text-sm transition"
            >
              {trip.joinedStudents.length >= trip.maxSeats ? 'Full' : 'Join Ride'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripList;