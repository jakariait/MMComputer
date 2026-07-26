import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import ProductGallery from './ProductGallery.jsx';
import ProductAddToCart from './ProductAddToCart.jsx';
import ImageComponent from './ImageComponent.jsx';

// Memoize the formatted price function
const formatPrice = (price) => {
  if (isNaN(price)) return price;
  return price.toLocaleString();
};

const ProductList = ({ products, productPage }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleOpen = (product) => {
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };
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
      {products.filter((product) => product.isActive).length === 0 ? (
        <Typography
          variant="body1"
          className="text-center text-gray-500 p-20 md:p-70 shadow rounded-lg"
        >
          No products found. Please check back later!
        </Typography>
      ) : (
        <div
          className={
            productPage
              ? 'grid grid-cols-1 gap-3 mt-4 '
              : 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4  gap-3 mt-4'
          }
        >
          {/*Product Display Section*/}
          {products.map((product) =>
            productPage ? (
              // List View
              <div
                key={product.slug}
                className="relative flex gap-4 items-center rounded-md  shadow-sm "
              >
                <div className="w-1/3 relative">
                  <Link to={`/product/${product.slug}`}>
                    <ImageComponent
                      imageName={product.thumbnailImage || product.images?.[0]}
                      altName={product.name}
                      skeletonHeight={120}
                    />
                  </Link>
                  {product.variants?.length
                    ? product.variants.every((v) => v.stock === 0)
                    : product.finalStock === 0 ? (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
                        <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide rounded shadow">
                          Out of Stock
                        </span>
                      </div>
                    ) : null}
                </div>
                <div>
                  <Link to={`/product/${product.slug}`}>
                    <div className=" font-semibold hover:underline mb-2 ">
                      {product.name}
                    </div>
                  </Link>

                  <div className="flex gap-2 items-center">
                    {/*Base Price*/}
                    {product.variants?.length ? (
                      product.variants[0].discount > 0 ? (
                        <div className="line-through text-gray-500">
                          Tk. {formatPrice(Number(product.variants[0].price))}
                        </div>
                      ) : (
                        <div className="font-semibold">
                          Tk. {formatPrice(Number(product.variants[0].price))}
                        </div>
                      )
                    ) : product.finalDiscount > 0 ? (
                      <div className="line-through text-gray-500">
                        Tk. {formatPrice(Number(product.finalPrice))}
                      </div>
                    ) : (
                      <div className="font-semibold">
                        Tk. {formatPrice(Number(product.finalPrice))}
                      </div>
                    )}

                    {/*Discount Price*/}
                    {product.variants?.length
                      ? product.variants[0].discount > 0 && (
                          <div className="text-red-800 font-semibold">
                            Tk.{' '}
                            {formatPrice(Number(product.variants[0].discount))}
                          </div>
                        )
                      : product.finalDiscount > 0 && (
                          <div className="text-red-800 font-semibold">
                            Tk. {formatPrice(Number(product.finalDiscount))}
                          </div>
                        )}
                  </div>
                </div>
                {/* Discount Percentage */}
                <div className="absolute top-1 left-1 z-10">
                  {product.variants?.length > 0
                    ? product.variants[0].discount > 0 && (
                        <span className="bg-red-400 px-2 py-1 text-white text-xs">
                          -
                          {calculateDiscountPercentage(
                            product.variants[0].price,
                            product.variants[0].discount,
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
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            ) : (
              // Grid View
              <div
                key={product.slug}
                className="relative shadow-sm rounded-md pb-2"
              >
                <div className="relative">
                  <Link to={`/product/${product.slug}`}>
                    <ImageComponent
                      imageName={product.thumbnailImage || product.images?.[0]}
                      altName={product.name}
                      skeletonHeight={250}
                    />
                  </Link>
                  {product.variants?.length
                    ? product.variants.every((v) => v.stock === 0)
                    : product.finalStock === 0 ? (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
                        <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide rounded shadow">
                          Out of Stock
                        </span>
                      </div>
                    ) : null}
                </div>
                <Link to={`/product/${product.slug}`}>
                  <div className="text-center mt-2 mb-1 hover:underline">
                    {product.name}
                  </div>
                </Link>

                <div className="flex md:flex-row flex-col items-center gap-2 justify-center">
                  {/*Base Price*/}
                  {product.variants?.length ? (
                    product.variants[0].discount > 0 ? (
                      <div className="line-through">
                        Tk. {formatPrice(Number(product.variants[0].price))}
                      </div>
                    ) : (
                      <div>
                        Tk. {formatPrice(Number(product.variants[0].price))}
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
                    ? product.variants[0].discount > 0 && (
                        <div className="text-red-800">
                          Tk.{' '}
                          {formatPrice(Number(product.variants[0].discount))}
                        </div>
                      )
                    : product.finalDiscount > 0 && (
                        <div className="text-red-800">
                          Tk. {formatPrice(Number(product.finalDiscount))}
                        </div>
                      )}
                </div>

                {/* Discount Percentage */}
                <div className="absolute top-1 z-10">
                  {product.variants?.length > 0
                    ? product.variants[0].discount > 0 && (
                        <span className="bg-red-400 px-2 py-1 text-white">
                          -
                          {calculateDiscountPercentage(
                            product.variants[0].price,
                            product.variants[0].discount,
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
                  >
                    <FaEye />
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
