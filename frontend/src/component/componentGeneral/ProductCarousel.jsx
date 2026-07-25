import React, { useEffect, useState, useCallback } from 'react';
import CarouselStore from '../../store/CarouselStore.js';
import Skeleton from 'react-loading-skeleton';
import ImageComponent from './ImageComponent.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SlotCarousel = ({ images, aspectRatio, altName }) => {
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [images.length, next]);

  if (images.length === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl group ${
        !aspectRatio ? 'h-full' : ''
      }`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {images.map((img, i) => (
        <div
          key={img._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <ImageComponent
            imageName={img.imgSrc}
            className="w-full h-full object-contain p-2"
            skeletonHeight="100%"
            altName={altName}
          />
        </div>
      ))}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === index
                    ? 'bg-gray-800 w-4'
                    : 'bg-gray-400/60 hover:bg-gray-500/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductCarousel = () => {
  const {
    CarouselStoreList,
    CarouselStoreListLoading,
    CarouselStoreListError,
  } = CarouselStore();

  const getSlot = (position) =>
    Array.isArray(CarouselStoreList)
      ? CarouselStoreList.filter((img) => img.position === position)
      : [];

  const leftLarge = getSlot('left-large');
  const rightTop = getSlot('right-top');
  const rightBottom = getSlot('right-bottom');

  if (CarouselStoreListError) {
    return (
      <div className="container mx-auto text-center p-3">
        <h1 className="py-44 text-gray-500">
          Something went wrong! Please try again later.
        </h1>
      </div>
    );
  }

  if (
    leftLarge.length === 0 &&
    rightTop.length === 0 &&
    rightBottom.length === 0
  )
    return null;

  return (
    <section className="w-full bg-gray-50">
      <div className="px-2 sm:px-4 py-3 sm:py-6 xl:container xl:mx-auto">
        {CarouselStoreListLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
            <div className="md:col-span-2">
              <Skeleton
                className="rounded-xl"
                height={300}
                containerClassName="w-full"
              />
            </div>
            <div className="flex flex-col gap-2 sm:gap-3">
              <Skeleton className="rounded-xl" height={145} />
              <Skeleton className="rounded-xl" height={145} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
            {leftLarge.length > 0 && (
              <div className="md:col-span-2 flex">
                <SlotCarousel images={leftLarge} altName="Left Large Banner" />
              </div>
            )}
            <div className="flex flex-col justify-center gap-2 sm:gap-3">
              {rightTop.length > 0 && (
                <SlotCarousel
                  images={rightTop}
                  aspectRatio="16/7"
                  altName="Right Top Banner"
                />
              )}
              {rightBottom.length > 0 && (
                <SlotCarousel
                  images={rightBottom}
                  aspectRatio="16/7"
                  altName="Right Bottom Banner"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;
