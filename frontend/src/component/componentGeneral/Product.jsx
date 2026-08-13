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
  const { products, totalPages, loading, error, fetchProducts, totalProducts } =
    useProductStore();

  const { categories } = useCategoryStore();
  const { flags, fetchFlags } = useFlagStore();
  const { brands, fetchBrands } = useBrandStore();

  const [searchParams, setSearchParams] = useSearchParams();

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

  const handlePageChange = useCallback(
    (newPage) => {
      updateFilters({ ...currentFilters, page: newPage });
    },
    [currentFilters, updateFilters],
  );

  const memoizedCategories = useMemo(() => categories || [], [categories]);
  const memoizedFlags = useMemo(
    () => (flags || []).filter((flag) => flag.isActive),
    [flags],
  );
  const memoizedBrands = useMemo(() => brands || [], [brands]);

  useEffect(() => {
    if (!flags || flags.length === 0) fetchFlags();
    if (!brands || brands.length === 0) fetchBrands();
  }, [fetchFlags, flags, fetchBrands, brands]);

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

  if (error) {
    return (
      <Typography variant="h6" color="error" className="p-4">
        {error}
      </Typography>
    );
  }

  if (loading) {
    return (
      <div className="xl:container xl:mx-auto px-6 py-5 ">
        <div className="flex gap-6">
          <aside className="hidden xl:block w-64 shrink-0">
            <Skeleton className="h-9 w-full mb-4" />
            <Skeleton className="h-9 w-full mb-4" />
            <Skeleton className="h-9 w-full mb-4" />
            <Skeleton className="h-9 w-full mb-4" />
            <Skeleton className="h-9 w-full mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-9 w-full" />
          </aside>
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} height={280} className="rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={'bg-gray-300/10 '}>
      <div className="xl:container xl:mx-auto px-6 py-5 ">
        <div className="flex gap-6">
          {/* Sidebar Filters - xl+ */}
          <aside className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={currentFilters}
                categories={memoizedCategories}
                flags={memoizedFlags}
                brands={memoizedBrands}
                onUpdateFilters={updateFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile/MD Filter Buttons + Active Chips */}
            <ProductFilters
              filters={currentFilters}
              categories={memoizedCategories}
              flags={memoizedFlags}
              brands={memoizedBrands}
              onUpdateFilters={updateFilters}
              mobileOnly
            />

            {/* Product List */}
            {(products || []).length === 0 ? (
              <div className="text-center py-20 md:py-100">
                <Typography variant="h6" className="text-gray-500 mb-4">
                  {currentFilters.search
                    ? `No products found for "${currentFilters.search}"`
                    : 'No products found'}
                </Typography>
                <Typography variant="body2" className="text-gray-400 pl-2">
                  {currentFilters.search
                    ? 'Try a different search term or adjust your filters'
                    : 'Try adjusting your filters or search criteria'}
                </Typography>
              </div>
            ) : (
              <ProductList
                products={products}
                showKeyFeatures={true}
                gridClassName={
                  'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 mt-4'
                }
              />
            )}

            {/* Pagination */}
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
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:block">Previous</span>
                </button>

                <div className="flex items-center gap-2 text-sm">
                  <span>
                    Page {currentFilters.page} of {totalPages}
                  </span>
                  <span className="hidden md:block text-gray-500">
                    &middot; {totalProducts} Products
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
                >
                  <span className="hidden sm:block">Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default Product;
