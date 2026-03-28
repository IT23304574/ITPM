import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="mb-8">
      <input 
        type="text" 
        placeholder="Search destination (e.g. Campus, Station...)" 
        className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;