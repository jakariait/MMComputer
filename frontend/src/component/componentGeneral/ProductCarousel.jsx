import React, { useEffect, useState, useCallback } from 'react';
import CarouselStore from '../../store/CarouselStore.js';
import Skeleton from 'react-loading-skeleton';
import ImageComponent from './ImageComponent.jsx';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const SlotCarousel = ({ images, aspectRatio, altName }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = Array.isArray(images) ? images.length : 0;

  const prev = useCallback(() => {
    if (count === 0) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    if (count === 0) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [count, next, paused]);

  if (count === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl group ${
        !aspectRatio ? 'h-full min-h-[250px]' : ''
      }`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {images.map((img, i) => (
        <div
          key={img?._id ?? i}
          aria-hidden={i !== index}
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
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === index
                    ? 'bg-gray-800 w-4'
                    : 'bg-gray-400/60 hover:bg-gray-500/60'
                }`}
              />
            ))}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              aria-pressed={paused}
              className="flex items-center justify-center w-2 h-2 rounded-full bg-gray-800/70 hover:bg-gray-800 text-white"
            >
              {paused ? (
                <Play size={10} aria-hidden="true" />
              ) : (
                <Pause size={10} aria-hidden="true" />
              )}
            </button>
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
      <div className=" xl:container xl:mx-auto">
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
            <div className="flex flex-row md:flex-col justify-center gap-2 sm:gap-3">
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
