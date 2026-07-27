import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const HeaderSearch = ({ fullSize }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(fullSize ?? false);
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || '',
  );
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}&page=1`);
      if (!fullSize) setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape' && !fullSize) {
      setIsOpen(false);
    }
  };

  const openSearch = () => {
    if (!fullSize) setIsOpen(true);
  };

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (fullSize) setIsOpen(true);
  }, [fullSize]);

  // Close on click outside (only when not fullSize)
  useEffect(() => {
    if (fullSize) return;
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
  }, [isOpen, fullSize]);

  return (
    <div ref={containerRef} className="relative  flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${
          fullSize
            ? 'w-150 rounded bg-white/90'
            : `rounded-full border ${
                isOpen
                  ? 'w-50 border-gray-300 bg-white shadow-sm ring-1 ring-gray-200'
                  : 'w-10 border-transparent'
              }`
        }`}
      >
        <button
          onClick={fullSize || isOpen ? handleSearch : openSearch}
          className={`flex-shrink-0 cursor-pointer transition-colors ${
            fullSize ? 'p-1.5 ' : 'p-2 rounded-full'
          }`}
          aria-label={fullSize || isOpen ? 'Search' : 'Open search'}
        >
          <Search
            className={`transition-colors ${
              fullSize ? 'w-5 h-5 text-black' : 'md:w-8 md:h-8 text-gray-900'
            } ${!fullSize && !isOpen ? 'text-white' : ''}`}
          />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none transition-all duration-300 ${
            fullSize
              ? 'w-full opacity-100 px-2 py-2.5 text-base text-gray-700 placeholder-black/80'
              : `text-gray-700 placeholder-gray-400 text-sm ${
                  isOpen
                    ? 'w-full opacity-100 px-1'
                    : 'w-0 opacity-0 px-0 pointer-events-none'
                }`
          }`}
        />

        {(fullSize || isOpen) && searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className={`flex-shrink-0 cursor-pointer transition-colors ${
              fullSize ? 'p-1.5' : 'p-2 rounded-full hover:bg-gray-100'
            }`}
            aria-label="Clear search"
          >
            <X
              className={
                fullSize ? 'w-4 h-4 text-gray-400' : 'w-4 h-4 text-gray-400'
              }
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderSearch;
