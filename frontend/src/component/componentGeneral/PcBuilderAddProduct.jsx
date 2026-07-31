import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart, Trash2 } from 'lucide-react';
import { Select } from '@/components/ui/legacy-select';
import { MenuItem } from '@/components/ui/menu-item';
import ImageComponent from './ImageComponent.jsx';
import ProductList from './ProductList.jsx';

const apiUrl = import.meta.env.VITE_API_URL;

const formatPrice = (price) => {
  if (isNaN(price)) return price;
  return price.toLocaleString();
};

const PcBuilderAddProduct = ({
  name,
  slug,
  category = '',
  redirectOnAdd = false,
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selected, setSelected] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pcBuild') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pcBuild', JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    if (!slug) return;
    setPage(1);
    setSort('');
  }, [slug, category]);

  useEffect(() => {
    if (!slug) return;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { limit: 24, page };
        if (sort) {
          params.sort = sort;
        }
        if (category) {
          params.category = category;
        } else if (slug) {
          params.subcategory = slug;
        }
        const res = await axios.get(`${apiUrl}/getAllProducts`, { params });
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalProducts(res.data.totalProducts || 0);
      } catch {
        setProducts([]);
        setTotalPages(0);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug, category, page, sort]);

  const toggleProduct = (product) => {
    const alreadyInBuild = selected.some((item) => item._id === product._id);
    setSelected((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) return prev.filter((item) => item._id !== product._id);
      const filtered = prev.filter((item) => item.category !== name);
      const updated = [
        ...filtered,
        {
          _id: product._id,
          name: product.name,
          thumbnailImage: product.thumbnailImage || product.images?.[0],
          finalPrice: product.finalPrice,
          slug: product.slug,
          category: name,
        },
      ];
      localStorage.setItem('pcBuild', JSON.stringify(updated));
      return updated;
    });
    if (redirectOnAdd && !alreadyInBuild) {
      navigate('/pc-builder');
    }
  };

  const isSelected = useCallback(
    (id) => selected.some((item) => item._id === id),
    [selected],
  );

  const removeSelected = (id) => {
    setSelected((prev) => prev.filter((item) => item._id !== id));
  };

  const clearBuild = () => {
    setSelected([]);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  if (!slug) {
    return (
      <section className="bg-gray-50 min-h-screen py-8">
        <div className="xl:container xl:mx-auto px-4 text-center py-20 text-gray-500 text-sm">
          No category specified.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="xl:container xl:mx-auto px-4">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-tight tracking-tight">
              {name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select a product to add to your build.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={sort}
              onChange={handleSortChange}
              className="w-44"
              aria-label="Sort products"
            >
              <MenuItem value="">
                <em>Sort by</em>
              </MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="name_asc">Name: A to Z</MenuItem>
              <MenuItem value="name_desc">Name: Z to A</MenuItem>
            </Select>
            {selected.length > 0 && (
              <button
                onClick={clearBuild}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 shrink-0"
              >
                <Trash2 className="size-4" />
                Clear Build ({selected.length})
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-md border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-100 h-[160px] w-full animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="bg-gray-100 h-4 w-full animate-pulse rounded" />
                  <div className="bg-gray-100 h-4 w-16 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductList
            products={products}
            categoryName={name}
            buildOverrides={{ isInBuild: isSelected, onToggle: toggleProduct }}
            showBuildButton
          />
        )}

        {totalPages > 0 && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                ${
                  page === 1 || loading
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
                Page {page} of {totalPages}
              </span>
              <span className="hidden md:block text-gray-500">
                • {totalProducts} Products
              </span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                ${
                  page >= totalPages || loading
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

        {selected.length > 0 && (
          <div className="mt-10 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="size-5 text-[var(--primaryColor)]" />
                Your Build ({selected.length} items)
              </h2>
            </div>
            <div className="space-y-2">
              {selected.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-white rounded-md border border-gray-200 px-3 py-2"
                >
                  <div className="size-10 shrink-0 overflow-hidden rounded bg-gray-50">
                    <ImageComponent
                      imageName={item.thumbnailImage}
                      className="w-full h-full object-contain"
                      altName={item.name}
                      skeletonHeight={40}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--primaryColor)] shrink-0">
                    {item.finalPrice ? `৳${formatPrice(item.finalPrice)}` : '—'}
                  </p>
                  <button
                    onClick={() => removeSelected(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item.name} from build`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PcBuilderAddProduct;
