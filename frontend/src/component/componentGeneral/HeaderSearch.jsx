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
    <div ref={containerRef} className="relative flex items-center">
      {fullSize ? (
        <div className="flex items-center w-100 rounded bg-white/90">
          <button
            onClick={handleSearch}
            className="flex-shrink-0 p-1.5 cursor-pointer transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-black" />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none w-full opacity-100 px-2 py-2.5 text-base text-gray-700 placeholder-black/80"
          />

          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="flex-shrink-0 p-1.5 cursor-pointer transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={isOpen ? handleSearch : openSearch}
            className="flex-shrink-0 p-2 rounded-full cursor-pointer transition-colors"
            aria-label={isOpen ? 'Search' : 'Open search'}
          >
            <Search
              className={`md:w-8 md:h-8 transition-colors ${
                isOpen ? 'text-gray-900' : 'text-white'
              }`}
            />
          </button>

          {isOpen && (
            <div className="fixed top-13  inset-x-0 flex items-center gap-2 px-4 py-3 rounded-none border-b border-gray-300 bg-white shadow-lg z-50">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-base text-gray-700 placeholder-gray-400"
              />

              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="flex-shrink-0 p-1.5 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeaderSearch;
