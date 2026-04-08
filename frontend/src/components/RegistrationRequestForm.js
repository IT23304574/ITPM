import React, { useState } from 'react';
import API from '../utils/api';
import axios from 'axios';

const RegistrationRequestForm = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    message: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const { studentId, message } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'studentId') {
      if (value.length > 0 && !value.toUpperCase().startsWith('IT')) {
        setStatus((prev) => ({ ...prev, error: 'Student ID must start with "IT" or "it"' }));
      } else {
        setStatus((prev) => ({ ...prev, error: null }));
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    if (!studentId.match(/^[iI][tT]\d{8}$/)) {
        setStatus({ loading: false, error: 'Please enter a valid IT number (e.g., IT23304574).', success: null });
        return;
    }

    try {
      // Using the absolute path to bypass any configuration issues in the API utility
      const res = await axios.post('http://localhost:5000/api/requests', formData);
      
      setStatus({
        loading: false,
        error: null,
        success: res.data.msg,
      });
      // Clear form on success
      setFormData({ studentId: '', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.msg || err.message || 'An error occurred. Please try again.',
        success: null,
      });
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-xl font-bold mb-2 text-center">Request a New Account</h3>
      <p className="text-gray-400 mb-6 text-center text-sm">If you are a new student, request an account from the administrator here.</p>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="studentId" className="block text-gray-400 mb-2 text-sm">Your Student IT Number</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={studentId}
            onChange={onChange}
            placeholder="e.g., IT23304574"
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-400 mb-2 text-sm">Message to Admin</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={onChange}
            placeholder="e.g., 'Hi, I'm a new student and need an account.'"
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500 h-24"
          ></textarea>
        </div>

        {status.error && <p className="text-red-400 text-sm mb-4 text-center">{status.error}</p>}
        {status.success && <p className="text-green-400 text-sm mb-4 text-center">{status.success}</p>}

        <button type="submit" disabled={status.loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:bg-gray-500">
          {status.loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationRequestForm;
