import React from 'react';
import { useParams } from 'react-router-dom';
import PcBuilderAddProduct from '@/component/componentGeneral/PcBuilderAddProduct.jsx';

const PcBuilderCategoryPage = () => {
  const { categoryName } = useParams();
  return <PcBuilderAddProduct category={decodeURIComponent(categoryName)} />;
};

export default PcBuilderCategoryPage;