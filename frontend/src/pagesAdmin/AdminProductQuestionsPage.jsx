import React, { useEffect } from 'react';
import AdminProductQuestions from '../component/componentAdmin/AdminProductQuestions.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const AdminProductQuestionsPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('PRODUCT QUESTIONS', 'Manage Product Questions & Answers');
  }, []);

  return (
    <RequirePermission permission="product_questions">
      <AdminProductQuestions />
    </RequirePermission>
  );
};

export default AdminProductQuestionsPage;
