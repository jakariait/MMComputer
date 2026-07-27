import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const HeaderSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || '',
  );
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}&page=1`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const openSearch = () => {
    setIsOpen(true);
  };

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ease-in-out rounded-full border ${
          isOpen
            ? 'w-56 sm:w-72 border-gray-300 bg-white shadow-sm ring-1 ring-gray-200'
            : 'w-10 border-transparent'
        }`}
      >
        <button
          onClick={isOpen ? handleSearch : openSearch}
          className="flex-shrink-0 p-2 rounded-full cursor-pointer  transition-colors"
          aria-label={isOpen ? 'Search' : 'Open search'}
        >
          <Search
            className={`md:w-8 md:h-8 transition-colors ${
              isOpen ? 'text-gray-900' : 'text-white'
            }`}
          />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 transition-all duration-300 ${
            isOpen
              ? 'w-full opacity-100 px-1'
              : 'w-0 opacity-0 px-0 pointer-events-none'
          }`}
        />

        {isOpen && searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="flex-shrink-0 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderSearch;
