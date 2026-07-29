import React, { useEffect } from 'react';
import FeedbackComplainTable from '../component/componentAdmin/FeedbackComplainTable.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const FeedbackComplainPageAdmin = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('FEEDBACK & COMPLAIN', 'View All Feedback & Complaints');
  }, []);

  return (
    <RequirePermission permission="feedback_complain">
      <FeedbackComplainTable />
    </RequirePermission>
  );
};

export default FeedbackComplainPageAdmin;
