import React, { useEffect, useState } from 'react';
import PageEditor from '../component/componentAdmin/PageEditor.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const TABS = [
  { id: 'terms', label: 'Terms of Services' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'refund', label: 'Refund Policy' },
  { id: 'shipping', label: 'Shipping Policy' },
  { id: 'warranty', label: 'Warranty' },
];

const TermsPage = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('TERM OF SERVICES', 'Update Terms of Services');
  }, []);

  return (
    <RequirePermission permission="about_terms-policies">
      <div>
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'terms' && <PageEditor title="Terms of Services" endpoint="terms" />}
        {activeTab === 'privacy' && <PageEditor title="Privacy Policy" endpoint="privacy" />}
        {activeTab === 'refund' && <PageEditor title="Refund Policy" endpoint="refund" />}
        {activeTab === 'shipping' && <PageEditor title="Shipping Policy" endpoint="shipping" />}
        {activeTab === 'warranty' && <PageEditor title="Warranty" endpoint="warranty" />}
      </div>
    </RequirePermission>
  );
};

export default TermsPage;
