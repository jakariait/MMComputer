import { Trash2, X } from 'lucide-react';
import useCompareStore from '../../store/useCompareStore.js';
import ImageComponent from './ImageComponent.jsx';
import React from 'react';
import Specification from './Specification.jsx';
import ProductBrand from './ProductBrand.jsx';
import { Link } from 'react-router-dom';

const ProductCompare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  const formatPrice = (price) => {
    if (isNaN(price)) return price;
    return price.toLocaleString();
  };

  const cleanHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('.ql-ui').forEach((el) => el.remove());
    return doc.body.innerHTML;
  };

  if (compareList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-200 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No products to compare
        </h2>
        <p className="text-gray-500">
          Add products to the compare list to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="xl:container xl:mx-auto  shadow p-4 rounded-lg mt-6 mb-6">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Compare Product</h1>
          <p className={'text-sm text-gray-500'}>
            Find and select products to see the differences and similarities
            between them
          </p>
        </div>

        <button
          onClick={clearCompare}
          className="flex items-center cursor-pointer gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={18} />
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {compareList.map((product) => {
            const hasVariant = product.variants?.length > 0;
            const firstVariant = hasVariant ? product.variants[0] : null;
            const regularPrice = hasVariant
              ? firstVariant.price
              : product.finalPrice;
            const offerPrice = hasVariant
              ? firstVariant.discount
              : product.finalDiscount;
            const hasDiscount = offerPrice > 0;

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow w-72 flex-shrink-0 border border-gray-200"
              >
                <div className="relative p-4 border-b border-gray-200">
                  <ImageComponent
                    imageName={product.thumbnailImage}
                    altName={product.name}
                    className=" h-32 object-contain mx-auto"
                  />
                  <button
                    onClick={() => removeFromCompare(product._id)}
                    className="absolute top-2 cursor-pointer right-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold  text-gray-800 text-center">
                    {product.name}
                  </h3>
                  <div className="space-y-4 mt-4">
                    <div className="border-t border-gray-200 pt-4">
                      {hasDiscount ? (
                        <div className="text-center">
                          <div className="font-bold text-xl text-red-600">
                            Tk. {formatPrice(Number(offerPrice))}
                          </div>
                          <div className="text-sm line-through text-gray-500">
                            Tk. {formatPrice(Number(regularPrice))}
                          </div>
                        </div>
                      ) : (
                        <div className="font-medium text-lg text-gray-900 text-center">
                          Tk. {formatPrice(Number(regularPrice))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex items-center justify-center">
                      <ProductBrand product={product} />
                    </div>

                    {product.keyFeatures?.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Key Features
                        </h4>
                        <ul className="space-y-1">
                          {product.keyFeatures.map((feature, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{feature.key}:</span>{' '}
                              {feature.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <Specification product={product} comparePage={true} />
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex items-center justify-center">
                      {/* Buy Now button (link to product page) */}
                      <Link
                        to={`/product/${product.slug}`} // Adjust route based on your app
                        className="inline-block primaryBgColor text-white text-sm font-medium px-4 py-2 rounded-md transition-all"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCompare;
