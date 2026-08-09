import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { Check, Plus } from 'lucide-react';
import ProductGallery from './ProductGallery.jsx';
import ProductAddToCart from './ProductAddToCart.jsx';
import ImageComponent from './ImageComponent.jsx';
import useCartStore from '../../store/useCartStore.js';

// Memoize the formatted price function
const formatPrice = (price) => {
  const n = Number(price);
  if (isNaN(n)) return '';
  return n.toLocaleString();
};

const ProductList = ({
  products,
  productPage,
  categoryName,
  buildOverrides,
  showBuildButton = false,
  showKeyFeatures = false,
  showAddToCart = true,
  showBuyNow = true,
  gridClassName = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-4',
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  const [build, setBuild] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pcBuild') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pcBuild', JSON.stringify(build));
  }, [build]);

  const toggleBuild = (product) => {
    setBuild((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) return prev.filter((item) => item._id !== product._id);
      const category = categoryName || document.title || '';
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          thumbnailImage: product.thumbnailImage || product.images?.[0],
          finalPrice: product.finalPrice,
          slug: product.slug,
          category,
        },
      ];
    });
  };

  const isInBuild =
    buildOverrides?.isInBuild ||
    ((id) => build.some((item) => item._id === id));
  const handleToggle = buildOverrides?.onToggle || toggleBuild;
  const handleOpen = (product) => {
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };

  const isProductOutOfStock = (product) =>
    product.variants?.length
      ? product.variants.every((v) => v?.stock === 0)
      : product.finalStock === 0;

  const handleQuickAddToCart = (product) => {
    if (product.variants?.length) {
      navigate(`/product/${product.slug}`);
      return;
    }
    addToCart(product, 1, null);
  };

  const handleQuickBuyNow = (product) => {
    if (product.variants?.length) {
      navigate(`/product/${product.slug}`);
      return;
    }
    addToCart(product, 1, null);
    navigate('/checkout');
  };

  const actionButtons = (product) => (
    <div className="flex flex-wrap gap-3 md:gap-4 items-center justify-center mt-2">
      {isProductOutOfStock(product) ? (
        <button
          type="button"
          className="flex-1 min-w-[120px] max-w-[180px] h-9 md:h-10 rounded-lg
                 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30
                 text-red-600 dark:text-red-400 text-sm font-semibold cursor-not-allowed"
          disabled
        >
          Out of Stock
        </button>
      ) : (
        showAddToCart && (
          <button
            type="button"
            onClick={() => handleQuickAddToCart(product)}
            className="flex-1 min-w-[120px] max-w-[180px] h-7 md:h-9 rounded-lg
                 border-2 primaryBorderColor primaryTextColor bg-transparent
                 text-sm font-semibold tracking-wide
                 hover:primaryBgColor hover:secondaryTextColor
                 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            ADD TO CART
          </button>
        )
      )}
      {!isProductOutOfStock(product) && showBuyNow && (
        <button
          type="button"
          onClick={() => handleQuickBuyNow(product)}
          className="flex-1 min-w-[120px] max-w-[180px] h-7 md:h-9 rounded-lg
                 primaryBgColor accentTextColor text-sm font-medium tracking-wide
                 shadow-sm hover:shadow-md hover:brightness-110
                 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          BUY NOW
        </button>
      )}
    </div>
  );

  const calculateDiscountPercentage = (
    priceBeforeDiscount,
    priceAfterDiscount,
  ) => {
    if (
      !priceBeforeDiscount ||
      !priceAfterDiscount ||
      priceBeforeDiscount <= priceAfterDiscount
    )
      return 0;
    const discountAmount = priceBeforeDiscount - priceAfterDiscount;
    return Math.ceil((discountAmount / priceBeforeDiscount) * 100);
  };
  return (
    <div>
      {!Array.isArray(products) || products.length === 0 ? (
        <Typography
          variant="body1"
          className="text-center text-gray-500 p-20 md:p-70 shadow rounded-lg"
        >
          No products found. Please check back later!
        </Typography>
      ) : (
        <div
          className={
            productPage ? 'grid grid-cols-1 gap-3 mt-4' : gridClassName
          }
        >
          {/*Product Display Section*/}
          {(products || []).map((product) =>
            productPage ? (
              // List View
              <div
                key={product._id || product.slug}
                className="relative flex gap-4 items-center rounded-md  shadow-sm "
              >
                <div className="relative w-32 md:w-44 shrink-0 h-24 md:h-36 overflow-hidden rounded-md">
                  <Link
                    to={`/product/${product.slug}`}
                    className="block w-full h-full"
                  >
                    <ImageComponent
                      imageName={product.thumbnailImage || product.images?.[0]}
                      altName={product.name}
                      skeletonHeight={144}
                      className="object-cover w-full h-full"
                    />
                  </Link>
                  {product.variants?.length ? (
                    product.variants.every((v) => v?.stock === 0)
                  ) : product.finalStock === 0 ? (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded ">
                      <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide rounded shadow">
                        Out of Stock
                      </span>
                    </div>
                  ) : null}
                </div>
                <div>
                  <Link to={`/product/${product.slug}`}>
                    <div className="font-medium hover:underline mb-2 ">
                      {product.name}
                    </div>
                  </Link>

                  {showKeyFeatures && product.keyFeatures?.length > 0 && (
                    <ul className="list-disc pl-5 mb-2 text-sm text-gray-600">
                      {product.keyFeatures.map((feature, index) => (
                        <li key={index}>
                          {feature.key}: {feature.value}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-2 items-center">
                    {/*Base Price*/}
                    {product.variants?.length ? (
                      product.variants[0]?.discount > 0 ? (
                        <div className="line-through text-gray-500">
                          Tk. {formatPrice(Number(product.variants[0]?.price))}
                        </div>
                      ) : (
                        <div className="">
                          Tk. {formatPrice(Number(product.variants[0]?.price))}
                        </div>
                      )
                    ) : product.finalDiscount > 0 ? (
                      <div className="line-through text-gray-500">
                        Tk. {formatPrice(Number(product.finalPrice))}
                      </div>
                    ) : (
                      <div className="">
                        Tk. {formatPrice(Number(product.finalPrice))}
                      </div>
                    )}

                    {/*Discount Price*/}
                    {product.variants?.length
                      ? product.variants[0]?.discount > 0 && (
                          <div className="text-red-800 font-semibold">
                            Tk.{' '}
                            {formatPrice(Number(product.variants[0]?.discount))}
                          </div>
                        )
                      : product.finalDiscount > 0 && (
                          <div className="text-red-800 font-semibold">
                            Tk. {formatPrice(Number(product.finalDiscount))}
                          </div>
                        )}
                  </div>
                  {showBuildButton && (
                    <button
                      onClick={() => handleToggle(product)}
                      className={`shrink-0 flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        isInBuild(product._id)
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-[var(--primaryColor)] text-white hover:opacity-90'
                      }`}
                    >
                      {isInBuild(product._id) ? (
                        <>
                          <Check className="size-3" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="size-3" /> Build
                        </>
                      )}
                    </button>
                  )}
                  <div className={'py-4 px-2'}>{actionButtons(product)}</div>
                </div>
                {/* Discount Percentage */}
                <div className="absolute top-1 left-1 z-10">
                  {product.variants?.length > 0
                    ? product.variants[0]?.discount > 0 && (
                        <span className="bg-red-400 px-2 py-1 text-white text-xs">
                          -
                          {calculateDiscountPercentage(
                            product.variants[0]?.price,
                            product.variants[0]?.discount,
                          )}
                          %
                        </span>
                      )
                    : product.finalDiscount > 0 && (
                        <span className="bg-red-400 px-2 py-1 text-white text-xs">
                          -
                          {calculateDiscountPercentage(
                            product.finalPrice,
                            product.finalDiscount,
                          )}
                          %
                        </span>
                      )}
                </div>

                {/* Quick View Button */}
                <div className="absolute top-1 right-1 z-10 bg-white rounded-full flex justify-center items-center">
                  <button
                    onClick={() => handleOpen(product)}
                    className="p-2 cursor-pointer"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <FaEye aria-hidden="true" focusable="false" />
                  </button>
                </div>
              </div>
            ) : (
              // Grid View
              <div
                key={product._id || product.slug}
                className="relative shadow-sm rounded-md pb-2 flex flex-col"
              >
                <div className="relative aspect-square">
                  <Link to={`/product/${product.slug}`}>
                    <ImageComponent
                      imageName={product.thumbnailImage || product.images?.[0]}
                      altName={product.name}
                      skeletonHeight={250}
                    />
                  </Link>
                  {product.variants?.length ? (
                    product.variants.every((v) => v?.stock === 0)
                  ) : product.finalStock === 0 ? (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
                      <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide rounded shadow">
                        Out of Stock
                      </span>
                    </div>
                  ) : null}
                </div>
                <Link to={`/product/${product.slug}`}>
                  <div className="px-2  mt-2 mb-5 font-medium hover:underline">
                    {product.name}
                  </div>
                </Link>

                {showKeyFeatures && product.keyFeatures?.length > 0 && (
                  <ul className="list-disc mt-5 pl-5 px-2 mb-4 mx-2 text-sm text-gray-600">
                    {product.keyFeatures.map((feature, index) => (
                      <li key={index}>
                        {feature.key}: {feature.value}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex  md:flex-row flex-col px-3 gap-2  mt-auto">
                  {/*Base Price*/}
                  {product.variants?.length ? (
                    product.variants[0]?.discount > 0 ? (
                      <div className="line-through">
                        Tk. {formatPrice(Number(product.variants[0]?.price))}
                      </div>
                    ) : (
                      <div>
                        Tk. {formatPrice(Number(product.variants[0]?.price))}
                      </div>
                    )
                  ) : product.finalDiscount > 0 ? (
                    <div className="line-through">
                      Tk. {formatPrice(Number(product.finalPrice))}
                    </div>
                  ) : (
                    <div>Tk. {formatPrice(Number(product.finalPrice))}</div>
                  )}

                  {/*Discount Price*/}
                  {product.variants?.length
                    ? product.variants[0]?.discount > 0 && (
                        <div className="text-red-800">
                          Tk.{' '}
                          {formatPrice(Number(product.variants[0]?.discount))}
                        </div>
                      )
                    : product.finalDiscount > 0 && (
                        <div className="text-red-800">
                          Tk. {formatPrice(Number(product.finalDiscount))}
                        </div>
                      )}
                </div>
                {actionButtons(product)}
                {showBuildButton && (
                  <button
                    onClick={() => handleToggle(product)}
                    className={`mx-2 mt-2 flex  items-center justify-center gap-1 rounded-md  py-1  font-medium transition-colors ${
                      isInBuild(product._id)
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-[var(--primaryColor)] text-white hover:opacity-90'
                    }`}
                  >
                    {isInBuild(product._id) ? (
                      <>
                        <Check className="size-3" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="size-3" /> Build
                      </>
                    )}
                  </button>
                )}

                {/* Discount Percentage */}
                <div className="absolute top-1 z-10">
                  {product.variants?.length > 0
                    ? product.variants[0]?.discount > 0 && (
                        <span className="bg-red-400 px-2 py-1 text-white">
                          -
                          {calculateDiscountPercentage(
                            product.variants[0]?.price,
                            product.variants[0]?.discount,
                          )}
                          %
                        </span>
                      )
                    : product.finalDiscount > 0 && (
                        <span className="bg-red-400 px-2 py-1 text-white">
                          -
                          {calculateDiscountPercentage(
                            product.finalPrice,
                            product.finalDiscount,
                          )}
                          %
                        </span>
                      )}
                </div>

                {/* Quick View Button */}
                <div className="absolute top-1 right-0 z-10 bg-white rounded-full flex justify-center items-center">
                  <button
                    onClick={() => handleOpen(product)} // Pass the product to set the state
                    className="p-2 cursor-pointer"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <FaEye aria-hidden="true" focusable="false" />
                  </button>
                </div>
              </div>
            ),
          )}

          {/* Quick View Modal */}
          {selectedProduct && (
            <Dialog open={Boolean(selectedProduct)} onOpenChange={handleClose}>
              <DialogContent className="sm:max-w-4xl">
                <DialogTitle className="sr-only">
                  {selectedProduct.name}
                </DialogTitle>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                  <ProductGallery
                    images={selectedProduct.images}
                    discount={calculateDiscountPercentage(
                      selectedProduct.finalPrice,
                      selectedProduct.finalDiscount,
                    )}
                    zoom={false}
                  />
                  <div>
                    <ProductAddToCart product={selectedProduct} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
