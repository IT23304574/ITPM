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
    .ap-row:hover { background: #111d2b !important; }
    .ap-input:focus  { border-color:#00c87a !important; box-shadow:0 0 0 3px rgba(0,255,163,0.18) !important; background:#0a1520 !important; outline:none; }
    .ap-search:focus { border-color:#00c87a !important; box-shadow:0 0 0 3px rgba(0,255,163,0.18) !important; outline:none; width:220px !important; }
    .ap-inline-input:focus { border-color:#00c87a !important; outline:none; }
    .ap-btn-primary:hover  { background:linear-gradient(135deg,#00ffa3,#00c87a) !important; box-shadow:0 4px 22px rgba(0,255,163,0.38) !important; }
    .ap-btn-blue:hover     { background:linear-gradient(135deg,#60a5fa,#3b82f6) !important; box-shadow:0 4px 22px rgba(59,130,246,0.38) !important; }
    .ap-btn-save:hover     { background:#16a34a !important; }
    .ap-btn-cancel:hover   { background:#1e2d3d !important; color:#dce9f5 !important; }
    .ap-btn-pass:hover     { background:linear-gradient(135deg,#60a5fa,#3b82f6) !important; }
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
  const [newPass, setNewPass]       = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s =>
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchStudents = async () => {
    try { const { data } = await getAllStudents(); setStudents(data); }
    catch (err) { console.error('Error fetching students:', err); }
  };

  useEffect(() => { fetchStudents(); }, []);

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#080b10',
      backgroundImage: `
        linear-gradient(rgba(0,255,163,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,163,0.025) 1px, transparent 1px),
        radial-gradient(ellipse 80% 45% at 50% 0%, rgba(0,255,163,0.055) 0%, transparent 65%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
      fontFamily: "'DM Sans', sans-serif",
      color: '#dce9f5',
      padding: '2.5rem 1.75rem',
    }}>
      <div style={{
        maxWidth: '940px',
        margin: '0 auto',
        animation: 'pageFade 0.55s ease both',
      }}>

        {/* ── Page Title ── */}
        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.6rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textAlign: 'center',
          marginBottom: '2.5rem',
          color: '#dce9f5',
        }}>
          <span style={{ color: '#00ffa3', marginRight: '0.4rem', fontSize: '1.1rem' }}>//</span>
          Admin Dashboard
        </h1>

        {/* ── Top Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.4rem',
          marginBottom: '1.4rem',
        }}>

          {/* ── Card: Admin Actions ── */}
          <div style={{
            background: '#0d1520',
            border: '1px solid #1a2b3c',
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
              color: '#6b8fa8',
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
            background: '#0d1520',
            border: '1px solid #1a2b3c',
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
                  color: '#6b8fa8',
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
                    background: '#070d14',
                    border: '1px solid #1a2b3c',
                    borderRadius: '6px',
                    color: '#dce9f5',
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
                  color: '#6b8fa8',
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
                    background: '#070d14',
                    border: '1px solid #1a2b3c',
                    borderRadius: '6px',
                    color: '#dce9f5',
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
          background: '#0d1520',
          border: '1px solid #1a2b3c',
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
                    color: '#2e4a60', pointerEvents: 'none',
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
                    background: '#070d14',
                    border: '1px solid #1a2b3c',
                    borderRadius: '6px',
                    color: '#dce9f5',
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
                <tr style={{ borderBottom: '1px solid #1a2b3c' }}>
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

                    <td style={{
                      padding: '0.82rem 1rem',
                      borderBottom: '1px solid rgba(26,43,60,0.5)',
                      verticalAlign: 'middle',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#00ffa3',
                    }}>
                      {student.studentId}
                    </td>

                    <td style={{
                      padding: '0.82rem 1rem',
                      borderBottom: '1px solid rgba(26,43,60,0.5)',
                      verticalAlign: 'middle',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.76rem',
                      color: '#6b8fa8',
                    }}>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{
                      padding: '0.82rem 1rem',
                      borderBottom: '1px solid rgba(26,43,60,0.5)',
                      verticalAlign: 'middle',
                    }}>
                      {editingId === student.studentId ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <input
                            className="ap-inline-input"
                            type="text"
                            placeholder="New password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            style={{
                              padding: '0.38rem 0.65rem',
                              background: '#070d14',
                              border: '1px solid #1a2b3c',
                              borderRadius: '5px',
                              color: '#dce9f5',
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
                              color: '#6b8fa8',
                              border: '1px solid #1a2b3c',
                              borderRadius: '5px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.73rem',
                              cursor: 'pointer',
                              transition: 'background 0.15s, color 0.15s',
                            }}
                          >Cancel</button>
                        </div>
                      ) : (
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
                            transition: 'background 0.15s, box-shadow 0.15s',
                          }}
                        >Change Password</button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{
                      textAlign: 'center',
                      padding: '2.8rem',
                      color: '#2e4a60',
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

      </div>
    </div>
  );
};

export default AdminPanel;
