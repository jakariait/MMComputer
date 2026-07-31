import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore.js';
import ProductBrand from './ProductBrand.jsx';
import CompareButton from './CompareButton.jsx';

const ProductAddToCart = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const MAX_QUANTITY = 5; // Set the limit for Cart Quantity
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [validationMessage, setValidationMessage] = useState(''); // New state for validation messages

  // Effect 1: Initialize selectedOptions and handle single variant product auto-selection
  useEffect(() => {
    setSelectedOptions({});
    setValidationMessage(''); // Clear message on product change

    if (product?.variants?.length === 1) {
      const singleVariant = product.variants[0];
      const initialSelected = {};
      singleVariant.attributes?.forEach((attr) => {
        if (attr?.option?.name) {
          initialSelected[attr.option.name] = attr.value;
        }
      });
      setSelectedOptions(initialSelected);
      setSelectedVariant(singleVariant);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  // Effect 2: Main logic for updating options and variant selection
  useEffect(() => {
    if (!product || !product.variants || product.variants.length === 0) {
      setOptions([]);
      setSelectedVariant(null);
      return;
    }

    // If single variant product, options are already set by Effect 1.
    if (
      product.variants.length === 1 &&
      Object.keys(selectedOptions).length > 0
    ) {
      const singleVariant = product.variants[0];
      const allOptionsMap = new Map();
      singleVariant.attributes?.forEach((attr) => {
        if (attr?.option?.name) {
          if (!allOptionsMap.has(attr.option.name)) {
            allOptionsMap.set(attr.option.name, new Set());
          }
          allOptionsMap.get(attr.option.name).add(attr.value);
        }
      });
      const allOptions = Array.from(allOptionsMap.keys()).map((name) => ({
        name,
        values: Array.from(allOptionsMap.get(name)),
      }));
      const displayedOptions = allOptions.map((option) => ({
        name: option.name,
        values: option.values.map((value) => ({ value, available: true })),
      }));
      setOptions(displayedOptions);
      return;
    }

    const allOptionsMap = new Map();
    product.variants.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        if (attr?.option?.name) {
          if (!allOptionsMap.has(attr.option.name)) {
            allOptionsMap.set(attr.option.name, new Set());
          }
          allOptionsMap.get(attr.option.name).add(attr.value);
        }
      });
    });

    const allOptions = Array.from(allOptionsMap.keys()).map((name) => ({
      name,
      values: Array.from(allOptionsMap.get(name)),
    }));

    const displayedOptions = allOptions.map((option, index) => {
      const isOptionGroupEnabled = allOptions
        .slice(0, index)
        .every((prevOption) => selectedOptions[prevOption.name]);

      if (!isOptionGroupEnabled) {
        return {
          name: option.name,
          values: option.values.map((value) => ({ value, available: false })), // All disabled
        };
      }

      const availableValues = new Set();
      const previousOptionNames = allOptions.slice(0, index).map((o) => o.name);

      product.variants.forEach((variant) => {
        const matchesPrevious = previousOptionNames.every((prevOptionName) => {
          const selectedValue = selectedOptions[prevOptionName];
          return (variant.attributes || []).some(
            (attr) =>
              attr?.option?.name === prevOptionName &&
              attr.value === selectedValue,
          );
        });

        if (matchesPrevious) {
          const attr = (variant.attributes || []).find(
            (a) => a?.option?.name === option.name,
          );
          if (attr) {
            availableValues.add(attr.value);
          }
        }
      });

      return {
        name: option.name,
        values: option.values.map((value) => ({
          value,
          available: availableValues.has(value),
        })),
      };
    });
    setOptions(displayedOptions);

    if (Object.keys(selectedOptions).length === allOptions.length) {
      const newVariant = product.variants.find((variant) =>
        Object.entries(selectedOptions).every(([key, value]) =>
          (variant.attributes || []).some(
            (attr) => attr?.option?.name === key && attr.value === value,
          ),
        ),
      );
      setSelectedVariant(newVariant);
      setValidationMessage(''); // Clear validation message
    } else {
      setSelectedVariant(null);
      setValidationMessage('Please select all variant options.'); // Set validation message
    }
  }, [product, selectedOptions]);

  const handleOptionChange = (optionName, value) => {
    const allOptionNames = options.map((o) => o.name);
    const optionIndex = allOptionNames.indexOf(optionName);

    const newSelected = { [optionName]: value };

    for (let i = 0; i < optionIndex; i++) {
      const prevOptionName = allOptionNames[i];
      newSelected[prevOptionName] = selectedOptions[prevOptionName];
    }

    setSelectedOptions(newSelected);
    setValidationMessage(''); // Clear message on selection change
  };

  const handleAddToCart = () => {
    if (product.variants?.length > 0 && !selectedVariant) {
      const requiredOptions = options.map((o) => o.name);
      const missingOptions = requiredOptions.filter(
        (opt) => !selectedOptions[opt],
      );
      if (missingOptions.length > 0) {
        setValidationMessage(`${missingOptions.join(' / ')} required!`);
      } else if (product.variants?.length > 0) {
        setValidationMessage('Please select all variant options.');
      }
      return;
    }
    addToCart(product, quantity, selectedVariant);
    setValidationMessage(''); // Clear message on success

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'BDT',
        value:
          selectedVariant?.discount > 0
            ? selectedVariant.discount * quantity
            : selectedVariant?.price
              ? selectedVariant.price * quantity
              : product.finalDiscount > 0
                ? product.finalDiscount * quantity
                : product.finalPrice * quantity,
        items: [
          {
            item_id: product.productId,
            item_name: product.name,
            currency: 'BDT',
            discount:
              selectedVariant?.discount > 0
                ? selectedVariant.price - selectedVariant.discount
                : product.finalPrice - product.finalDiscount,
            item_variant: selectedVariant?.attributes
              ? selectedVariant.attributes.map((a) => a.value).join('/')
              : 'Default',
            price:
              selectedVariant?.discount > 0
                ? selectedVariant.discount
                : selectedVariant?.price ||
                  product.finalDiscount ||
                  product.finalPrice,
            quantity,
          },
        ],
      },
    });
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < MAX_QUANTITY) {
      setQuantity((prev) => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

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

  const variantForPrice = selectedVariant || product.variants?.[0];

  const isOutOfStock = product.variants?.length
    ? selectedVariant
      ? selectedVariant.stock === 0
      : product.variants.every((v) => v.stock === 0)
    : product.finalStock === 0;

  return (
    <div>
      <div>
        <div className="flex flex-col gap-3 md:col-span-4 lg:col-span-3 xl:col-span-4 pt-4 md:pt-0">
          {/*Brand and Compare Button*/}
          <div className={'flex justify-between items-center'}>
            <ProductBrand product={product} />
            <CompareButton product={product} />
          </div>

          <h2 className="text-xl md:text-2xl ">{product.name}</h2>

          <div className="flex text-center flex-col gap-2">
            {!product.variants?.length && (
              <div className="grid md:grid-cols-2 gap-2 items-center ">
                {product.finalDiscount > 0 ? (
                  <>
                    <div className="text-red-800 bg-gray-100 px-2 py-1 rounded-lg">
                      Offer Price: Tk.{' '}
                      {formatPrice(Number(product.finalDiscount))}
                    </div>

                    <div className=" bg-gray-100 px-2 py-1 rounded-lg">
                      Regular Price: Tk.{' '}
                      {formatPrice(Number(product.finalPrice))}
                    </div>
                  </>
                ) : (
                  <div className="text-black  bg-gray-100 px-2 py-1 rounded-lg">
                    Price: Tk. {formatPrice(Number(product.finalPrice))}
                  </div>
                )}

                {product.productCode && (
                  <div className={'bg-gray-100  px-2 py-1 rounded-lg'}>
                    <block>Product Code:</block> {product.productCode}
                  </div>
                )}

                {product.rewardPoints && (
                  <div className={'bg-gray-100  px-2 py-1 rounded-lg'}>
                    Purchase & Earn: {product.rewardPoints} points.
                  </div>
                )}
              </div>
            )}

            {variantForPrice && (
              <div className="grid md:grid-cols-2 gap-2 items-center">
                {variantForPrice.discount > 0 ? (
                  <>
                    <div className="text-red-800 bg-gray-100 px-2 py-1 rounded-lg">
                      Offer Price: Tk.{' '}
                      {formatPrice(Number(variantForPrice.discount))}
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded-lg">
                      Regular Price:{' '}
                      <span className="line-through">
                        Tk. {formatPrice(Number(variantForPrice.price))}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-black bg-gray-100 px-2 py-1 rounded-lg">
                    Price: Tk. {formatPrice(Number(variantForPrice.price))}
                  </div>
                )}
                {product.productCode && (
                  <div className={'bg-gray-100  px-2 py-1 rounded-lg'}>
                    <p>Product Code:</p> {product.productCode}
                  </div>
                )}
                {product.rewardPoints && (
                  <div className={'bg-gray-100  px-2 py-1 rounded-lg'}>
                    Purchase & Earn: {product.rewardPoints} points.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Key Features */}
          {product.keyFeatures?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-semibold tracking-tight primaryTextColor text-center">
                Key Features
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                {product.keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-4 px-4 py-3 text-sm
                      ${
                        index % 2 === 0
                          ? 'bg-white dark:bg-gray-950'
                          : 'bg-gray-50 dark:bg-gray-900/50'
                      }
                      ${
                        index !== product.keyFeatures.length - 1
                          ? 'border-b border-gray-100 dark:border-gray-800'
                          : ''
                      }`}
                  >
                    <span className="text-gray-500 dark:text-gray-400 ">
                      {feature.key}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100  text-right">
                      {feature.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedVariant && product.variants?.length > 0 && (
            <div className=" text-red-500">
              {validationMessage || 'Select options to see price.'}{' '}
              {/* Default message if no selection */}
            </div>
          )}

          {options.map((option) => (
            <div key={option.name} className={'flex flex-col gap-2'}>
              <h2 className="text-lg font-semibold">{option.name} :</h2>
              <div className="flex gap-2 flex-wrap ">
                {option.values.map(({ value, available }) => (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    disabled={!available}
                    className={`px-3 py-1 rounded-md transition-all duration-200 ${
                      selectedOptions[option.name] === value
                        ? 'primaryBgColor text-white   '
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300   '
                    } ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 md:gap-4 items-center mt-3">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden shrink-0">
              <button
                type="button"
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10
                 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                 active:scale-95 transition-all duration-150 cursor-pointer
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                onClick={() => handleQuantityChange('decrease')}
                disabled={isOutOfStock}
                aria-label="Decrease quantity"
              >
                <FiMinus size={14} aria-hidden="true" focusable="false" />
              </button>
              <span className="w-10 md:w-12 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 select-none">
                {quantity}
              </span>
              <button
                type="button"
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10
                 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                 active:scale-95 transition-all duration-150 cursor-pointer
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                onClick={() => handleQuantityChange('increase')}
                disabled={isOutOfStock || quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
              >
                <FaPlus size={12} aria-hidden="true" focusable="false" />
              </button>
            </div>

            {/* Add to Cart / Out of Stock */}
            {isOutOfStock ? (
              <button
                className="flex-1 min-w-[120px] max-w-[180px] h-9 md:h-10 rounded-lg
                 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30
                 text-red-600 dark:text-red-400 text-sm font-semibold cursor-not-allowed"
                disabled
              >
                Out of Stock
              </button>
            ) : (
              <button
                className="flex-1 min-w-[120px] max-w-[180px] h-9 md:h-10 rounded-lg
                 border-2 primaryBorderColor primaryTextColor bg-transparent
                 text-sm font-semibold tracking-wide
                 hover:primaryBgColor hover:secondaryTextColor
                 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            )}

            {/* Buy Now */}
            {!isOutOfStock && (
              <button
                className="flex-1 min-w-[120px] max-w-[180px] h-9 md:h-10 rounded-lg
                 primaryBgColor accentTextColor text-sm font-semibold tracking-wide
                 shadow-sm hover:shadow-md hover:brightness-110
                 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                onClick={() => {
                  if (product.variants?.length > 0 && !selectedVariant) {
                    const requiredOptions = options.map((o) => o.name);
                    const missingOptions = requiredOptions.filter(
                      (opt) => !selectedOptions[opt],
                    );
                    if (missingOptions.length > 0) {
                      setValidationMessage(
                        `${missingOptions.join(' / ')} required!`,
                      );
                    } else if (product.variants?.length > 0) {
                      setValidationMessage(
                        'Please select all variant options.',
                      );
                    }
                    return;
                  }
                  addToCart(product, quantity, selectedVariant);
                  navigate('/checkout');
                  setValidationMessage('');
                }}
              >
                BUY NOW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAddToCart;
