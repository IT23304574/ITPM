import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../utils/api';
import RegistrationRequestForm from '../components/RegistrationRequestForm';

const Login = ({ setUser }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const role = location.state?.role || 'Student';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/login', { studentId, password, role });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        alert(err.response.data.msg);
      } else {
        alert("Login failed. Please check if the backend server is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      {/* Enhanced Navigation Bar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">IT</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-wide">
            ITPM Project
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link 
            to="/" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-105"
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Contact Us
          </Link>
          <Link 
            to="/faq" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 hover:scale-105"
          >
            FAQ
          </Link>
          
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          
          <Link 
            to="/login" 
            state={{ role: 'Admin' }}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            Admin Login
          </Link>
          <Link 
            to="/login" 
            state={{ role: 'Student' }}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
          >
            Student Login
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center gap-8 relative z-10 w-full max-w-6xl">
          {/* Registration Request Form for Students */}
          {role === 'Student' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700/50 w-full max-w-md shadow-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:shadow-emerald-500/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">New Student?</h3>
                <p className="text-gray-400 text-sm">Request registration to get started</p>
              </div>
              <RegistrationRequestForm />
            </div>
          )}

          {/* Login Form */}
          <form 
            onSubmit={handleLogin} 
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700/50 w-full max-w-md shadow-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:shadow-emerald-500/20"
          >
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                role === 'Admin' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              } shadow-lg`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {role} Login
              </h2>
              <p className="text-gray-400 text-sm">
                Welcome back! Please enter your credentials
              </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {role === 'Admin' ? "Admin ID" : "Student ID"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder={role === 'Admin' ? "Enter admin ID" : "Enter student ID"}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-4 mb-6">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2" />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-300">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                role === 'Admin'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/50'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-emerald-500/50'
              } text-white transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {/* Additional Info */}
            {role === 'Student' && (
              <p className="text-center text-gray-400 text-sm mt-6">
                Don't have an account?{' '}
                <span className="text-emerald-400 font-semibold">
                  Request registration above
                </span>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>© 2024 ITPM Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;