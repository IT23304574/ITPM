import React, { useState, useEffect } from 'react';
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

        {/* Section 3: Registered Students List */}
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

export default AdminPanel;