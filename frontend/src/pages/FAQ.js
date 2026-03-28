import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm the RideShare support bot. Click on a question below to get an answer.", sender: 'bot' }
  ]);
  const user = JSON.parse(localStorage.getItem('user'));
  const messagesEndRef = useRef(null);

  const faqData = [
    { q: "How do I join a trip?", a: "Log in as a student, browse available rides on the dashboard, and click the 'Join Trip' button." },
    { q: "Is this service free?", a: "The platform is free to use for coordination. However, passengers are expected to share the fare as indicated by the trip organizer." },
    { q: "How do I post a ride?", a: "After logging in, click the '+ Post a Trip' button on your dashboard, fill in the details like destination, vehicle type, and fare, and submit." },
    { q: "Can I cancel my ride?", a: "Yes, organizers can cancel trips they posted, and passengers can leave trips they have joined before the trip starts." },
    { q: "How do I contact the trip organizer?", a: "Once you join a trip, the organizer's contact number is visible in the trip details." },
    { q: "What vehicles are available?", a: "We support TukTuks, Small Cars, Medium Cars, and Vans." },
    { q: "How is the fare calculated?", a: "The total fare is set by the organizer. It is usually divided among passengers." },
    { q: "Can I change my profile picture?", a: "Yes, go to your dashboard sidebar and click on your profile image to upload a new one." },
    { q: "What if I forget my password?", a: "Contact the admin to reset your password if you cannot log in." },
    { q: "Is my data safe?", a: "Yes, we use secure authentication and only share necessary details with trip participants." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = (faq) => {
    setMessages(prev => [...prev, { text: faq.q, sender: 'user' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: faq.a, sender: 'bot' }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {!user && (
      <nav className="w-full flex justify-between items-center p-6 bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="text-2xl font-bold text-emerald-400 tracking-wide">
          ITPM Project
        </div>
        <div className="space-x-4">
          <Link 
            to="/" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition duration-300"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition duration-300"
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition duration-300"
          >
            Contact Us
          </Link>
          <Link 
            to="/faq" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition duration-300"
          >
            FAQ
          </Link>
          <Link 
            to="/login" 
            state={{ role: 'Admin' }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Admin Login
          </Link>
          <Link 
            to="/login" 
            state={{ role: 'Student' }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Student Login
          </Link>
        </div>
      </nav>
      )}

      <div className="flex-grow p-4 md:p-8 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden h-[80vh]">
          <div className="bg-gray-900 p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-emerald-400">FAQ Chat Support</h1>
            <p className="text-gray-400 text-sm">Click a question below to get an instant answer.</p>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-900 border-t border-gray-700">
            <p className="text-gray-400 text-xs mb-2 uppercase font-semibold">Suggested Questions:</p>
            <div className="flex flex-wrap gap-2">
              {faqData.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(faq)}
                  className="bg-gray-700 hover:bg-gray-600 text-emerald-400 text-sm px-3 py-2 rounded-full border border-gray-600 transition text-left"
                >
                  {faq.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;