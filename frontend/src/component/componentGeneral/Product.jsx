import React, { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductStore from '../../store/useProductStore.js';
import useCategoryStore from '../../store/useCategoryStore.js';
import useFlagStore from '../../store/useFlagStore.js';
import useBrandStore from '../../store/useBrandStore.js';
import { Typography } from '@/components/ui/typography';
import Skeleton from 'react-loading-skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductList from './ProductList.jsx';
import ProductFilters from './ProductFilters.jsx';

const Product = () => {
  // Global store values
  const { products, totalPages, loading, error, fetchProducts, totalProducts } =
    useProductStore();

  const { categories } = useCategoryStore();
  const { flags, fetchFlags } = useFlagStore();
  const { brands, fetchBrands } = useBrandStore();

  // URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current filters from URL params - single source of truth
  const currentFilters = useMemo(
    () => ({
      page: parseInt(searchParams.get('page')) || 1,
      limit: parseInt(searchParams.get('limit')) || 20,
      sort: searchParams.get('sort') || '',
      category: searchParams.get('category') || '',
      subcategory: searchParams.get('subcategory') || '',
      childCategory: searchParams.get('childCategory') || '',
      stock: searchParams.get('stock') || '',
      flags: searchParams.get('flags') || '',
      brand: searchParams.get('brand') || '',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    }),
    [searchParams],
  );

  // Function to update URL params
  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Handler to change pages
  const handlePageChange = useCallback(
    (newPage) => {
      updateFilters({ ...currentFilters, page: newPage });
    },
    [currentFilters, updateFilters],
  );

  // Memoized values to avoid unnecessary re-renders
  const memoizedCategories = useMemo(() => categories || [], [categories]);
  const memoizedFlags = useMemo(
    () => (flags || []).filter((flag) => flag.isActive),
    [flags],
  );
  const memoizedBrands = useMemo(() => brands || [], [brands]);

  // Fetch flags and brands on mount if not already loaded
  useEffect(() => {
    if (!flags || flags.length === 0) {
      fetchFlags();
    }
    if (!brands || brands.length === 0) {
      fetchBrands();
    }
  }, [fetchFlags, flags, fetchBrands, brands]);

  // Effect to fetch products whenever filters change
  const {
    page,
    limit,
    sort,
    category,
    subcategory,
    childCategory,
    stock,
    flags: flagFilter,
    brand,
    search,
    minPrice,
    maxPrice,
  } = currentFilters;
  useEffect(() => {
    fetchProducts({
      page,
      limit,
      sort,
      category,
      subcategory,
      childCategory,
      stock,
      flags: flagFilter,
      brand,
      search,
      minPrice,
      maxPrice,
    });
  }, [
    page,
    limit,
    sort,
    category,
    subcategory,
    childCategory,
    stock,
    flagFilter,
    brand,
    search,
    minPrice,
    maxPrice,
    fetchProducts,
  ]);

  // Show error if exists
  if (error) {
    return (
      <Typography variant="h6" color="error" className="p-4">
        {error}
      </Typography>
    );
  }

  return (
    <div className="xl:container xl:mx-auto px-6 py-5 justify-center md:justify-start">
      {/* Loading skeletons */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, subIdx) => (
                <Skeleton key={subIdx} height={250} width="100%" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Filters (mobile drawers, desktop bar, price range, active chips) */}
          <ProductFilters
            filters={currentFilters}
            categories={memoizedCategories}
            flags={memoizedFlags}
            brands={memoizedBrands}
            onUpdateFilters={updateFilters}
          />

          {/* Product List or No Results */}
          {(products || []).length === 0 && !loading ? (
            <div className="text-center py-20">
              <Typography variant="h6" className="text-gray-500 mb-4">
                {currentFilters.search
                  ? `No products found for "${currentFilters.search}"`
                  : 'No products found'}
              </Typography>
              <Typography variant="body2" className="text-gray-400 ml-2">
                {currentFilters.search
                  ? 'Try a different search term or adjust your filters'
                  : 'Try adjusting your filters or search criteria'}
              </Typography>
            </div>
          ) : (
            <ProductList products={products} showKeyFeatures={true} />
          )}

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={() => handlePageChange(currentFilters.page - 1)}
                disabled={currentFilters.page === 1 || loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                  ${
                    currentFilters.page === 1 || loading
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-500 hover:bg-gray-100'
                  }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} aria-hidden="true" />
                <span className="hidden md:block">Previous</span>
              </button>

              <div className="flex items-center gap-2 text-sm">
                <span>
                  Page {currentFilters.page} of {totalPages}
                </span>
                <span className="hidden md:block text-gray-500">
                  • {totalProducts} Products
                  {currentFilters.search && ` for "${currentFilters.search}"`}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentFilters.page + 1)}
                disabled={currentFilters.page >= totalPages || loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                  ${
                    currentFilters.page >= totalPages || loading
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-500 hover:bg-gray-100'
                  }`}
                aria-label="Next page"
              >
                <span className="hidden md:block">Next</span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Product;
