import React, { useEffect, useState } from 'react';
import ProductList from './ProductList.jsx';

const RecentlyViewedProducts = ({ currentProductId }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    let viewed;
    try {
      viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    } catch {
      viewed = [];
    }
    if (!Array.isArray(viewed)) viewed = [];
    // Exclude the currently viewed product
    const filtered = viewed.filter((item) => item?._id !== currentProductId);

    setRecentProducts(filtered.slice(0, 5));
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <div className={'px-2 py-4  rounded-lg'}>
      <h2
        className={'text-2xl bg-gray-100 py-2  text-center secondaryTextColor'}
      >
        Recently Viewed
      </h2>

      <ProductList products={recentProducts} productPage={true} />
    </div>
  );
};

export default RecentlyViewedProducts;
