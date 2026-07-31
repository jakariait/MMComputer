import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PcBuilderAddProduct from '@/component/componentGeneral/PcBuilderAddProduct.jsx';

const PcBuilderCategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug') || categoryName;
  const category = searchParams.get('category') || '';
  const isCore = searchParams.get('core') === '1';
  return (
    <PcBuilderAddProduct
      name={
        categoryName
          ? decodeURIComponent(categoryName.replace(/\+/g, '%20'))
          : ''
      }
      slug={slug}
      category={category}
      redirectOnAdd={isCore}
    />
  );
};

export default PcBuilderCategoryPage;
