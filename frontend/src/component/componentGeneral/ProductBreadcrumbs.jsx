import React from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Typography } from '@/components/ui/typography';
import { Link as RouterLink } from 'react-router-dom';

const ProductBreadcrumbs = ({ product }) => {
  return (
    <div className={'md:p-3'}>
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        <RouterLink
          to="/"
          className="text-inherit no-underline hover:underline"
        >
          Home
        </RouterLink>

        {product?.category?.name && (
          <RouterLink
            to={`/shop?category=${product.category.name}`}
            className="text-inherit no-underline hover:underline"
          >
            {product.category.name}
          </RouterLink>
        )}

        {product?.subCategory?.name && (
          <RouterLink
            to={`/shop?subcategory=${product.subCategory.slug}`}
            className="text-inherit no-underline hover:underline"
          >
            {product.subCategory.name}
          </RouterLink>
        )}

        {product?.childCategory?.name && (
          <RouterLink
            to={`/shop?childCategory=${product.childCategory.slug}`}
            className="text-inherit no-underline hover:underline"
          >
            {product.childCategory.name}
          </RouterLink>
        )}

        {product?.name && (
          <Typography className="text-muted-foreground">
            {product.name}
          </Typography>
        )}
      </Breadcrumbs>
    </div>
  );
};

export default ProductBreadcrumbs;
