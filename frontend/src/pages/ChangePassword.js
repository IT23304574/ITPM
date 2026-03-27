import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api'; // Use the correct API function with interceptor

const ChangePassword = ({ user, setUser }) => {
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // The API call now correctly uses the interceptor to attach the token.
      // The backend gets the user ID from the token, not the request body.
      await changePassword({ newPassword });
      const updatedUser = { ...user, isFirstLogin: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Password updated successfully.");
      navigate('/');
    } catch (err) {
      console.error("Change password error:", err);
      if (err.response && err.response.data && err.response.data.msg) {
        alert("Update failed: " + err.response.data.msg);
      } else {
        alert("Update failed. Please check if the backend server is running.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md text-center">
        <h2 className="text-xl font-bold text-white mb-4">Set New Password</h2>
        <p className="text-gray-400 mb-6 text-sm">{user.isFirstLogin ? "For security, please update the default password assigned by the admin." : "Enter your new password below."}</p>
        <form onSubmit={handleUpdate}>
          <input 
            type="password" placeholder="New Secure Password" 
            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-bold transition">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;