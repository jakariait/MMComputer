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
  Radio,
  Circle,
  ArrowUp10,
  ArrowDown01,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  Search,
} from 'lucide-react';

// Price range slider bounds (in Tk)
const PRICE_SLIDER_MIN = 0;
const PRICE_SLIDER_MAX = 500000;
const PRICE_SLIDER_STEP = 1000;

const ProductFilters = ({
  filters,
  categories = [],
  flags = [],
  brands = [],
  onUpdateFilters,
}) => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  // Local state for search input (for debouncing)
  const [searchInput, setSearchInput] = useState('');

  // Local state for price range inputs
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  // Refs for debounce timers
  const searchTimeoutRef = useRef(null);
  const priceSliderTimeoutRef = useRef(null);

  // Initialize search input from filters
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Sync price inputs with filters
  useEffect(() => {
    setMinPriceInput(filters.minPrice || '');
    setMaxPriceInput(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (priceSliderTimeoutRef.current)
        clearTimeout(priceSliderTimeoutRef.current);
    };
  }, []);

  const activeFlags = flags.filter((flag) => flag.isActive);

  // Handler for search input changes (with debouncing)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      onUpdateFilters({ ...filters, search: value, page: 1 });
    }, 500);
  };

  // Clear search handler
  const handleClearSearch = () => {
    setSearchInput('');
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    onUpdateFilters({ ...filters, search: '', page: 1 });
  };

  // Handler for all dropdown-based filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onUpdateFilters({ ...filters, [name]: value, page: 1 });
    setLeftDrawerOpen(false);
    setRightDrawerOpen(false);
  };

  // Handler to change items per page
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    onUpdateFilters({ ...filters, limit: newLimit, page: 1 });
  };

  // Handler to apply price range filter
  const handleApplyPriceRange = () => {
    onUpdateFilters({
      ...filters,
      minPrice: minPriceInput.trim(),
      maxPrice: maxPriceInput.trim(),
      page: 1,
    });
    setLeftDrawerOpen(false);
  };

  // Handler to clear price range filter
  const handleClearPriceRange = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    onUpdateFilters({ ...filters, minPrice: '', maxPrice: '', page: 1 });
  };

  // Handler for price range slider changes (live, debounced)
  const handleSliderChange = (type, value) => {
    const num = Math.max(
      PRICE_SLIDER_MIN,
      Math.min(PRICE_SLIDER_MAX, Number(value) || PRICE_SLIDER_MIN),
    );

    let nextMinPrice = minPriceInput;
    let nextMaxPrice = maxPriceInput;

    if (type === 'min') {
      const currentMax =
        maxPriceInput === ''
          ? PRICE_SLIDER_MAX
          : Number(maxPriceInput) || PRICE_SLIDER_MAX;
      nextMinPrice = String(Math.min(num, currentMax));
    } else {
      const currentMin =
        minPriceInput === ''
          ? PRICE_SLIDER_MIN
          : Number(minPriceInput) || PRICE_SLIDER_MIN;
      nextMaxPrice = String(Math.max(num, currentMin));
    }

    setMinPriceInput(nextMinPrice);
    setMaxPriceInput(nextMaxPrice);

    if (priceSliderTimeoutRef.current)
      clearTimeout(priceSliderTimeoutRef.current);
    priceSliderTimeoutRef.current = setTimeout(() => {
      onUpdateFilters({
        ...filters,
        minPrice: nextMinPrice,
        maxPrice: nextMaxPrice,
        page: 1,
      });
    }, 300);
  };

  // Custom sort handler for mobile drawer
  const handleSortChange = (sortValue) => {
    onUpdateFilters({ ...filters, sort: sortValue, page: 1 });
    setRightDrawerOpen(false);
  };

  // Slider derived values
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

  return (
    <>
      {/* Mobile Filter/Sort Buttons */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <IconButton
          onClick={() => setLeftDrawerOpen(true)}
          aria-label="Open filters"
        >
          <SlidersHorizontal size={20} className="primaryTextColor" />
        </IconButton>

        <IconButton
          onClick={() => setRightDrawerOpen(true)}
          aria-label="Open sort options"
        >
          <ArrowDownWideNarrow size={25} className="primaryTextColor" />
        </IconButton>
      </div>

      {/* Mobile Left Drawer (Filters) */}
      <Drawer
        anchor="left"
        open={leftDrawerOpen}
        onClose={() => setLeftDrawerOpen(false)}
        aria-label="Filter options"
        zIndex="z-[120]"
      >
        <div className="w-[300px] p-4">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Filters</Typography>
            <IconButton
              onClick={() => setLeftDrawerOpen(false)}
              aria-label="Close filters"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="flex flex-col gap-4">
            {/* Search in mobile drawer */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <label htmlFor="mobile-product-search" className="sr-only">
                Search products
              </label>
              <input
                id="mobile-product-search"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-8 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
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

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Flag</InputLabel>
              <Select
                name="flags"
                value={filters.flags}
                onChange={handleFilterChange}
                label="Flag"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {activeFlags.map((flag) => (
                  <MenuItem key={flag._id} value={flag.name}>
                    {flag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Stock</InputLabel>
              <Select
                name="stock"
                value={filters.stock}
                onChange={handleFilterChange}
                label="Stock"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="in">In Stock</MenuItem>
                <MenuItem value="out">Out of Stock</MenuItem>
              </Select>
            </FormControl>

            <div className="flex flex-col gap-2">
              <InputLabel>Price Range (Tk)</InputLabel>
              <div className="pt-2">
                {priceSlider}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{sliderMinValue.toLocaleString()}</span>
                  <span>{sliderMaxValue.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApplyPriceRange}
                  className="flex-1 rounded-md primaryBgColor accentTextColor py-1.5 text-sm font-medium hover:opacity-90 cursor-pointer"
                >
                  Apply
                </button>
                {(filters.minPrice || filters.maxPrice) && (
                  <button
                    type="button"
                    onClick={handleClearPriceRange}
                    className="flex-1 rounded-md bg-gray-200 text-gray-800 py-1.5 text-sm font-medium hover:bg-gray-300 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                label="Brand"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort</InputLabel>
              <Select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                label="Sort"
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
            </FormControl>
          </div>
        </div>
      </Drawer>

      {/* Mobile Right Drawer (Sort options) */}
      <Drawer
        anchor="bottom"
        open={rightDrawerOpen}
        onClose={() => setRightDrawerOpen(false)}
        aria-label="Sort options"
        zIndex="z-[120]"
        className="h-[35vh]"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Sort Options</Typography>
            <IconButton
              onClick={() => setRightDrawerOpen(false)}
              aria-label="Close sort options"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
            {[
              { value: '', label: 'None', icon: Radio },
              {
                value: 'price_high',
                label: 'Price: High to Low',
                icon: ArrowUp10,
              },
              {
                value: 'price_low',
                label: 'Price: Low to High',
                icon: ArrowDown01,
              },
              { value: 'name_asc', label: 'Name: A to Z', icon: ArrowDownAZ },
              { value: 'name_desc', label: 'Name: Z to A', icon: ArrowUpAZ },
              { value: 'latest', label: 'Latest', icon: ArrowUpNarrowWide },
              { value: 'oldest', label: 'Oldest', icon: ArrowDownNarrowWide },
            ].map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-100 w-full text-left"
                onClick={() => handleSortChange(value)}
                aria-pressed={filters.sort === value}
              >
                {filters.sort === value ? (
                  <Circle
                    className="mr-3 text-primary"
                    size={20}
                    aria-hidden="true"
                  />
                ) : (
                  <Icon
                    className="mr-3 text-gray-500"
                    size={20}
                    aria-hidden="true"
                  />
                )}
                <Typography
                  className={
                    filters.sort === value
                      ? 'font-semibold text-primary'
                      : 'text-gray-700'
                  }
                >
                  {label}
                </Typography>
              </button>
            ))}
          </div>
        </div>
      </Drawer>

      {/* Desktop Filters */}
      <div className="hidden md:block mb-6">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4 md:col-span-2">
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="col-span-4 md:col-span-2">
            <FormControl fullWidth>
              <InputLabel>Flag</InputLabel>
              <Select
                name="flags"
                value={filters.flags}
                onChange={handleFilterChange}
                label="Flag"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {activeFlags.map((flag) => (
                  <MenuItem key={flag._id} value={flag.name}>
                    {flag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="col-span-4 md:col-span-2">
            <FormControl fullWidth>
              <InputLabel>Stock</InputLabel>
              <Select
                name="stock"
                value={filters.stock}
                onChange={handleFilterChange}
                label="Stock"
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="in">In Stock</MenuItem>
                <MenuItem value="out">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="col-span-4 md:col-span-2">
            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                label="Brand"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="col-span-6 md:col-span-2">
            <FormControl fullWidth>
              <InputLabel>Sort</InputLabel>
              <Select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                label="Sort"
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
            </FormControl>
          </div>

          <div className="col-span-6 md:col-span-2">
            <FormControl fullWidth>
              <InputLabel>Items per page</InputLabel>
              <Select
                value={filters.limit}
                onChange={handleItemsPerPageChange}
                label="Items per page"
              >
                {[5, 10, 20, 50].map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-3">
            <InputLabel className="shrink-0">Price Range (Tk):</InputLabel>
            <div className="flex-1 min-w-[180px]">{priceSlider}</div>
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="h-9 w-20 rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="h-9 w-20 rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <button
                type="button"
                onClick={handleApplyPriceRange}
                className="h-9 rounded-md primaryBgColor accentTextColor px-4 text-sm font-medium hover:opacity-90 cursor-pointer"
              >
                Apply
              </button>
              {(filters.minPrice || filters.maxPrice) && (
                <button
                  type="button"
                  onClick={handleClearPriceRange}
                  className="h-9 rounded-md bg-gray-200 text-gray-800 px-4 text-sm font-medium hover:bg-gray-300 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Search/Filter Indicators */}
      {(filters.search ||
        filters.category ||
        filters.flags ||
        filters.brand ||
        filters.stock !== '' ||
        filters.sort ||
        filters.minPrice ||
        filters.maxPrice) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.search && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <Search size={14} aria-hidden="true" />
              Search: &quot;{filters.search}&quot;
              <button
                onClick={handleClearSearch}
                className="hover:bg-blue-200 rounded-full p-1"
                aria-label="Clear search filter"
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
                aria-label="Clear price range filter"
              >
                <CloseIcon size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductFilters;
