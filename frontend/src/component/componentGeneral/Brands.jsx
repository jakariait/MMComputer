import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import ImageComponent from './ImageComponent.jsx';

const apiUrl = import.meta.env.VITE_API_URL;

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/brands`);
        if (response.data.success && response.data.data) {
          setBrands(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (!loading && brands.length === 0) return null;

  return (
    <section className="bg-gray-50 py-10">
      <div className="xl:container xl:mx-auto px-4">
        <div className="text-center mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-tight tracking-tight">
            Our Brands
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Shop from top brands at MM Computer.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.833rem)] xl:w-[calc(12.5%-0.875rem)] rounded-md overflow-hidden bg-white border border-gray-200"
              >
                <Skeleton height={160} />
                <div className="p-3">
                  <Skeleton height={16} width="70%" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/shop?page=1&limit=20&brand=${brand.name}`}
                className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.833rem)] xl:w-[calc(12.5%-0.875rem)] group relative bg-white rounded-md border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-[var(--primaryColor)]/40"
              >
                <span className="pointer-events-none absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[var(--primaryColor)] opacity-0 -translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />
                <span className="pointer-events-none absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[var(--primaryColor)] opacity-0 translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[var(--primaryColor)] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[var(--primaryColor)] opacity-0 translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />

                <div className="aspect-square overflow-hidden">
                  <ImageComponent
                    imageName={brand.logo}
                    className="w-full h-full object-contain p-5 grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-300"
                    altName={brand.name}
                    skeletonHeight={160}
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm truncate text-center group-hover:primaryTextColor transition-colors">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Brands;
