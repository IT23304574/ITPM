import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const ChatModal = ({ tripId, isOpen, onClose, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Constants for validation
  const MAX_MESSAGE_LENGTH = 20;
  const MIN_MESSAGE_LENGTH = 1;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

  // Validation: Check for special characters
  const hasSpecialCharacters = (message) => {
    const specialCharsPattern = /[\[\]';\/.,<>?:"{}|`~!@#$%^&*()_+=\\]/;
    return specialCharsPattern.test(message);
  };

  // Get special characters found in message
  const getSpecialCharacters = (message) => {
    const specialCharsPattern = /[\[\]';\/.,<>?:"{}|`~!@#$%^&*()_+=\\]/g;
    const found = message.match(specialCharsPattern);
    if (found) {
      const unique = [...new Set(found)];
      return unique.join(', ');
    }
    return '';
  };

  // Remove special characters from message
  const removeSpecialCharacters = (message) => {
    const specialCharsPattern = /[\[\]';\/.,<>?:"{}|`~!@#$%^&*()_+=\\]/g;
    return message.replace(specialCharsPattern, '');
  };

  // Validation: Empty message, Min 1 char, Max 20 chars, No special characters
  const validateMessage = (message) => {
    const trimmed = message.trim();
    
    // Empty message validation
    if (!trimmed) {
      return { isValid: false, error: "Message cannot be empty" };
    }
    
    // Check for special characters
    if (hasSpecialCharacters(trimmed)) {
      const specialChars = getSpecialCharacters(trimmed);
      return { 
        isValid: false, 
        error: `Cannot send message with special characters: ${specialChars}. Please use only letters, numbers, and spaces.`,
        hasSpecialChars: true,
        cleanedMessage: removeSpecialCharacters(trimmed)
      };
    }
    
    // Minimum 1 character validation
    if (trimmed.length < MIN_MESSAGE_LENGTH) {
      return { isValid: false, error: `Message must be at least ${MIN_MESSAGE_LENGTH} character` };
    }
    
    // Maximum 20 characters validation
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return { isValid: false, error: `Message too long! Max ${MAX_MESSAGE_LENGTH} characters only` };
    }
    
    return { isValid: true, error: null, cleanedMessage: trimmed };
  };

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(
        `http://localhost:5000/api/trips/${tripId}/chat`,
        {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`
          },
          timeout: 10000
        }
      );

      if (res.data && Array.isArray(res.data)) {
        setMessages(res.data);
        setError('');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to load messages');
    }
  }, [tripId, getToken]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    
    setError('');
    
    const rawMessage = newMessage;
    const trimmed = rawMessage.trim();
    
    // Content validation (empty, min 1, max 20, no special chars)
    const contentValidation = validateMessage(rawMessage);
    if (!contentValidation.isValid) {
      setError(contentValidation.error);
      
      // If message has special characters, offer to clean it
      if (contentValidation.hasSpecialChars && contentValidation.cleanedMessage) {
        // Auto-clean the message and show suggestion
        const cleanedMsg = contentValidation.cleanedMessage;
        if (cleanedMsg.length > 0) {
          setError(`${contentValidation.error} Would you like to send "${cleanedMsg}" instead?`);
          // Store cleaned message for suggestion
          setNewMessage(cleanedMsg);
        }
      }
      
      inputRef.current?.focus();
      return;
    }
    
    if (sending) {
      setError("Please wait...");
      return;
    }
    
    try {
      setSending(true);
      
      const token = getToken();
      if (!token) {
        setError("Unauthorized");
        setSending(false);
        return;
      }
      
      // Send cleaned message
      const messageToSend = contentValidation.cleanedMessage || trimmed;
      
      await axios.post(
        `http://localhost:5000/api/trips/${tripId}/chat`,
        { message: messageToSend },
        {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      setNewMessage('');
      setError('');
      await fetchMessages();
      scrollToBottom();
      
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Handle input change with max length enforcement and special character blocking
  const handleInputChange = (e) => {
    let value = e.target.value;
    
    // Block special characters while typing
    const specialCharsPattern = /[\[\]';\/.,<>?:"{}|`~!@#$%^&*()_+=\\]/;
    if (specialCharsPattern.test(value)) {
      // Show temporary error but don't block typing completely
      setError('Special characters like [ ] \' ; / . , are not allowed');
      setTimeout(() => {
        if (error === 'Special characters like [ ] \' ; / . , are not allowed') {
          setError('');
        }
      }, 2000);
    }
    
    // Enforce max 20 characters at input level
    if (value.length > MAX_MESSAGE_LENGTH) {
      value = value.slice(0, MAX_MESSAGE_LENGTH);
    }
    
    setNewMessage(value);
    
    // Clear general error when user starts typing
    if (error && !error.includes('Special characters')) {
      setError('');
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
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      const interval = setInterval(() => {
        if (isOpen && !sending) {
          fetchMessages();
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, tripId, fetchMessages, scrollToBottom, sending]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
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
  
  const charCount = newMessage.length;
  const isAtLimit = charCount >= MAX_MESSAGE_LENGTH;
  const hasSpecialChars = /[\[\]';\/.,<>?:"{}|`~!@#$%^&*()_+=\\]/.test(newMessage);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md h-[600px] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-2xl">
          <h3 className="text-white font-bold text-lg">💬 Trip Chat</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl transition-colors"
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
              <p className="text-gray-500 text-sm">✨ No messages yet. Say hi!</p>
              <p className="text-gray-600 text-xs mt-1">Max {MAX_MESSAGE_LENGTH} characters • No special characters allowed</p>
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
                          👤 {msg.sender?.studentId || 'User'}
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
                        🕐 {new Date(msg.timestamp).toLocaleTimeString([], {
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
          {/* Error message display */}
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="text-xs">
              {error ? (
                <span className="text-red-400">{error}</span>
              ) : (
                <span className="text-gray-400">
                  {sending && <span className="inline-block animate-pulse">⏳ Sending...</span>}
                </span>
              )}
            </div>
            <div className="text-xs font-mono">
              <span className={isAtLimit ? 'text-red-400 font-bold' : 'text-gray-400'}>
                📝 {charCount}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder={`Type message (${MIN_MESSAGE_LENGTH}-${MAX_MESSAGE_LENGTH} chars, no special chars)...`}
              disabled={sending}
              className={`flex-1 bg-gray-700 text-white border rounded-full px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors ${
                error && !sending ? 'border-red-500' : hasSpecialChars ? 'border-yellow-500' : 'border-gray-600'
              } ${sending ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending || hasSpecialChars}
              className={`bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                sending ? 'animate-pulse' : ''
              }`}
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
          
          {/* Rules display */}
          <div className="text-xs text-center mt-2">
            <span className="text-emerald-500">✨ {MIN_MESSAGE_LENGTH}-{MAX_MESSAGE_LENGTH} characters</span>
            <span className="text-gray-600 mx-2">•</span>
            <span className="text-gray-500">⏎ Press Enter to send</span>
            <span className="text-gray-600 mx-2">•</span>
            <span className="text-yellow-500">🚫 No special characters</span>
          </div>
          
          {/* Special characters warning */}
          {hasSpecialChars && (
            <div className="text-xs text-center mt-1 text-yellow-500">
              ⚠️ Remove special characters like [ ] ' ; / . , to send message
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatModal;