import React from 'react';

const Toast = ({ message, type }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-emerald-900 border-emerald-700' : 'bg-red-900 border-red-700';

  return (
    <div className={`fixed bottom-5 right-5 p-4 rounded-lg border shadow-2xl ${bgColor} text-white transition-all animate-bounce`}>
      {message}
    </div>
  );
};

export default Toast;