import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import ImageComponent from './ImageComponent.jsx';

const apiUrl = import.meta.env.VITE_API_URL;

const FeatureCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, subRes, childRes] = await Promise.allSettled([
          axios.get(`${apiUrl}/category?showInHomepage=true`),
          axios.get(`${apiUrl}/sub-category?showInHomepage=true`),
          axios.get(`${apiUrl}/child-category?showInHomepage=true`),
        ]);
        setCategories(
          catRes.status === 'fulfilled'
            ? catRes.value.data.categories || []
            : [],
        );
        setSubCategories(
          subRes.status === 'fulfilled'
            ? subRes.value.data.subCategories || []
            : [],
        );
        setChildCategories(
          childRes.status === 'fulfilled'
            ? childRes.value.data.childCategories || []
            : [],
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const allItems = [
    ...categories.map((c) => ({
      ...c,
      link: `/shop?category=${c.name}`,
    })),
    ...subCategories.map((s) => ({
      ...s,
      link: `/shop?subcategory=${s.slug}`,
    })),
    ...childCategories.map((c) => ({
      ...c,
      link: `/shop?childCategory=${c.slug}`,
    })),
  ];

  if (!loading && allItems.length === 0) return null;

  return (
    <section className="bg-gray-50 py-10">
      <div className="xl:container xl:mx-auto px-4">
        <div className="text-center mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-tight tracking-tight">
            Featured Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Explore the best products from our Featured Category! Shop now at MM
            Computer.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[calc(33.333%-0.667rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.833rem)] xl:w-[calc(12.5%-0.875rem)] rounded-md overflow-hidden bg-white border border-gray-200"
              >
                <Skeleton height={160} />
                <div className="p-3">
                  <Skeleton height={16} width="70%" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 ">
            {allItems.map((item, i) => (
              <Link
                key={`${item._id || i}`}
                to={item.link}
                className="w-[calc(33.333%-0.667rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.833rem)] xl:w-[calc(12.5%-0.875rem)] group relative bg-white rounded-md border border-gray-200 overflow-hidden transition-colors duration-200 hover:border-[var(--primaryColor)]/40"
              >
                <span className="pointer-events-none absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[var(--primaryColor)] opacity-0 -translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />
                <span className="pointer-events-none absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[var(--primaryColor)] opacity-0 translate-x-1 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[var(--primaryColor)] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[var(--primaryColor)] opacity-0 translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 z-10" />

                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <ImageComponent
                    imageName={item.image}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-300 p-5"
                    altName={item.name}
                    skeletonHeight={160}
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm truncate group-hover:primaryTextColor transition-colors">
                    {item.name}
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

export default FeatureCategory;
