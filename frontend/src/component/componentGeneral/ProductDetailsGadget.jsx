import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useProductStore from '../../store/useProductStore.js';
import GeneralInfoStore from '../../store/GeneralInfoStore.js';
import Skeleton from 'react-loading-skeleton';

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Helmet } from 'react-helmet';

import ProductGallery from './ProductGallery.jsx';
import ProductAddToCart from './ProductAddToCart.jsx';
import SimilarProducts from './SimilarProducts.jsx';
import YouTubeEmbed from './YouTubeEmbed.jsx';
import Specification from './Specification.jsx';
import ProductQuestionsSection from './ProductQuestionsSection.jsx';
import ProductReviewSections from './ProductReviewSections.jsx';
import RecentlyViewedProducts from './RecentlyViewedProducts.jsx';
import ProductBreadcrumbs from '@/component/componentGeneral/ProductBreadcrumbs.jsx';

const ProductDetailsGadget = () => {
  const hasPushedRef = useRef(false);
  const specRef = useRef(null);
  const descRef = useRef(null);
  const questionRef = useRef(null);
  const reviewRef = useRef(null);

  const handleScroll = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { fetchProductBySlug, product, loading, error, resetProduct } =
    useProductStore();

  const { GeneralInfoList } = GeneralInfoStore();
  const { slug } = useParams();

  const [currentProductSlug, setCurrentProductSlug] = useState(null);

  useEffect(() => {
    if (slug !== currentProductSlug) {
      // Reset product state and show loading
      resetProduct(); // Clear previous product data
      setCurrentProductSlug(slug);
      fetchProductBySlug(slug);
    }
  }, [slug, currentProductSlug, fetchProductBySlug, resetProduct]);

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

  const location = useLocation();
  const url = `${window.location.origin}${location.pathname}`;
  const title = product?.name;

  const discountPercentage =
    product?.finalPrice && product?.finalDiscount
      ? calculateDiscountPercentage(product.finalPrice, product.finalDiscount)
      : 0;

  // Function to sanitize/remove editor-specific tags like ql-ui
  const cleanHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove Quill editor-only UI elements
    doc.querySelectorAll('.ql-ui').forEach((el) => el.remove());

    return doc.body.innerHTML;
  };

  // Data layer for View Conttent

  useEffect(() => {
    if (!product || hasPushedRef.current) return;

    const price =
      product.finalDiscount > 0 ? product.finalDiscount : product.finalPrice;

    const discount =
      product.finalDiscount > 0
        ? product.finalPrice - product.finalDiscount
        : 0;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: 'BDT',
        value: price,
        items: [
          {
            item_id: product.productId,
            item_name: product.name,
            currency: 'BDT',
            discount,
            item_variant: 'Default',
            price,
            quantity: 1,
          },
        ],
      },
    });

    hasPushedRef.current = true;
  }, [product]);

  useEffect(() => {
    if (!product?._id) return;

    // Get existing list or empty array
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

    // Remove if already exists (avoid duplicates)
    viewed = viewed.filter((item) => item._id !== product._id);

    // Add new one at beginning
    viewed.unshift({
      _id: product._id,
      name: product.name,
      isActive: product.isActive,
      category: product.category,
      finalDiscount: product.finalDiscount,
      finalPrice: product.finalPrice,
      productId: product.productId,
      slug: product.slug,
      variants: product.variants,
      finalStock: product.finalStock,
      flags: product.flags,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
    });

    // Limit to 10 items
    viewed = viewed.slice(0, 10);

    // Save back
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
  }, [product]);

  const [activeTab, setActiveTab] = useState('spec');

  const tabs = [
    { id: 'spec', label: 'Specification', ref: specRef },
    { id: 'desc', label: 'Description', ref: descRef },
    { id: 'question', label: 'Question', ref: questionRef },
    { id: 'review', label: 'Review', ref: reviewRef },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    handleScroll(tab.ref);
  };

  // If product is loading, show a loading screen
  if (loading || product?.slug !== slug) {
    return (
      <div className="xl:container xl:mx-auto p-3">
        <div className={'grid md:grid-cols-2 gap-4'}>
          <div>
            <Skeleton height={650} width={'100%'} />
          </div>
          <div>
            <Skeleton height={50} width={'90%'} />
            <Skeleton height={50} width={'80%'} />
            <Skeleton height={50} width={'90%'} />
            <div className={'grid grid-cols-3 gap-1'}>
              <Skeleton height={50} width={'90%'} />
              <Skeleton height={50} width={'80%'} />
              <Skeleton height={50} width={'90%'} />
            </div>
            <Skeleton height={50} width={'90%'} />
            <Skeleton height={50} width={'50%'} />
            <Skeleton height={50} width={'40%'} />
            <div className={'grid grid-cols-2 gap-1'}>
              <Skeleton height={50} width={'100%'} />
              <Skeleton height={50} width={'100%'} />
            </div>
          </div>
        </div>
      </div>
    ); // Loading message while new product data is being fetched
  }

  return (
    <div className="xl:container xl:mx-auto p-3">
      {error && (
        <div className="text-red-500 flex items-center justify-center pt-40">
          Error: {error}
        </div>
      )}

      {product && (
        <div>
          {/*Seo Meta Data*/}
          <Helmet titleTemplate={`%s | ${GeneralInfoList?.CompanyName}`}>
            <html lang="en" />
            <meta name="robots" content="index, follow" />
            <title>{product?.name || product?.metaTitle}</title>
            <meta charSet="utf-8" />
            <meta name="description" content={product?.metaDescription} />
            <meta name="keywords" content={product.metaKeywords.join(', ')} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta
              property="og:title"
              content={product?.name || product?.metaTitle}
            />
            <meta
              property="og:description"
              content={product?.metaDescription}
            />
            <meta property="og:image" content={product?.thumbnailImage} />
            <meta property="og:url" content={window.location.href} />
          </Helmet>
          {/*BreadCrumbs*/}
          <ProductBreadcrumbs product={product} />

          <div className="md:grid md:grid-cols-8 lg:grid-cols-8 gap-8">
            <div className="md:col-span-4 lg:col-span-4 relative">
              <ProductGallery
                images={product.images}
                discount={discountPercentage}
              />
            </div>
            <div className="flex flex-col gap-3 md:col-span-4 lg:col-span-4 pt-4 md:pt-0 ">
              <ProductAddToCart product={product} />

              <div className={'flex gap-2 justify-between'}>
                {/*Social Share Buttons*/}
                <div className="flex  items-center gap-2">
                  <h1>Social Share:</h1>
                  <div className="flex gap-1">
                    <FacebookShareButton url={url} quote={title}>
                      <FacebookIcon size={28} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={url} title={title}>
                      <TwitterIcon size={28} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={url}>
                      <LinkedinIcon size={28} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton
                      url={url}
                      title={title}
                      separator=" - "
                    >
                      <WhatsappIcon size={28} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*YoutubeEmbed*/}
          {product.videoUrl && (
            <div className={'flex items-center justify-center pt-10 pb-10'}>
              <YouTubeEmbed videoId={product.videoUrl} />
            </div>
          )}

          <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow mt-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 px-2 py-2 max-w-6xl mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`relative px-4 py-2.5 rounded-lg text-sm md:text-base font-semibold 
                      transition-all duration-200 cursor-pointer
                      ${
                        activeTab === tab.id
                          ? 'secondaryBgColor text-white shadow-sm'
                          : 'bg-transparent secondaryTextColor hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className={'md:grid gap-4 grid-cols-5 '}>
            <div className={'col-span-3 flex flex-col gap-4'}>
              <div ref={specRef} className="scroll-mt-[140px]">
                <Specification product={product} />
              </div>

              {product.longDesc && (
                <div
                  ref={descRef}
                  className={'shadow-sm rounded-lg scroll-mt-[140px]'}
                >
                  <div className={'p-3'}>
                    <span className={'text-2xl primaryTextColor'}>
                      Description
                    </span>
                    <div
                      className="rendered-html p-3"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtml(product.longDesc),
                      }}
                    />
                  </div>
                </div>
              )}

              <div ref={questionRef} className="scroll-mt-[140px]">
                <ProductQuestionsSection productId={product.id} />
              </div>

              <div ref={reviewRef} className="scroll-mt-[140px]">
                <ProductReviewSections productId={product.id} />
              </div>
            </div>

            <div className={'col-span-2'}>
              <SimilarProducts
                categoryId={product?.category?._id}
                productId={product?._id}
              />

              <RecentlyViewedProducts currentProductId={product.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsGadget;
