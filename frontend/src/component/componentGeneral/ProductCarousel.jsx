import React, { useEffect, useState, useCallback } from 'react';
import CarouselStore from '../../store/CarouselStore.js';
import Skeleton from 'react-loading-skeleton';
import ImageComponent from './ImageComponent.jsx';

const SlotCarousel = ({ images, skeletonHeight, altName }) => {
  const [index, setIndex] = useState(0);

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
    <div className="relative overflow-hidden rounded-lg w-full h-full">
      {images.map((img, i) => (
        <div
          key={img._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ImageComponent
            imageName={img.imgSrc}
            className="w-full h-full object-cover"
            skeletonHeight={skeletonHeight}
            altName={altName}
          />
        </div>
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? 'bg-white scale-110' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
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
      <div className="primaryTextColor container md:mx-auto text-center p-3">
        <h1 className="p-44">Something went wrong! Please try again later.</h1>
      </div>
    );
  }

  if (CarouselStoreListLoading) {
    return (
      <div className="xl:container xl:mx-auto pb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2">
          <Skeleton height={400} width="100%" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton height={196} width="100%" />
          <Skeleton height={196} width="100%" />
        </div>
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
    <div className="xl:container xl:mx-auto pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {leftLarge.length > 0 && (
          <div className="md:col-span-2 min-h-[200px]">
            <SlotCarousel
              images={leftLarge}
              skeletonHeight={400}
              altName="Left Large Banner"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          {rightTop.length > 0 && (
            <div className="flex-1 min-h-[150px]">
              <SlotCarousel
                images={rightTop}
                skeletonHeight={196}
                altName="Right Top Banner"
              />
            </div>
          )}
          {rightBottom.length > 0 && (
            <div className="flex-1 min-h-[150px]">
              <SlotCarousel
                images={rightBottom}
                skeletonHeight={196}
                altName="Right Bottom Banner"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
