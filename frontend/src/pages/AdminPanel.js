/*import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent, getAllStudents, adminUpdateStudentPassword } from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ studentId: '', password: '' });
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newPass, setNewPass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchStudents = async () => {
    try {
      const { data } = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

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

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Registered Students Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Student ID", "Joined Date"];
    const tableRows = filteredStudents.map(student => [
      student.studentId,
      new Date(student.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    });
    doc.save(`${searchTerm ? 'Filtered_' : ''}Students_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">*/
          {/* Section 1: Manage Admin Profile */}/*
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
            <h2 className="text-xl font-bold mb-4 text-emerald-400">Admin Actions</h2>
            <p className="text-gray-400 mb-6">Update your security credentials.</p>
            <button 
              onClick={() => navigate('/change-password')}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition text-white"
            >
              Update Admin Password
            </button>
          </div>*/

          {/* Section 2: Register New Student */}/*
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
*/
        {/* Section 3: Registered Students List */}/*
        <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-bold text-emerald-400">Registered Students</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 p-2 pl-8 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button 
                onClick={generatePDF}
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold transition text-white flex items-center gap-2 text-sm shadow-lg hover:shadow-emerald-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Report
              </button>
            </div>
          </div>
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
                {filteredStudents.map((student) => (
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
                {filteredStudents.length === 0 && (
                  <tr><td colSpan="3" className="p-4 text-center text-gray-500">{searchTerm ? 'No matches found.' : 'No students found.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent, getAllStudents, adminUpdateStudentPassword } from '../api';
import axios from 'axios';
import API from '../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ── Inject Google Fonts + keyframes + pseudo-class styles ── */
(() => {
  if (document.getElementById('admin-panel-styles')) return;
  const style = document.createElement('style');
  style.id = 'admin-panel-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    @keyframes pageFade { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
    @keyframes alertIn  { from { opacity:0; transform:translateY(-6px);} to { opacity:1; transform:translateY(0);} }
    @keyframes growBar { from { width: 0; } to { width: var(--final-width); } }
    .ap-row:hover { background: var(--ap-row-hover) !important; }
    .ap-input:focus, .ap-search:focus, .ap-inline-input:focus { border-color:#00c87a !important; box-shadow:0 0 0 3px rgba(0,255,163,0.18) !important; background: var(--ap-input-bg) !important; outline:none; }
    .ap-search:focus { width:220px !important; }
    .ap-input::placeholder, .ap-search::placeholder, .ap-inline-input::placeholder { color: var(--ap-muted) !important; opacity: 0.5; }
    .ap-btn-primary:hover  { background:linear-gradient(135deg,#00ffa3,#00c87a) !important; box-shadow:0 4px 22px rgba(0,255,163,0.38) !important; }
    .ap-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,255,163,0.12) !important; }
    .ap-progress-fill { animation: growBar 1.2s ease-out forwards; }
    .ap-btn-blue:hover     { background:linear-gradient(135deg,#60a5fa,#3b82f6) !important; box-shadow:0 4px 22px rgba(59,130,246,0.38) !important; }
    .ap-btn-save:hover     { background:#16a34a !important; }
    .ap-btn-cancel:hover   { background:#1e2d3d !important; color:#dce9f5 !important; }
    .ap-btn-delete:hover   { background:linear-gradient(135deg,#ff4d6d,#c9184a) !important; box-shadow:0 4px 22px rgba(255,77,109,0.38) !important; }
    .ap-btn-pass:hover     { background:linear-gradient(135deg,#60a5fa,#3b82f6) !important; }
    .ap-btn-msg:hover      { background:linear-gradient(135deg,#a855f7,#9333ea) !important; }
    .ap-btn-block:hover    { background:linear-gradient(135deg,#f59e0b,#d97706) !important; box-shadow:0 4px 22px rgba(245,158,11,0.38) !important; }
    .ap-btn-primary:active, .ap-btn-blue:active, .ap-btn-save:active, .ap-btn-pass:active { transform:scale(0.97) !important; }
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background:#080b10; }
    ::-webkit-scrollbar-thumb { background:#1a2b3c; border-radius:3px; }
  `;
  document.head.appendChild(style);
})();

const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData]     = useState({ studentId: '', password: '' });
  const [message, setMessage]       = useState('');
  const [students, setStudents]     = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [messagingId, setMessagingId] = useState(null);
  const [adminMsg, setAdminMsg]     = useState('');
  const [newPass, setNewPass]       = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0, averageRating: 0, vehicleStats: [], topDestinations: [] });
  const [contactMessages, setContactMessages] = useState([]);

  const theme = {
    bg: darkMode ? '#080b10' : '#f8fafc',
    cardBg: darkMode ? '#0d1520' : '#ffffff',
    text: darkMode ? '#dce9f5' : '#1e293b',
    border: darkMode ? '#1a2b3c' : '#e2e8f0',
    inputBg: darkMode ? '#070d14' : '#f1f5f9',
    muted: darkMode ? '#6b8fa8' : '#64748b',
    gridColor: darkMode ? 'rgba(0,255,163,0.025)' : 'rgba(0,0,0,0.02)',
    radialColor: darkMode ? 'rgba(0,255,163,0.055)' : 'rgba(0,255,163,0.03)',
    rowHover: darkMode ? '#111d2b' : '#f1f5f9'
  };

  const filteredStudents = students.filter(s =>
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vehicleColors = {
    'TukTuk': '#00ffa3',
    'Small Car': '#3b82f6',
    'Medium Car': '#a855f7',
    'Van': '#f59e0b'
  };

  const fetchStudents = async () => {
    try { const { data } = await getAllStudents(); setStudents(data); }
    catch (err) { console.error('Error fetching students:', err); }
  };

  const fetchStats = async () => {
    try { const { data } = await API.get('/trips/stats/global'); setStats(data); }
    catch (err) { console.error('Error fetching stats:', err); }
  };

  const fetchContactMessages = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;
      const { data } = await axios.get('http://localhost:5000/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setContactMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleToggleBlock = async (studentId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;
      const { data } = await axios.put('http://localhost:5000/api/auth/admin/toggle-block', 
        { studentId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage(`✅ Student ${data.isBlocked ? 'blocked' : 'unblocked'} successfully`);
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Error toggling block status');
    }
  };

  const handleSendMessage = async (studentId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;
      await axios.post('http://localhost:5000/api/notifications', 
        { studentId, message: adminMsg },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage(`✅ Message sent to ${studentId}`);
      setMessagingId(null);
      setAdminMsg('');
    } catch (err) {
      setMessage('❌ Error sending message');
    }
  };

  useEffect(() => { fetchStudents(); fetchStats(); fetchContactMessages(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerStudent(formData);
      setMessage('✅ Student registered successfully!');
      setFormData({ studentId: '', password: '' });
      fetchStudents();
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

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;
      await axios.delete(`http://localhost:5000/api/contact/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setContactMessages(prev => prev.filter(m => m._id !== id));
      setMessage('✅ Message deleted');
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`⚠️ Are you sure you want to delete ${selectedIds.length} students? This action cannot be undone.`)) return;
    try {
      // Use absolute path and manual token retrieval for reliability
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;

      await axios.delete('http://localhost:5000/api/auth/students', { 
        headers: { 'Authorization': `Bearer ${token}` },
        data: { ids: selectedIds } 
      });

      setMessage(`✅ ${selectedIds.length} students deleted successfully!`);
      setSelectedIds([]);
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Error deleting students');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Registered Students Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    autoTable(doc, {
      head: [['Student ID', 'Joined Date']],
      body: filteredStudents.map(s => [s.studentId, new Date(s.createdAt).toLocaleDateString()]),
      startY: 35,
    });
    doc.save(`${searchTerm ? 'Filtered_' : ''}Students_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const isSuccess = message.includes('✅');

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'} style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      backgroundImage: `
        linear-gradient(${theme.gridColor} 1px, transparent 1px),
        linear-gradient(90deg, ${theme.gridColor} 1px, transparent 1px),
        radial-gradient(ellipse 80% 45% at 50% 0%, ${theme.radialColor} 0%, transparent 65%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
      fontFamily: "'DM Sans', sans-serif",
      color: theme.text,
      padding: '2.5rem 1.75rem',
      '--ap-row-hover': theme.rowHover,
      '--ap-input-bg': theme.inputBg,
      '--ap-muted': theme.muted,
    }}>
      <div style={{
        maxWidth: '940px',
        margin: '0 auto',
        animation: 'pageFade 0.55s ease both',
      }}>

        {/* ── Page Title ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          marginBottom: '2.5rem',
        }}>
          <h1 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1.6rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: theme.text,
            margin: 0,
          }}>
            <span style={{ color: '#00ffa3', marginRight: '0.4rem', fontSize: '1.1rem' }}>//</span>
            Admin Dashboard
          </h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              position: 'absolute',
              right: 0,
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '1.2rem',
              color: darkMode ? '#fbbf24' : '#64748b',
              transition: 'all 0.3s ease',
            }}
            title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* ── Section: Analytics Dashboard ── */}
        <div style={{ marginBottom: '1.4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Numeric Stat Cards */}
            {[
              { label: 'Total Students', val: stats.totalUsers, color: '#00ffa3', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
              { label: 'Trips Created', val: stats.totalTrips, color: '#3b82f6', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { label: 'Avg Rating', val: (stats.averageRating || 0).toFixed(1), color: '#fbbf24', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
            ].map((s, i) => (
              <div key={i} className="ap-stat-card" style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                padding: '1.25rem',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: theme.muted, letterSpacing: '0.05em' }}>{s.label}</span>
                  <svg style={{ width: '14px', height: '14px', color: s.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text }}>{s.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.4rem' }}>
            {/* Vehicle Usage Visualizer */}
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '14px',
              padding: '1.5rem',
            }}>
              <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#00ffa3', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '0.05em' }}>
                Vehicle Utilization
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(stats.vehicleStats || []).length > 0 ? stats.vehicleStats.map((v, i) => {
                  const percentage = ((v.count / stats.totalTrips) * 100).toFixed(0);
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', color: theme.text }}>
                        <span>{v._id}</span>
                        <span style={{ fontWeight: 600 }}>{percentage}%</span>
                      </div>
                      <div style={{ height: '6px', background: theme.bg, borderRadius: '10px', overflow: 'hidden' }}>
                        <div 
                          className="ap-progress-fill" 
                          style={{ 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #00ffa3, #00c87a)', 
                            '--final-width': `${percentage}%` 
                          }} 
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <p style={{ fontSize: '0.75rem', color: theme.muted }}>No trip data available yet.</p>
                )}
              </div>
            </div>

            {/* Popular Destinations */}
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '14px',
              padding: '1.5rem',
            }}>
              <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '0.05em' }}>
                Top Destinations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(stats.topDestinations || []).map((dest, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.8rem', 
                    padding: '0.6rem', 
                    background: theme.bg, 
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`
                  }}>
                    <div style={{ 
                      width: '24px', height: '24px', 
                      borderRadius: '50%', 
                      background: i === 0 ? 'rgba(251,191,36,0.1)' : 'rgba(107,143,168,0.1)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, color: i === 0 ? '#fbbf24' : theme.muted
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {dest._id}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: theme.muted }}>
                        {dest.count} trips coordinated
                      </div>
                    </div>
                    <svg style={{ width: '12px', height: '12px', color: '#00ffa3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                ))}
                {(!stats.topDestinations || stats.topDestinations.length === 0) && (
                  <p style={{ fontSize: '0.75rem', color: theme.muted }}>Analyze your popular routes here.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.4rem',
          marginBottom: '1.4rem',
        }}>

          {/* ── Card: Admin Actions ── */}
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '1.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #00ffa3, transparent 65%)',
            }} />

            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00ffa3',
              marginBottom: '0.4rem',
            }}>Admin Actions</h2>

            <p style={{
              fontSize: '0.84rem',
              color: theme.muted,
              marginBottom: '1.5rem',
              lineHeight: 1.55,
            }}>Update your security credentials.</p>

            <button
              className="ap-btn-blue"
              onClick={() => navigate('/change-password')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '0.75rem 1.2rem',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                border: 'none',
                borderRadius: '7px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'background 0.18s, box-shadow 0.18s, transform 0.1s',
                boxShadow: '0 2px 14px rgba(59,130,246,0.2)',
              }}
            >
              Update Admin Password
            </button>
          </div>

          {/* ── Card: Register Student ── */}
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '1.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #00ffa3, transparent 65%)',
            }} />

            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00ffa3',
              marginBottom: '1rem',
            }}>Register New Student</h2>

            {message && (
              <div style={{
                padding: '0.65rem 1rem',
                borderRadius: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.76rem',
                marginBottom: '1rem',
                borderLeft: `3px solid ${isSuccess ? '#00ffa3' : '#ff4d6d'}`,
                background: isSuccess ? 'rgba(0,255,163,0.07)' : 'rgba(255,77,109,0.09)',
                color: isSuccess ? '#00ffa3' : '#ff4d6d',
                animation: 'alertIn 0.22s ease both',
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.68rem',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: theme.muted,
                  marginBottom: '0.4rem',
                }}>Student ID</label>
                <input
                  className="ap-input"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. IT002"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.9rem',
                    background: theme.inputBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.84rem',
                    caretColor: '#00ffa3',
                    transition: 'border-color 0.18s, box-shadow 0.18s, background 0.18s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.68rem',
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: theme.muted,
                  marginBottom: '0.4rem',
                }}>Password</label>
                <input
                  className="ap-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Set student password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.9rem',
                    background: theme.inputBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.84rem',
                    caretColor: '#00ffa3',
                    transition: 'border-color 0.18s, box-shadow 0.18s, background 0.18s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                className="ap-btn-primary"
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '0.75rem 1.2rem',
                  background: 'linear-gradient(135deg, #00c87a, #009e60)',
                  color: '#001a0e',
                  border: 'none',
                  borderRadius: '7px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'background 0.18s, box-shadow 0.18s, transform 0.1s',
                  boxShadow: '0 2px 14px rgba(0,200,122,0.2)',
                }}
              >
                Add Student
              </button>
            </form>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '14px',
          padding: '1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #00ffa3, #3b82f6 55%, transparent 85%)',
          }} />

          {/* Toolbar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.8rem',
            marginBottom: '1.3rem',
          }}>
            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#00ffa3',
            }}>Registered Students</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <svg
                  style={{
                    position: 'absolute', left: '0.6rem', top: '50%',
                    transform: 'translateY(-50%)',
                    width: '13px', height: '13px',
                    color: theme.muted, pointerEvents: 'none',
                  }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className="ap-search"
                  type="text"
                  placeholder="Search student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.52rem 0.8rem 0.52rem 2rem',
                    background: theme.inputBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    width: '185px',
                    caretColor: '#00ffa3',
                    transition: 'border-color 0.18s, box-shadow 0.18s, width 0.25s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                onClick={toggleSelectAll}
                className="ap-btn-blue"
                style={{
                  padding: '0.52rem 0.95rem',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {selectedIds.length === filteredStudents.length && filteredStudents.length > 0 ? 'Deselect All' : 'Select All Filtered'}
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="ap-btn-delete"
                  style={{
                    padding: '0.52rem 0.95rem',
                    background: 'linear-gradient(135deg, #ff4d6d, #c9184a)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Delete ({selectedIds.length})
                </button>
              )}

              <button
                className="ap-btn-primary"
                onClick={generatePDF}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.52rem 0.95rem',
                  background: 'linear-gradient(135deg, #00c87a, #009e60)',
                  color: '#001a0e',
                  border: 'none',
                  borderRadius: '6px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'background 0.18s, box-shadow 0.18s, transform 0.1s',
                  boxShadow: '0 2px 10px rgba(0,200,122,0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '14px', height: '14px' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '0.65rem 1rem' }}></th>
                  {['Student ID', 'Joined Date', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '0.65rem 1rem',
                      textAlign: 'left',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.66rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#2e4a60',
                      fontWeight: 600,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="ap-row" style={{ transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.82rem 1rem', borderBottom: `1px solid ${theme.border}` }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(student._id)} 
                        onChange={() => toggleSelect(student._id)}
                        style={{ cursor: 'pointer', accentColor: '#00ffa3' }}
                      />
                    </td>

                    <td style={{
                      padding: '0.82rem 1rem',
                      borderBottom: `1px solid ${theme.border}`,
                      verticalAlign: 'middle',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#00ffa3',
                    }}>
                      {student.studentId}
                      {student.isBlocked && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.6rem', background: '#ff4d6d', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '3px', textTransform: 'uppercase' }}>Blocked</span>
                      )}
                    </td>

                    <td style={{
                      padding: '0.82rem 1rem',
                      borderBottom: `1px solid ${theme.border}`,
                      verticalAlign: 'middle',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.76rem',
                      color: theme.muted,
                    }}>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{
                      padding: '0.82rem 1rem',
                      borderBottom: `1px solid ${theme.border}`,
                      verticalAlign: 'middle',
                    }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {messagingId === student.studentId ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <input
                              className="ap-inline-input"
                              placeholder="Type message..."
                              value={adminMsg}
                              onChange={(e) => setAdminMsg(e.target.value)}
                              style={{ padding: '0.38rem 0.65rem', background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '5px', color: theme.text, fontSize: '0.75rem', width: '150px' }}
                            />
                            <button onClick={() => handleSendMessage(student.studentId)} className="ap-btn-save" style={{ padding: '0.38rem 0.8rem', background: '#9333ea', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.73rem' }}>Send</button>
                            <button onClick={() => setMessagingId(null)} className="ap-btn-cancel" style={{ padding: '0.38rem 0.8rem', background: 'transparent', color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: '5px', cursor: 'pointer', fontSize: '0.73rem' }}>X</button>
                          </div>
                        ) : editingId === student.studentId ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <input
                            className="ap-inline-input"
                            type="text"
                            placeholder="New password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            style={{
                              padding: '0.38rem 0.65rem',
                              background: theme.inputBg,
                              border: `1px solid ${theme.border}`,
                              borderRadius: '5px',
                              color: theme.text,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.75rem',
                              width: '130px',
                              caretColor: '#00ffa3',
                              transition: 'border-color 0.18s',
                              boxSizing: 'border-box',
                            }}
                          />
                          <button
                            className="ap-btn-save"
                            onClick={() => handleUpdatePassword(student.studentId)}
                            style={{
                              padding: '0.38rem 0.8rem',
                              background: '#15803d',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.73rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'background 0.15s',
                            }}
                          >Save</button>
                          <button
                            className="ap-btn-cancel"
                            onClick={() => setEditingId(null)}
                            style={{
                              padding: '0.38rem 0.8rem',
                              background: 'transparent',
                              color: theme.muted,
                              border: `1px solid ${theme.border}`,
                              borderRadius: '5px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.73rem',
                              cursor: 'pointer',
                              transition: 'background 0.15s, color 0.15s',
                            }}
                          >Cancel</button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="ap-btn-pass"
                            onClick={() => setEditingId(student.studentId)}
                            style={{
                              padding: '0.38rem 0.85rem',
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.73rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >Password</button>
                          <button
                            className="ap-btn-msg"
                            onClick={() => setMessagingId(student.studentId)}
                            style={{
                              padding: '0.38rem 0.85rem',
                              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.73rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >Message</button>
                          <button
                            className="ap-btn-block"
                            onClick={() => handleToggleBlock(student.studentId)}
                            style={{
                              padding: '0.38rem 0.85rem',
                              background: student.isBlocked ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.73rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >{student.isBlocked ? 'Unblock' : 'Block'}</button>
                        </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{
                      textAlign: 'center',
                      padding: '2.8rem',
                      color: theme.muted,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.76rem',
                    }}>
                      {searchTerm ? '// no matches found' : '// no students registered yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section: Support Messages ── */}
        <div style={{
          marginTop: '2rem',
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '14px',
          padding: '1.75rem',
          position: 'relative',
        }}>
          <h2 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#3b82f6',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>Support Inquiries</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contactMessages.map((msg) => (
              <div key={msg._id} style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '10px',
                padding: '1.2rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#00ffa3', fontWeight: 700, fontSize: '0.8rem' }}>{msg.subject}</span>
                  <button 
                    onClick={() => handleDeleteMessage(msg._id)}
                    style={{ background: 'none', border: 'none', color: '#ff4d6d', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: theme.text }}>{msg.message}</p>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.4rem', 
                  paddingTop: '0.8rem', 
                  borderTop: `1px solid ${theme.border}`,
                  fontSize: '0.7rem'
                }}>
                  <div style={{ color: theme.muted }}>
                    From: <span style={{ color: theme.text }}>{msg.name}</span> ({msg.email})
                  </div>
                  {msg.studentId && (
                    <div style={{ color: '#3b82f6' }}>Student IT: {msg.studentId}</div>
                  )}
                  {msg.studentDetails && (
                    <div style={{ color: '#00ffa3', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                      <span>Age: {msg.studentDetails.age}</span>
                      <span>Year: {msg.studentDetails.year}</span>
                      <span>Sem: {msg.studentDetails.semester}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {contactMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: theme.muted, fontSize: '0.8rem' }}>
                // No messages to display
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
