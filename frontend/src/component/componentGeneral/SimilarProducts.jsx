import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from './ProductList.jsx';

const SimilarProducts = ({ categoryId, productId }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!categoryId || !productId) {
      setLoading(false);
      return;
    }

    const fetchSimilarProducts = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/similar/${categoryId}/${productId}`,
        );
        if (res.data.success) {
          setSimilarProducts(res.data.data);
        } else {
          setError(res.data.message || 'No similar products found');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categoryId, productId]);

  if (loading) return null;
  if (error || similarProducts.length === 0) return null;

  console.table(similarProducts);

  return (
    <div>
      <div className={'px-2 py-4 shadow-lg rounded-lg'}>
        <h1
          className={'text-2xl bg-gray-100 py-2 text-center secondaryTextColor'}
        >
          Related Products
        </h1>
        <ProductList products={similarProducts} productPage={true} />
      </div>
    </div>
  );
};

export default SimilarProducts;
