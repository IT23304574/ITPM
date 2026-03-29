/*import React, { useEffect, useState } from 'react';
import { getTrips, joinTrip, deleteTrip, startTrip } from '../api';

const TripList = ({ userId, searchTerm, vehicleFilter }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    try {
      const { data } = await getTrips();
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleJoin = async (tripId) => {
    try {
      await joinTrip({ tripId });
      fetchTrips(); // Refresh list after joining
      alert('Successfully joined the trip!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to join trip');
    }
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        await deleteTrip(tripId);
        fetchTrips(); // Refresh list after deletion
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to cancel trip');
      }
    }
  };

  const handleStartTrip = async (tripId) => {
    try {
      await startTrip(tripId);
      fetchTrips(); // Refresh to show updated status
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to start trip');
    }
  };

  if (loading) return <div className="text-white mt-6 text-center">Loading trips...</div>;
  if (error) return <div className="text-red-400 mt-6 text-center">{error}</div>;

  if (trips.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">No Trips Available</h3>
        <p className="text-gray-400">Be the first to post a trip!</p>
      </div>
    );
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = (trip.destination?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trip.startLocation?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesVehicle = vehicleFilter === 'All' || !vehicleFilter || trip.vehicleType === vehicleFilter;
    
    return matchesSearch && matchesVehicle;
  });

  if (filteredTrips.length === 0 && (searchTerm || (vehicleFilter && vehicleFilter !== 'All'))) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">No Matching Trips Found</h3>
        <p className="text-gray-400">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-6">
      {filteredTrips.map((trip) => {
        const isOrganizer = trip.organizer._id === userId;
        const isJoined = trip.joinedStudents.includes(userId);
        // Organizer takes 1 seat, so subtract 1 from maxSeats
        const availableSeats = trip.maxSeats - 1 - trip.joinedStudents.length;

        return (
          <div key={trip._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-emerald-400">{trip.destination}</h3>
              <div className="text-gray-300 mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-semibold text-gray-400">Pickup Location:</span> {trip.startLocation || <span className="italic text-gray-500">Not specified</span>}
                  {trip.startLocation && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.startLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-400 hover:underline text-xs"
                    >
                      (View Map)
                    </a>
                  )}
                </p>
                <p><span className="font-semibold text-gray-400">Vehicle:</span> {trip.vehicleType}</p>
                <p><span className="font-semibold text-gray-400">Organizer:</span> {trip.organizer.studentId}</p>
                <p><span className="font-semibold text-gray-400">Contact:</span> {trip.phoneNumber || 'Not provided'}</p>
                <p><span className="font-semibold text-gray-400">Fare:</span> LKR {trip.totalFare}</p>
                <p><span className="font-semibold text-gray-400">Seats:</span> <span className={availableSeats > 0 ? 'text-green-400' : 'text-red-400'}>{availableSeats} available</span> / {trip.maxSeats}</p>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              {isOrganizer ? (
                <div className="flex flex-col gap-2">
                  <span className="block text-center w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold cursor-default text-sm">Your Trip</span>
                  
                  {!trip.status || trip.status === 'planned' ? (
                    <button 
                      onClick={() => handleStartTrip(trip._id)}
                      className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition text-sm"
                    >
                      Start Trip
                    </button>
                  ) : (
                    <span className="block text-center w-full md:w-auto px-4 py-2 bg-green-800 text-green-200 rounded-lg font-bold text-sm">Trip Started</span>
                  )}

                  <button 
                    onClick={() => handleDelete(trip._id)}
                    className="w-full md:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition text-sm"
                  >
                    Cancel Trip
                  </button>
                </div>
              ) : trip.status === 'started' ? (
                <span className="block text-center w-full md:w-auto px-4 py-2 bg-green-800 text-green-200 rounded-lg font-bold cursor-default">Trip Started</span>
              ) : isJoined ? (
                <span className="block text-center w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-default">Joined</span>
              ) : availableSeats === 0 ? (
                <span className="block text-center w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-lg font-semibold cursor-default">Full</span>
              ) : (
                <button 
                  onClick={() => handleJoin(trip._id)}
                  className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
                >
                  Join Trip
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TripList;
*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getTrips, joinTrip, deleteTrip, startTrip } from '../api';
import JoinTripModal from './JoinTripModal';
import ChatModal from './ChatModal';

// Helper to resize and compress images before upload
const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Resize to smaller dimensions
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.7 quality to reduce size
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const TripList = ({ userId, user, pickupSearch, dropSearch, vehicleFilter }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(localStorage.getItem(`profileImage_${userId}`) || null);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatTripId, setChatTripId] = useState(null);

  // New Profile State
  const [gender, setGender] = useState(localStorage.getItem(`gender_${userId}`) || '');
  const [age, setAge] = useState(localStorage.getItem(`age_${userId}`) || '');
  const [year, setYear] = useState(localStorage.getItem(`year_${userId}`) || '');
  const [semester, setSemester] = useState(localStorage.getItem(`semester_${userId}`) || '');

  // Sync profile details to localStorage (specific key for persistence, generic key for CreateTripModal access)
  useEffect(() => {
    localStorage.setItem(`gender_${userId}`, gender);
    localStorage.setItem('user_profile_gender', gender);
    
    localStorage.setItem(`age_${userId}`, age);
    localStorage.setItem('user_profile_age', age);
    
    localStorage.setItem(`year_${userId}`, year);
    localStorage.setItem('user_profile_year', year);
    
    localStorage.setItem(`semester_${userId}`, semester);
    localStorage.setItem('user_profile_semester', semester);
  }, [gender, age, year, semester, userId]);

  const fetchTrips = async () => {
    try {
      const { data } = await getTrips();
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        await deleteTrip(tripId);
        fetchTrips(); // Refresh list after deletion
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to cancel trip');
      }
    }
  };

  const handleStartTrip = async (tripId) => {
    try {
      await startTrip(tripId);
      fetchTrips(); // Refresh to show updated status
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to start trip');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await resizeImage(file);
        console.log("Image processed. Size:", base64Image.length);
        setProfileImage(base64Image);
        localStorage.setItem(`profileImage_${userId}`, base64Image);

        // Try to retrieve token from localStorage or sessionStorage
        let token = localStorage.getItem('token') || 
                      localStorage.getItem('authToken') || 
                      sessionStorage.getItem('token');
        
        // Ensure token is valid and not a string "undefined" or "null"
        if (token === 'undefined' || token === 'null') token = null;

        if (!token) {
          // Fallback: Check if token is inside the 'user' object in localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.token) token = parsedUser.token;
            } catch (e) {
              console.error("Failed to parse user object for token");
            }
          }
        }

        if (!token) {
          console.error("Debug: Token still not found. LocalStorage keys:", Object.keys(localStorage));
          alert("Authentication error: You are not logged in. Please log out and log in again.");
          navigate('/login');
          return;
        }

        // Assuming the route is /api/auth/profile based on controller structure
        await axios.put('http://localhost:5001/api/auth/profile', { profileImage: base64Image }, {
          headers: { 
            'x-auth-token': token,
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Profile image updated successfully!');
      } catch (err) {
        console.error('Failed to upload profile image:', err);
        if (err.response && err.response.status === 413) {
          alert("The image is too large. Please try a smaller image or increase the server limit.");
        } else if (err.response && err.response.status === 401) {
          alert("Session expired. Please log in again.");
          navigate('/login');
        } else {
          alert(`Failed to upload image. Status: ${err.response?.status}. Message: ${err.response?.data?.msg || err.message}`);
        }
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!gender || !age || !year || !semester) {
      alert('Please complete all profile fields before saving.');
      return;
    }

    try {
      let token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token');
      
      if (token === 'undefined' || token === 'null') token = null;

      if (!token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.token) token = parsedUser.token;
          } catch (e) {}
        }
      }

      await axios.put('http://localhost:5001/api/auth/profile', { 
        gender, age, year, semester 
      }, {
        headers: { 'x-auth-token': token, 'Authorization': `Bearer ${token}` }
      });
      alert('Profile details saved successfully!');
      fetchTrips(); // Refresh the list to show the new details (like Gender) immediately
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile details.');
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesPickup = !pickupSearch || (trip.startLocation?.toLowerCase().includes(pickupSearch.toLowerCase()));
    const matchesDrop = !dropSearch || (trip.destination?.toLowerCase().includes(dropSearch.toLowerCase()));
    
    const matchesVehicle = vehicleFilter === 'All' || !vehicleFilter || trip.vehicleType === vehicleFilter;
    
    return matchesPickup && matchesDrop && matchesVehicle;
  });

  const renderContent = () => {
    if (loading) return <div className="text-white mt-6 text-center">Loading trips...</div>;
    if (error) return <div className="text-red-400 mt-6 text-center">{error}</div>;

    if (trips.length === 0) {
      return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">No Trips Available</h3>
          <p className="text-gray-400">Be the first to post a trip!</p>
        </div>
      );
    }

    if (filteredTrips.length === 0 && (pickupSearch || dropSearch || (vehicleFilter && vehicleFilter !== 'All'))) {
      return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">No Matching Trips Found</h3>
          <p className="text-gray-400">Try a different search term.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 mt-6">
        {filteredTrips.map((trip) => {
          const isOrganizer = (trip.organizer?._id || trip.organizer)?.toString() === userId;
          const isJoined = trip.joinedStudents?.some(student =>
            ((student?.user?._id || student?.user) || (student?._id || student))?.toString() === userId
          ) || false;
          // Organizer takes 1 seat, so subtract 1 from maxSeats
          const availableSeats = trip.maxSeats - 1 - (trip.joinedStudents?.length || 0);

          return (
            <div key={trip._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-emerald-400">{trip.destination}</h3>
                <div className="text-gray-300 mt-2 space-y-1 text-sm">
                  <p>
                    <span className="font-semibold text-gray-400">Pickup Location:</span> {trip.startLocation || <span className="italic text-gray-500">Not specified</span>}
                    {trip.startLocation && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.startLocation)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-400 hover:underline text-xs"
                      >
                        (View Map)
                      </a>
                    )}
                  </p>
                  <p><span className="font-semibold text-gray-400">Vehicle:</span> {trip.vehicleType}</p>
                  
                  <div className="flex items-center gap-2 my-1">
                    <span className="font-semibold text-gray-400">Organizer:</span>
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full border border-gray-600">
                      <img 
                        src={trip.organizer?.profileImage || `https://ui-avatars.com/api/?name=${trip.organizer?.studentId || 'User'}&background=random`} 
                        alt="Org" 
                        className="w-16 h-16 rounded-full object-cover mr-2 cursor-pointer hover:opacity-80 transition"
                        onClick={() => setViewingImage(trip.organizer?.profileImage || `https://ui-avatars.com/api/?name=${trip.organizer?.studentId || 'User'}&background=random`)}
                      />
                      <span className="text-white">{trip.organizer?.studentId}</span>
                    </div>
                  </div>
                  
                  {/* Display Organizer Details */}
                  {(trip.organizerGender || trip.organizerAge || trip.organizerYear) && (
                    <div className="mt-2 mb-2 p-3 bg-gray-700 rounded-lg border border-gray-600 text-sm">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {trip.organizerGender && (
                          <div className="flex items-center">
                            <span className="text-gray-400 w-16">Gender:</span>
                            <span className="text-white">{trip.organizerGender}</span>
                          </div>
                        )}
                        {trip.organizerAge && (
                          <div className="flex items-center">
                            <span className="text-gray-400 w-16">Age:</span>
                            <span className="text-white">{trip.organizerAge}</span>
                          </div>
                        )}
                        {trip.organizerYear && (
                          <div className="flex items-center">
                            <span className="text-gray-400 w-16">Year:</span>
                            <span className="text-white">{trip.organizerYear}</span>
                          </div>
                        )}
                        {trip.organizerSemester && (
                          <div className="flex items-center">
                            <span className="text-gray-400 w-16">Sem:</span>
                            <span className="text-white">{trip.organizerSemester}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <p><span className="font-semibold text-gray-400">Contact:</span> {trip.phoneNumber || 'Not provided'}</p>
                  <p><span className="font-semibold text-gray-400">Fare:</span> LKR {trip.totalFare}</p>
                  <p><span className="font-semibold text-gray-400">Seats:</span> <span className={availableSeats > 0 ? 'text-green-400' : 'text-red-400'}>{availableSeats} available</span> / {trip.maxSeats}</p>
                </div>

                {/* Show Joined Students to Organizer */}
                {isOrganizer && trip.joinedStudents && trip.joinedStudents.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h4 className="text-emerald-400 font-bold text-sm mb-2">Joined Students:</h4>
                    <div className="space-y-2">
                      {trip.joinedStudents.map((student, idx) => {
                        if (!student) return null;
                        // Handle both object structure (with phone) and simple user object (without phone)
                        const studentId = student.user?.studentId || student.studentId || 'Student';
                        const gender = student.user?.gender || student.gender;
                        const studentImage = student.user?.profileImage || student.profileImage;
                        return (
                          <div key={idx} className="text-sm bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="flex items-center mb-2">
                              <img 
                                src={studentImage || `https://ui-avatars.com/api/?name=${studentId}&background=random`} 
                                alt="Profile" 
                                className="w-16 h-16 rounded-full object-cover mr-2 border border-gray-600 cursor-pointer hover:opacity-80 transition" 
                                onClick={() => setViewingImage(studentImage || `https://ui-avatars.com/api/?name=${studentId}&background=random`)}
                              />
                              <div className="flex-1 flex justify-between items-center">
                                <span className="font-semibold text-white">{studentId || 'User'}</span>
                                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">{gender || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="text-gray-300 text-xs space-y-0.5">
                              <p> Contact number 📞 {student.phoneNumber || 'No phone'}</p>
                              {student.dropLocation && <p> Early Drop location 📍{student.dropLocation}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chat Button for Participants */}
                {(isOrganizer || isJoined) && (
                  <button
                    onClick={() => { setChatTripId(trip._id); setChatOpen(true); }}
                    className="mt-3 flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition"
                  >
                    💬 Open Group Chat
                  </button>
                )}
              </div>
              
              <div className="w-full md:w-auto">
                {isOrganizer ? (
                  <div className="flex flex-col gap-2">
                    <span className="block text-center w-full md:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold cursor-default text-sm">Your Trip</span>
                    
                    {!trip.status || trip.status === 'planned' ? (
                      <button 
                        onClick={() => handleStartTrip(trip._id)}
                        className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition text-sm"
                      >
                        Start Trip
                      </button>
                    ) : (
                      <span className="block text-center w-full md:w-auto px-4 py-2 bg-green-800 text-green-200 rounded-lg font-bold text-sm">Trip Started</span>
                    )}

                    <button 
                      onClick={() => handleDelete(trip._id)}
                      className="w-full md:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition text-sm"
                    >
                      Cancel Trip
                    </button>
                  </div>
                ) : trip.status === 'started' ? (
                  <span className="block text-center w-full md:w-auto px-4 py-2 bg-green-800 text-green-200 rounded-lg font-bold cursor-default">Trip Started</span>
                ) : isJoined ? (
                  <span className="block text-center w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-default">Joined</span>
                ) : availableSeats === 0 ? (
                  <span className="block text-center w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-lg font-semibold cursor-default">Full</span>
                ) : (
                  <button 
                    onClick={() => {
                      setSelectedTripId(trip._id);
                      setJoinModalOpen(true);
                    }}
                    className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
                  >
                    Join Trip
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Left Sidebar - Profile */}
      <div className="w-full md:w-1/4 bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit sticky top-4">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4 group">
            <img 
              src={profileImage || `https://ui-avatars.com/api/?name=${user?.studentId || 'User'}&background=random`} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-4 border-emerald-500 shadow-lg cursor-pointer hover:opacity-90 transition"
              onClick={() => setViewingImage(profileImage || `https://ui-avatars.com/api/?name=${user?.studentId || 'User'}&background=random`)}
            />
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 13.971 3 17h3.029l8.379-8.379-2.828-2.828z" />
              </svg>
            </label>
            <input 
              id="profile-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{user?.studentId || 'Student'}</h3>
          <p className="text-gray-400 text-sm mb-6">Student Account</p>
          
          {/* Profile Details Inputs */}
          <div className="w-full space-y-3 mb-6">
            <div>
              <label className="text-gray-400 text-xs block mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="text-gray-400 text-xs block mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <select 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)}
                  required
                  aria-required="true"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Year</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                  <option value="4">4th</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="text-gray-400 text-xs block mb-1">
                  Sem <span className="text-red-500">*</span>
                </label>
                <select 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  aria-required="true"
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Sem</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveProfile}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold transition mb-2 shadow-md"
          >
            Save Details
          </button>

          <button 
            onClick={() => navigate('/change-password')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition mb-2 shadow-md"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Right Side - Trip List */}
      <div className="w-full md:w-3/4">
        {renderContent()}
      </div>

      <JoinTripModal 
        tripId={selectedTripId}
        isOpen={isJoinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoinSuccess={() => {
          fetchTrips();
          alert('Successfully joined the trip!');
        }}
      />

      <ChatModal 
        tripId={chatTripId}
        isOpen={isChatOpen}
        onClose={() => setChatOpen(false)}
        currentUserId={userId}
      />

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] cursor-pointer p-4"
          onClick={() => setViewingImage(null)}
        >
          <img 
            src={viewingImage} 
            alt="Enlarged Profile" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300">&times;</button>
        </div>
      )}
    </div>
  );
};

export default TripList;
