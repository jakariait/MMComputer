import * as React from 'react';
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  className,
  triggerClassName,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef(null);
  const searchInputRef = React.useRef(null);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const selectedOption = options.find((option) => option.value === value);

  React.useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onValueChange(optionValue === value ? '' : optionValue);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onValueChange('');
    setSearch('');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border-0 bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          triggerClassName,
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="size-4 rounded-sm opacity-50 hover:opacity-100 flex items-center justify-center"
            >
              <XIcon className="size-3" />
            </span>
          )}
          <ChevronDownIcon
            className={cn('size-4 opacity-50 transition-transform', open && 'rotate-180')}
          />
        </div>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border-0 bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center border-b-0 px-3 py-2">
            <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-8 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-2 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground',
                    value === option.value && 'bg-accent text-accent-foreground',
                  )}
                >
                  <span className="absolute right-2 flex size-3.5 items-center justify-center">
                    {value === option.value && <CheckIcon className="size-4" />}
                  </span>
                  <span className="truncate">{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { SearchableSelect };
