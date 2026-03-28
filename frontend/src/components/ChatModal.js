import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const ChatModal = ({ tripId, isOpen, onClose, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [lastSendTime, setLastSendTime] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Constants for validation
  const MAX_MESSAGE_LENGTH = 300;
  const MIN_MESSAGE_LENGTH = 1;
  const RATE_LIMIT_MS = 1000; // 1 second between messages
  const MAX_MESSAGES_PER_MINUTE = 10;

  // Message send tracking for rate limiting
  const [messageTimestamps, setMessageTimestamps] = useState([]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Get token safely
  const getToken = useCallback(() => {
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
  }, []);

  // Sanitize message (XSS protection)
  const sanitizeMessage = (message) => {
    return message
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .trim();
  };

  // Validate message content
  const validateMessage = (message) => {
    const trimmed = message.trim();
    
    // Empty message validation
    if (!trimmed) {
      return { isValid: false, error: "Message cannot be empty" };
    }
    
    // Minimum length validation
    if (trimmed.length < MIN_MESSAGE_LENGTH) {
      return { isValid: false, error: `Message must be at least ${MIN_MESSAGE_LENGTH} character(s)` };
    }
    
    // Maximum length validation
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return { isValid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` };
    }
    
    // Only whitespace validation
    if (/^\s+$/.test(trimmed)) {
      return { isValid: false, error: "Message cannot be only spaces" };
    }
    
    // Profanity filter (add your bad words list)
    const badWords = ['badword1', 'badword2', 'offensive']; // Configure as needed
    const hasProfanity = badWords.some(word => 
      trimmed.toLowerCase().includes(word.toLowerCase())
    );
    
    if (hasProfanity) {
      return { isValid: false, error: "Message contains inappropriate language" };
    }
    
    // Check for excessive special characters
    const specialCharCount = (trimmed.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
    if (specialCharCount > trimmed.length * 0.5) {
      return { isValid: false, error: "Message contains too many special characters" };
    }
    
    // Check for repetitive characters
    const repetitivePattern = /(.)\1{4,}/;
    if (repetitivePattern.test(trimmed)) {
      return { isValid: false, error: "Message contains too many repeated characters" };
    }
    
    return { isValid: true, error: null };
  };

  // Rate limiting validation
  const validateRateLimit = () => {
    const now = Date.now();
    
    // Remove timestamps older than 1 minute
    const recentMessages = messageTimestamps.filter(
      timestamp => now - timestamp < 60000
    );
    
    // Check messages per minute limit
    if (recentMessages.length >= MAX_MESSAGES_PER_MINUTE) {
      return { 
        isValid: false, 
        error: `Please wait a moment before sending more messages (${MAX_MESSAGES_PER_MINUTE} messages per minute limit)` 
      };
    }
    
    // Check time between messages
    if (now - lastSendTime < RATE_LIMIT_MS) {
      const waitTime = Math.ceil((RATE_LIMIT_MS - (now - lastSendTime)) / 1000);
      return { 
        isValid: false, 
        error: `Please wait ${waitTime} second(s) before sending another message` 
      };
    }
    
    return { isValid: true, error: null };
  };

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/trips/${tripId}/chat`,
        {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Validate response data
      if (res.data && Array.isArray(res.data)) {
        setMessages(prev => {
          return JSON.stringify(prev) !== JSON.stringify(res.data)
            ? res.data
            : prev;
        });
        setError('');
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again');
      } else if (err.response?.status === 403) {
        setError('You don\'t have permission to view this chat');
      } else {
        setError('Failed to load messages. Please try again');
      }
    }
  }, [tripId, getToken]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Trim and sanitize message
    const trimmed = newMessage.trim();
    const sanitized = sanitizeMessage(trimmed);
    
    // Content validation
    const contentValidation = validateMessage(sanitized);
    if (!contentValidation.isValid) {
      setError(contentValidation.error);
      inputRef.current?.focus();
      return;
    }
    
    // Rate limiting validation
    const rateValidation = validateRateLimit();
    if (!rateValidation.isValid) {
      setError(rateValidation.error);
      return;
    }
    
    // Check if already sending
    if (sending) {
      setError("Message is already being sent");
      return;
    }
    
    try {
      setSending(true);
      
      const token = getToken();
      if (!token) {
        setError("Authentication required. Please login again");
        setSending(false);
        return;
      }
      
      // Add to rate limiting tracking
      const now = Date.now();
      setLastSendTime(now);
      setMessageTimestamps(prev => [...prev, now]);
      
      await axios.post(
        `http://localhost:5000/api/trips/${tripId}/chat`,
        { message: sanitized },
        {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Clear input and refresh messages
      setNewMessage('');
      setError('');
      await fetchMessages(); // Wait for refresh
      scrollToBottom();
      
    } catch (err) {
      console.error("Send error:", err);
      
      // Handle different error types
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again');
      } else if (err.response?.status === 403) {
        setError('You don\'t have permission to send messages');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Invalid message format');
      } else if (err.response?.status === 429) {
        setError('Too many messages. Please wait a moment');
      } else {
        setError('Failed to send message. Please try again');
      }
    } finally {
      setSending(false);
    }
  };

  // Handle input change with real-time validation
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    // Real-time character count warning
    if (value.length > MAX_MESSAGE_LENGTH * 0.9) {
      const remaining = MAX_MESSAGE_LENGTH - value.length;
      if (remaining <= 10) {
        setError(`Only ${remaining} character(s) left`);
      }
    }
  };

  // Load messages when modal opens
  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);
      setError('');
      
      fetchMessages()
        .finally(() => {
          setLoading(false);
          scrollToBottom();
        });
      
      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      // Poll for new messages (reduced frequency for better performance)
      const interval = setInterval(() => {
        if (isOpen && !sending) {
          fetchMessages();
        }
      }, 5000); // Increased to 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isOpen, tripId, fetchMessages, scrollToBottom, sending]);
  
  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Clean up old message timestamps periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setMessageTimestamps(prev => 
        prev.filter(timestamp => now - timestamp < 60000)
      );
    }, 30000);
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Character count for display
  const charCount = newMessage.length;
  const isNearLimit = charCount > MAX_MESSAGE_LENGTH * 0.8;
  const isAtLimit = charCount >= MAX_MESSAGE_LENGTH;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md h-[600px] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-2xl">
          <h3 className="text-white font-bold text-lg">Trip Chat</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl transition-colors"
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading chat...</p>
              </div>
            </div>
          ) : error && messages.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={fetchMessages}
                className="mt-2 text-emerald-400 text-sm hover:text-emerald-300"
              >
                Try again
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-gray-500 text-sm">No messages yet. Say hi!</p>
              <p className="text-gray-600 text-xs mt-1">Be the first to start the conversation</p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const isMe =
                  msg.sender?._id === currentUserId ||
                  msg.sender === currentUserId;
                
                return (
                  <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
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
                      <p className="text-sm break-words whitespace-pre-wrap">
                        {msg.message}
                      </p>
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
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-2xl"
        >
          {/* Character counter and error display */}
          {(charCount > 0 || error) && (
            <div className="flex justify-between items-center mb-2 px-2">
              <div className="text-xs">
                {error ? (
                  <span className="text-red-400">{error}</span>
                ) : (
                  <span className="text-gray-400">
                    {sending && <span className="inline-block animate-pulse">Sending...</span>}
                  </span>
                )}
              </div>
              <div className="text-xs">
                <span className={isNearLimit ? (isAtLimit ? 'text-red-400' : 'text-yellow-400') : 'text-gray-400'}>
                  {charCount}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Type a message..."
              disabled={sending}
              className={`flex-1 bg-gray-700 text-white border rounded-full px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors ${
                error && !sending ? 'border-red-500' : 'border-gray-600'
              } ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending || isAtLimit}
              className={`bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                sending ? 'animate-pulse' : ''
              }`}
              aria-label="Send message"
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
          </div>
          
          {/* Help text */}
          <div className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Max {MAX_MESSAGE_LENGTH} characters
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;