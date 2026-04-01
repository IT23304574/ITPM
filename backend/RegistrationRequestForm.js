import React, { useState } from 'react';
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
        error: err.response?.data?.msg || 'An error occurred. Please try again.',
        success: null,
      });
    }
  };

  return (
    <div className="registration-request-container">
      <h3>Request a New Account</h3>
      <p>If you are a new student, you can request an account from the administrator here.</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="studentId">Your Student IT Number</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={studentId}
            onChange={onChange}
            placeholder="e.g., IT23304574"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message to Admin</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={onChange}
            placeholder="e.g., 'Hi, I'm a new student and need an account.'"
            required
          ></textarea>
        </div>

        {status.error && <p className="error-message">{status.error}</p>}
        {status.success && <p className="success-message">{status.success}</p>}

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationRequestForm;