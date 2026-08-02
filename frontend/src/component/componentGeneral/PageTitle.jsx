import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import GeneralInfoStore from '../../store/GeneralInfoStore.js';

const TITLE_RULES = [
  { path: '/', title: 'Home' },
  { path: '/shop', title: 'Shop' },
  { path: '/product/', title: 'Product Details' },
  { path: '/contact-us', title: 'Contact Us' },
  { path: '/login', title: 'Login' },
  { path: '/register', title: 'Register' },
  { path: '/checkout', title: 'Checkout' },
  { path: '/thank-you/', title: 'Order Confirmation' },
  { path: '/bkash-callback', title: 'Payment Status' },
  { path: '/about', title: 'About Us' },
  { path: '/termofservice', title: 'Terms of Service' },
  { path: '/privacypolicy', title: 'Privacy Policy' },
  { path: '/refundpolicy', title: 'Refund Policy' },
  { path: '/shippinpolicy', title: 'Shipping Policy' },
  { path: '/faqs', title: 'FAQs' },
  { path: '/track-order', title: 'Track Order' },
  { path: '/blogs/', title: 'Blog Details' },
  { path: '/blog', title: 'Blog' },
  { path: '/forgot-password', title: 'Forgot Password' },
  { path: '/reset-password', title: 'Reset Password' },
  { path: '/product-compare', title: 'Compare Products' },
  { path: '/warranty', title: 'Warranty' },
  { path: '/brands', title: 'Brands' },
  { path: '/repair-service', title: 'Repair Service' },
  { path: '/pc-builder', title: 'PC Builder' },
  { path: '/feedback-complain', title: 'Feedback & Complain' },
];

const PageTitle = () => {
  const { GeneralInfoList } = GeneralInfoStore();
  const { pathname } = useLocation();

  useEffect(() => {
    const rule = TITLE_RULES.find(({ path }) =>
      path === '/' ? pathname === '/' : pathname.startsWith(path),
    );
    if (!rule) return;
    const company = GeneralInfoList?.CompanyName;
    document.title = company
      ? `${rule.title} | ${company}`
      : rule.title;
  }, [pathname, GeneralInfoList?.CompanyName]);

  return null;
};

export default PageTitle;
