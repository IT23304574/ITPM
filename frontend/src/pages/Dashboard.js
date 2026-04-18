import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import TripList from '../components/TripList';
import CreateTripModal from '../components/CreateTripModal';
import RechargeModal from '../components/RechargeModal';

const Dashboard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropSearch, setDropSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, ratingCount: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchErrors, setSearchErrors] = useState({ pickup: '', drop: '' });
  const [balance, setBalance] = useState(0);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  const fetchBalance = async () => {
    if (!user) return;
    try {
      const { data } = await API.put('/auth/profile', {});
      setBalance(data.balance || 0);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  const fetchNotifications = async () => {
    if (!user || !user.studentId) return;
    try {
      const { data } = await API.get(`/notifications/${user.studentId}`);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const fetchRatingStats = async () => {
    if (!user || !user.userId) return;
    try {
      const res = await API.get(`/trips/organizer/${user.userId}/stats`);
      setRatingStats(res.data);
    } catch (err) {
      console.error("Failed to fetch rating stats", err);
    }
  };

  useEffect(() => {
    fetchRatingStats();
    fetchNotifications();
    fetchBalance();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
          <p className="text-white text-xl">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-10 bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-sm relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Available Rides
                </h2>
              </div>
              <p className="text-gray-400 text-lg ml-1">Join a ride to split the cost and travel together.</p>
              
              {/* User Welcome */}
              <div className="mt-4 flex items-center gap-2 ml-1">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Welcome back, <span className="text-emerald-400 font-semibold">{user.userId || user.studentId}</span></span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Recharge System */}
              <div className="flex items-center gap-4 bg-gray-700/40 border border-gray-600 rounded-xl px-5 py-3 shadow-lg backdrop-blur-sm">
                <button
                  onClick={() => setIsRechargeOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Recharge
                </button>
                <div className="bg-red-500 px-4 py-2 rounded-lg text-white font-bold text-lg shadow-inner">
                  {balance}
                </div>
              </div>

              {/* Notification System */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute top-2 right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-[100] overflow-hidden animate-fadeInUp">
                    <div className="p-4 border-b border-gray-700 bg-gray-900/50">
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider">Admin Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n._id} className={`p-4 border-b border-gray-700 hover:bg-gray-700/30 transition flex justify-between items-start ${!n.isRead ? 'bg-emerald-500/5' : ''}`}>
                          <div className="flex-grow">
                            <p className={`text-sm leading-relaxed ${!n.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>{n.message}</p>
                            <span className="text-[10px] text-gray-500 mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          {!n.isRead && (
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleMarkAsRead(n._id); 
                              }}
                              className="ml-2 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-tighter bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 transition-all"
                            >
                              Read
                            </button>
                          )}
                        </div>
                      )) : (
                        <div className="p-8 text-center text-gray-500 text-sm italic">No notifications yet</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 shadow-lg flex items-center gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Trips Rated</p>
                  <p className="text-2xl font-bold text-white">{ratingStats.ratingCount}</p>
                </div>
                <div className="w-px h-10 bg-gray-700"></div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Avg Rating</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold text-yellow-400">{ratingStats.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-yellow-400 text-xl">★</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Post a Trip</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Pickup Location Search */}
            <div className="flex-grow relative group">
              <label className="block text-sm font-medium text-gray-400 mb-2">Pickup Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search pickup location..."
                  value={pickupSearch}
                  onChange={(e) => {
                    if (e.target.value.length <= 15) {
                      setPickupSearch(e.target.value);
                    }
                  }}
                  maxLength={15}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                    searchErrors.pickup ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
              </div>
              {/* Validation message below pickup search */}
              <div className="flex justify-between items-center mt-1">
                {searchErrors.pickup && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <span>⚠️</span> {searchErrors.pickup}
                  </p>
                )}
                <p className={`text-xs ml-auto ${pickupSearch.length > 0 ? 'text-gray-500' : 'text-gray-600'}`}>
                  {pickupSearch.length}/15 characters
                </p>
              </div>
            </div>

            {/* Drop Location Search */}
            <div className="flex-grow relative group">
              <label className="block text-sm font-medium text-gray-400 mb-2">Drop Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search drop location..."
                  value={dropSearch}
                  onChange={(e) => {
                    if (e.target.value.length <= 15) {
                      setDropSearch(e.target.value);
                    }
                  }}
                  maxLength={15}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ${
                    searchErrors.drop ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
              </div>
              {/* Validation message below drop search */}
              <div className="flex justify-between items-center mt-1">
                {searchErrors.drop && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <span>⚠️</span> {searchErrors.drop}
                  </p>
                )}
                <p className={`text-xs ml-auto ${dropSearch.length > 0 ? 'text-gray-500' : 'text-gray-600'}`}>
                  {dropSearch.length}/15 characters
                </p>
              </div>
            </div>

            {/* Vehicle Filter */}
            <div className="md:w-64 relative group">
              <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="All">All Vehicles</option>
                  <option value="TukTuk">🛺 TukTuk - 2 Seats</option>
                  <option value="Small Car">🚗 Small Car - 3 Seats</option>
                  <option value="Medium Car">🚙 Medium Car - 4 Seats</option>
                  <option value="Van">🚐 Van - 7 Seats</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Available Rides Filter with Message */}
          <div className="mt-4">
            <label htmlFor="show-available" className="flex items-center cursor-pointer">
              <input
                id="show-available"
                type="checkbox"
                checked={showAvailableOnly}
                onChange={e => setShowAvailableOnly(e.target.checked)}
                className="h-5 w-5 rounded-md border-gray-500 bg-gray-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="ml-3 text-sm font-medium text-gray-300">Show only rides with available seats</span>
            </label>
            
            {/* Message near the checkbox - shows when filter is active but no trips available */}
            {showAvailableOnly && (
              <div className="mt-2 flex items-center gap-2 text-yellow-400 text-sm bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/30">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>⚠️ No trips with available seats found. Try disabling this filter to see all available trips.</span>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(pickupSearch || dropSearch || vehicleFilter !== 'All') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {pickupSearch && (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm flex items-center gap-1 border border-emerald-500/30">
                  Pickup: {pickupSearch}
                  <button onClick={() => setPickupSearch('')} className="hover:text-emerald-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {dropSearch && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1 border border-blue-500/30">
                  Drop: {dropSearch}
                  <button onClick={() => setDropSearch('')} className="hover:text-blue-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {vehicleFilter !== 'All' && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1 border border-purple-500/30">
                  Vehicle: {vehicleFilter}
                  <button onClick={() => setVehicleFilter('All')} className="hover:text-purple-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button 
                onClick={() => {
                  setPickupSearch('');
                  setDropSearch('');
                  setVehicleFilter('All');
                }}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Trip List Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Trip Listings</h3>
              </div>
              <button 
                onClick={() => setRefreshKey(prevKey => prevKey + 1)}
                className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <TripList 
              key={refreshKey} 
              userId={user.userId || user._id || user.id} 
              pickupSearch={pickupSearch} 
              dropSearch={dropSearch} 
              vehicleFilter={vehicleFilter}
              showAvailableOnly={showAvailableOnly}
              user={user}
              onDataChange={fetchRatingStats}
              searchErrors={searchErrors}
            />
          </div>
        </div>
      </div>

      {/* Create Trip Modal */}
      {isModalOpen && (
        <CreateTripModal 
          onClose={() => setIsModalOpen(false)} 
          onTripCreated={() => setRefreshKey(prevKey => prevKey + 1)} 
        />
      )}

      {isRechargeOpen && (
        <RechargeModal
          isOpen={isRechargeOpen}
          onClose={() => setIsRechargeOpen(false)}
          onSubmit={(formData) => {
            setIsRechargeOpen(false);
            alert("Recharge request submitted. Your balance will update once admin verifies the payment slip.");
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;