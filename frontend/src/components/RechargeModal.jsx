import React, { useState } from "react";
import axios from "axios";

const RechargeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    amount: "",
    proof: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
    }

    const amountValue = Number(formData.amount);
    if (!formData.amount || Number.isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = "Please enter a valid recharge amount.";
    }

    if (!formData.proof) {
      newErrors.proof = "Please upload payment proof.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === 'name') {
      if (!value.trim()) {
        newErrors.name = "Name is required.";
      } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
        newErrors.name = "Name must contain only letters and spaces.";
      } else {
        delete newErrors.name;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('studentId', formData.studentId);
      formDataToSend.append('amount', formData.amount);
      if (formData.proof) {
        formDataToSend.append('proof', formData.proof);
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.token;

      await axios.post('http://localhost:5001/api/recharge', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitted(true);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSubmitted(false);
    setFormData({ name: "", studentId: "", amount: "", proof: null });
    setErrors({});
    onClose();
  };

  if (submitted) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <h2 style={styles.title}>Payment Verification</h2>
          <div style={styles.messageContainer}>
            <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={styles.messageText}>Your recharge request has been submitted successfully!</p>
            <p style={styles.verificationText}>Your payment is pending verification. Once verified, the amount will be added to your wallet.</p>
          </div>
          <button onClick={handleCloseModal} style={styles.closeBtn}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Recharge Wallet</h2>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <label>Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.name && <span style={styles.error}>{errors.name}</span>}

          <label>Student ID</label>
          <input
            style={styles.input}
            type="text"
            name="studentId"
            placeholder="Enter your student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
          {errors.studentId && <span style={styles.error}>{errors.studentId}</span>}

          <label>Amount</label>
          <input
            style={styles.input}
            type="number"
            name="amount"
            placeholder="Enter recharge amount"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />
          {errors.amount && <span style={styles.error}>{errors.amount}</span>}

          <label>Payment Proof</label>
          <input
            style={styles.input}
            type="file"
            name="proof"
            accept="image/*"
            onChange={handleChange}
            required
          />
          {errors.proof && <span style={styles.error}>{errors.proof}</span>}

          <div style={styles.actions}>
            <button type="submit" style={styles.uploadBtn} disabled={loading}>
              {loading ? "Submitting..." : "Upload"}
            </button>
            <button type="button" onClick={handleCloseModal} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RechargeModal;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#1e3a5f",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    color: "#fff",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    background: "#2d4c72",
    border: "1px solid #4f7bb3",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 12px",
    outline: "none",
    fontSize: "0.95rem",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  uploadBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "gray",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
  },
  error: {
    color: "#ffb3b3",
    fontSize: "0.9rem",
    marginTop: "4px",
    marginBottom: "8px",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  checkIcon: {
    width: "60px",
    height: "60px",
    color: "#4ade80",
  },
  messageText: {
    fontSize: "1.1rem",
    fontWeight: "600",
    textAlign: "center",
    margin: "0",
    color: "#fff",
  },
  verificationText: {
    fontSize: "0.95rem",
    textAlign: "center",
    margin: "0",
    color: "#cbd5e1",
  },
  closeBtn: {
    width: "100%",
    background: "#4ade80",
    color: "#000",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
  },
};