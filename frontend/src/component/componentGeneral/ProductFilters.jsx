import { useState, useRef, useEffect } from 'react';
import { FormControl } from '@/components/ui/form-control';
import { InputLabel } from '@/components/ui/input-label';
import { MenuItem } from '@/components/ui/menu-item';
import { Select } from '@/components/ui/legacy-select';
import { Typography } from '@/components/ui/typography';
import { Drawer } from '@/components/ui/drawer';
import { IconButton } from '@/components/ui/icon-button';
import {
  X as CloseIcon,
  ArrowDownWideNarrow,
  SlidersHorizontal,
  Search,
} from 'lucide-react';

const PRICE_SLIDER_MIN = 0;
const PRICE_SLIDER_MAX = 500000;
const PRICE_SLIDER_STEP = 1000;

const FilterContent = ({
  filters,
  categories,
  activeFlags,
  brands,
  searchInput,
  handleSearchChange,
  handleClearSearch,
  handleFilterChange,
  handleItemsPerPageChange,
  minPriceInput,
  setMinPriceInput,
  maxPriceInput,
  setMaxPriceInput,
  handleApplyPriceRange,
  handleClearPriceRange,
  priceSlider,
  sliderMinValue,
  sliderMaxValue,
}) => (
  <div className="flex flex-col">
    {/* Search */}
    <div className="relative pb-4 border-b border-gray-200">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <label htmlFor="filter-search" className="sr-only">
        Search products
      </label>
      <input
        id="filter-search"
        placeholder="Search products..."
        value={searchInput}
        onChange={handleSearchChange}
        className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-8 py-1 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
      />
      {searchInput && (
        <button
          onClick={handleClearSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>

    {/* Category */}
    <div className="py-3 border-b border-gray-200">
      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5 block">
        Category
      </label>
      <Select
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <MenuItem value="">
          <em>All Categories</em>
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat.name}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </div>

    {/* Flag */}
    <div className="py-3 border-b border-gray-200">
      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5 block">
        Flag
      </label>
      <Select name="flags" value={filters.flags} onChange={handleFilterChange}>
        <MenuItem value="">
          <em>All Flags</em>
        </MenuItem>
        {activeFlags.map((flag) => (
          <MenuItem key={flag._id} value={flag.name}>
            {flag.name}
          </MenuItem>
        ))}
      </Select>
    </div>

    {/* Stock */}
    <div className="py-3 border-b border-gray-200">
      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5 block">
        Stock
      </label>
      <Select name="stock" value={filters.stock} onChange={handleFilterChange}>
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        <MenuItem value="in">In Stock</MenuItem>
        <MenuItem value="out">Out of Stock</MenuItem>
      </Select>
    </div>

    {/* Brand */}
    <div className="py-3 border-b border-gray-200">
      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5 block">
        Brand
      </label>
      <Select name="brand" value={filters.brand} onChange={handleFilterChange}>
        <MenuItem value="">
          <em>All Brands</em>
        </MenuItem>
        {brands.map((brand) => (
          <MenuItem key={brand._id} value={brand.name}>
            {brand.name}
          </MenuItem>
        ))}
      </Select>
    </div>

    {/* Sort */}
    <div className="py-3 border-b border-gray-200">
      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5 block">
        Sort By
      </label>
      <Select name="sort" value={filters.sort} onChange={handleFilterChange}>
        <MenuItem value="">
          <em>Default</em>
        </MenuItem>
        <MenuItem value="price_high">Price: High to Low</MenuItem>
        <MenuItem value="price_low">Price: Low to High</MenuItem>
        <MenuItem value="name_asc">Name: A to Z</MenuItem>
        <MenuItem value="name_desc">Name: Z to A</MenuItem>
        <MenuItem value="latest">Latest</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
      </Select>
    </div>

    {/* Items per page */}
    <div className="py-3 border-b border-gray-200">
      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5 block">
        Items Per Page
      </label>
      <Select value={filters.limit} onChange={handleItemsPerPageChange}>
        {[5, 10, 20, 50].map((val) => (
          <MenuItem key={val} value={val}>
            {val} items
          </MenuItem>
        ))}
      </Select>
    </div>

    {/* Price Range */}
    <div className="py-3">
      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2 block">
        Price Range (Tk)
      </label>
      <div className="pt-1">
        {priceSlider}
        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
          <span className="font-medium">{sliderMinValue.toLocaleString()}</span>
          <span className="font-medium">{sliderMaxValue.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <input
          type="number"
          min="0"
          placeholder="Min"
          value={minPriceInput}
          onChange={(e) => setMinPriceInput(e.target.value)}
          className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <span className="text-gray-400">—</span>
        <input
          type="number"
          min="0"
          placeholder="Max"
          value={maxPriceInput}
          onChange={(e) => setMaxPriceInput(e.target.value)}
          className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleApplyPriceRange}
          className="flex-1 rounded-lg primaryBgColor accentTextColor py-2 text-sm font-medium hover:opacity-90 cursor-pointer transition-opacity"
        >
          Apply
        </button>
        {(filters.minPrice || filters.maxPrice) && (
          <button
            type="button"
            onClick={handleClearPriceRange}
            className="flex-1 rounded-lg bg-gray-100 text-gray-600 py-2 text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  </div>
);

const ActiveChips = ({ filters, handleClearSearch, handleClearPriceRange }) => {
  const hasFilters =
    filters.search ||
    filters.category ||
    filters.flags ||
    filters.brand ||
    filters.stock !== '' ||
    filters.sort ||
    filters.minPrice ||
    filters.maxPrice;

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {filters.search && (
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <Search size={14} />
          Search: &quot;{filters.search}&quot;
          <button
            onClick={handleClearSearch}
            className="hover:bg-blue-200 rounded-full p-1"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      )}
      {filters.category && (
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          Category: {filters.category}
        </div>
      )}
      {filters.flags && (
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
          Flag: {filters.flags}
        </div>
      )}
      {filters.brand && (
        <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
          Brand: {filters.brand}
        </div>
      )}
      {filters.stock && (
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
          Stock: {filters.stock === 'in' ? 'In Stock' : 'Out of Stock'}
        </div>
      )}
      {filters.sort && (
        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
          Sort:{' '}
          {filters.sort
            .replace('_', ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </div>
      )}
      {(filters.minPrice || filters.maxPrice) && (
        <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          Price:{' '}
          {filters.minPrice
            ? `Tk ${Number(filters.minPrice).toLocaleString()}`
            : 'Tk 0'}
          {' - '}
          {filters.maxPrice
            ? `Tk ${Number(filters.maxPrice).toLocaleString()}`
            : 'Any'}
          <button
            onClick={handleClearPriceRange}
            className="hover:bg-pink-200 rounded-full p-1"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

const ProductFilters = ({
  filters,
  categories = [],
  flags = [],
  brands = [],
  onUpdateFilters,
  mobileOnly = false,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  const searchTimeoutRef = useRef(null);
  const priceSliderTimeoutRef = useRef(null);

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setMinPriceInput(filters.minPrice || '');
    setMaxPriceInput(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (priceSliderTimeoutRef.current)
        clearTimeout(priceSliderTimeoutRef.current);
    };
  }, []);

  const activeFlags = flags.filter((flag) => flag.isActive);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      onUpdateFilters({ ...filters, search: value, page: 1 });
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    onUpdateFilters({ ...filters, search: '', page: 1 });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onUpdateFilters({ ...filters, [name]: value, page: 1 });
    setDrawerOpen(false);
  };

  const handleItemsPerPageChange = (e) => {
    onUpdateFilters({ ...filters, limit: parseInt(e.target.value), page: 1 });
  };

  const handleApplyPriceRange = () => {
    onUpdateFilters({
      ...filters,
      minPrice: minPriceInput.trim(),
      maxPrice: maxPriceInput.trim(),
      page: 1,
    });
    setDrawerOpen(false);
  };

  const handleClearPriceRange = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    onUpdateFilters({ ...filters, minPrice: '', maxPrice: '', page: 1 });
  };

  const handleSliderChange = (type, value) => {
    const num = Math.max(
      PRICE_SLIDER_MIN,
      Math.min(PRICE_SLIDER_MAX, Number(value) || PRICE_SLIDER_MIN),
    );
    let nextMin = minPriceInput;
    let nextMax = maxPriceInput;

    if (type === 'min') {
      const currentMax =
        maxPriceInput === ''
          ? PRICE_SLIDER_MAX
          : Number(maxPriceInput) || PRICE_SLIDER_MAX;
      nextMin = String(Math.min(num, currentMax));
    } else {
      const currentMin =
        minPriceInput === ''
          ? PRICE_SLIDER_MIN
          : Number(minPriceInput) || PRICE_SLIDER_MIN;
      nextMax = String(Math.max(num, currentMin));
    }

    setMinPriceInput(nextMin);
    setMaxPriceInput(nextMax);

    if (priceSliderTimeoutRef.current)
      clearTimeout(priceSliderTimeoutRef.current);
    priceSliderTimeoutRef.current = setTimeout(() => {
      onUpdateFilters({
        ...filters,
        minPrice: nextMin,
        maxPrice: nextMax,
        page: 1,
      });
    }, 300);
  };

  const sliderMinValue =
    minPriceInput === ''
      ? PRICE_SLIDER_MIN
      : Math.max(
          PRICE_SLIDER_MIN,
          Math.min(PRICE_SLIDER_MAX, Number(minPriceInput) || PRICE_SLIDER_MIN),
        );
  const sliderMaxValue =
    maxPriceInput === ''
      ? PRICE_SLIDER_MAX
      : Math.max(
          PRICE_SLIDER_MIN,
          Math.min(PRICE_SLIDER_MAX, Number(maxPriceInput) || PRICE_SLIDER_MAX),
        );
  const sliderMinPct =
    ((sliderMinValue - PRICE_SLIDER_MIN) /
      (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) *
    100;
  const sliderMaxPct =
    ((sliderMaxValue - PRICE_SLIDER_MIN) /
      (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) *
    100;

  const priceSlider = (
    <div className="relative h-5">
      <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full bg-gray-200 rounded-full" />
      <div
        className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full primaryBgColor"
        style={{ left: `${sliderMinPct}%`, right: `${100 - sliderMaxPct}%` }}
      />
      <input
        type="range"
        min={PRICE_SLIDER_MIN}
        max={PRICE_SLIDER_MAX}
        step={PRICE_SLIDER_STEP}
        value={sliderMinValue}
        onChange={(e) => handleSliderChange('min', e.target.value)}
        className="price-range-slider"
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={PRICE_SLIDER_MIN}
        max={PRICE_SLIDER_MAX}
        step={PRICE_SLIDER_STEP}
        value={sliderMaxValue}
        onChange={(e) => handleSliderChange('max', e.target.value)}
        className="price-range-slider"
        aria-label="Maximum price"
      />
    </div>
  );

  const filterProps = {
    filters,
    categories,
    activeFlags,
    brands,
    searchInput,
    handleSearchChange,
    handleClearSearch,
    handleFilterChange,
    handleItemsPerPageChange,
    minPriceInput,
    setMinPriceInput,
    maxPriceInput,
    setMaxPriceInput,
    handleApplyPriceRange,
    handleClearPriceRange,
    priceSlider,
    sliderMinValue,
    sliderMaxValue,
  };

  const sharedProps = { filters, handleClearSearch, handleClearPriceRange };

  // Mobile only mode - render buttons + inline sort + active chips
  if (mobileOnly) {
    return (
      <>
        <div className="xl:hidden mb-4 flex flex-col  gap-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open filters"
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={20} className="primaryTextColor" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                Sort by:
              </span>
              <Select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-40 border-0 bg-transparent"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="name_asc">Name: A to Z</MenuItem>
                <MenuItem value="name_desc">Name: Z to A</MenuItem>
                <MenuItem value="latest">Latest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
              </Select>
            </div>
          </div>
        </div>

        {/* Filters Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          zIndex="z-[120]"
        >
          <div className="w-[320px] p-5">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
              <Typography variant="h6" className="font-bold">
                Filters
              </Typography>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <FilterContent {...filterProps} />
          </div>
        </Drawer>

        <ActiveChips {...sharedProps} />
      </>
    );
  }

  // Sidebar mode (xl+)
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
        Filters
      </h3>
      <FilterContent {...filterProps} />
    </div>
  );
};

export default ProductFilters;
