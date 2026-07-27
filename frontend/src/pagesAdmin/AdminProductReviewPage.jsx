import React, { useEffect } from 'react';
import AdminProductReview from '../component/componentAdmin/AdminProductReview.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const AdminProductReviewPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('PRODUCT REVIEWS', 'Manage Product Reviews');
  }, []);

  return (
    <RequirePermission permission="product_reviews">
      <AdminProductReview />
    </RequirePermission>
  );
};

export default AdminProductReviewPage;
