import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent, getAllStudents, adminUpdateStudentPassword } from '../api';
import API from '../utils/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ studentId: '', password: '' });
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newPass, setNewPass] = useState('');

  const fetchStudents = async () => {
    try {
      const { data } = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/requests');
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => { fetchStudents(); fetchRequests(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerStudent(formData);
      setMessage('✅ Student registered successfully!');
      setFormData({ studentId: '', password: '' });
      fetchStudents(); // Refresh list
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Error registering student');
    }
  };

  const handleUpdatePassword = async (studentId) => {
    try {
      await adminUpdateStudentPassword({ studentId, newPassword: newPass });
      setMessage(`✅ Password updated for ${studentId}`);
      setEditingId(null);
      setNewPass('');
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Error updating password');
    }
  };

  const handleApproveRequest = async (reqId, studentId) => {
    const password = prompt(`Enter initial password for ${studentId}:`);
    if (!password) return;

    try {
      const res = await API.post(`/requests/${reqId}/approve`, { password });
      setMessage(`✅ ${res.data.msg}`);
      fetchRequests();
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Error approving request');
    }
  };

  const handleRejectRequest = async (reqId) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      const res = await API.post(`/requests/${reqId}/reject`);
      setMessage(`✅ ${res.data.msg}`);
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Error rejecting request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Manage Admin Profile */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Admin Actions</h2>
            <p className="text-gray-400 mb-6">Update your security credentials.</p>
            <button 
              onClick={() => navigate('/change-password')}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition text-white"
            >
              Update Admin Password
            </button>
          </div>

          {/* Section 2: Register New Student */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Register New Student</h2>
            {message && (
              <div className={`p-3 mb-4 rounded text-sm ${message.includes('✅') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2 text-sm">Student ID</label>
                <input 
                  type="text" 
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. IT002"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 mb-2 text-sm">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set student password"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-bold transition text-white">
                Add Student
              </button>
            </form>
          </div>
        </div>

        {/* Section: Pending Registration Requests */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Pending Registration Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.filter(r => r.status === 'pending').map((req) => (
                  <tr key={req._id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3">{req.studentId}</td>
                    <td className="p-3">{req.message}</td>
                    <td className="p-3 text-yellow-400">{req.status}</td>
                    <td className="p-3 flex gap-2">
                      <button 
                        onClick={() => handleApproveRequest(req._id, req.studentId)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(req._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.filter(r => r.status === 'pending').length === 0 && (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">No pending requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Registered Students List */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Registered Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-3">{student.studentId}</td>
                    <td className="p-3">{new Date(student.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      {editingId === student.studentId ? (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="New Pass" 
                            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white w-32"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                          />
                          <button onClick={() => handleUpdatePassword(student.studentId)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Save</button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm">Cancel</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setEditingId(student.studentId)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition"
                        >
                          Change Password
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan="3" className="p-4 text-center text-gray-500">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;