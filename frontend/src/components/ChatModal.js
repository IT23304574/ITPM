import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatModal = ({ tripId, isOpen, onClose, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get token safely
  const getToken = () => {
    let token =
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('token');

    if (!token || token === 'undefined') {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        token = user?.token || null;
      } catch {
        token = null;
      }
    }
    return token;
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(
        `http://localhost:5000/api/trips/${tripId}/chat`,
        {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages(prev => {
        return JSON.stringify(prev) !== JSON.stringify(res.data)
          ? res.data
          : prev;
      });

      setError('');
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to load messages');
    }
  };

  // Load & poll
  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);

      fetchMessages().finally(() => {
        setLoading(false);
        scrollToBottom();
      });

      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, tripId]);

  // Auto scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();

    const trimmed = newMessage.trim();

    // ✅ Validations
    if (!trimmed) {
      setError("Message cannot be empty");
      return;
    }

    if (trimmed.length > 300) {
      setError("Message too long (max 300 characters)");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError("Unauthorized");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/trips/${tripId}/chat`,
        { message: trimmed },
        {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewMessage('');
      setError('');
      fetchMessages(); // instant refresh
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send message");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md h-[600px] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-2xl">
          <h3 className="text-white font-bold text-lg">Trip Chat</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
          {loading && messages.length === 0 ? (
            <p className="text-center text-gray-500">Loading chat...</p>
          ) : error ? (
            <p className="text-center text-red-400 text-sm">{error}</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">No messages yet. Say hi!</p>
          ) : (
            messages.map((msg, idx) => {
              const isMe =
                msg.sender?._id === currentUserId ||
                msg.sender === currentUserId;

              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isMe
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {!isMe && (
                      <div className="text-xs text-emerald-400 font-bold mb-1">
                        {msg.sender?.studentId || 'User'}
                      </div>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isMe ? 'text-emerald-200' : 'text-gray-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-2xl flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (error) setError('');
            }}
            maxLength={300}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transform rotate-90"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;