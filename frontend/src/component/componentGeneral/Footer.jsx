import React from 'react';
import GeneralInfoStore from '../../store/GeneralInfoStore.js';
import { Link } from 'react-router-dom';
import SocialMedia from './SocialMedia.jsx';
import ImageComponent from './ImageComponent.jsx';
import Skeleton from 'react-loading-skeleton';
import { MapPin, Phone, ArrowUpRight } from 'lucide-react';

const menuLinks = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact-us' },
  { label: 'PC Builder', to: '/pc-builder' },
  { label: 'Feedback & Complain', to: '/feedback-complain' },
  { label: 'Track Your Order', to: '/track-order' },
  { label: 'Brands', to: '/brands' },
  { label: 'Warranty', to: '/warranty' },
  { label: 'Repair & Service', to: '/repair-service' },
  { label: 'Terms of Service', to: '/termofservice' },
  { label: 'Privacy Policy', to: '/privacypolicy' },
  { label: 'Refund Policy', to: '/refundpolicy' },
  { label: 'Shipping Policy', to: '/shippinpolicy' },
  { label: 'FAQ', to: '/faqs' },
];

const phoneFields = [
  { label: 'Sales', field: 'SalesPhone' },
  { label: 'Service', field: 'ServicePhone' },
  { label: 'Hotline', field: 'HotlinePhone' },
];

// Small caps "label" used the way a care-tag prints a category —
// e.g. SALES / SERVICE / HOTLINE — the recurring visual motif of this footer.
const TagLabel = ({ children }) => (
  <span className=" tracking-[0.18em] uppercase tertiaryTextColor">
    {children}
  </span>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-1 text-sm accentTextColor transition-colors hover:tertiaryTextColor"
  >
    <span className="relative">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 tertiaryBgColor transition-all duration-300 group-hover:w-full" />
    </span>
  </Link>
);

const Footer = () => {
  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();

  if (GeneralInfoListError) {
    return (
      <div className="primaryTextColor container md:mx-auto text-center p-3">
        <h1 className="p-20">Something went wrong! Please try again later.</h1>
      </div>
    );
  }

  return (
    <div>
      {GeneralInfoListLoading ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
            <Skeleton height={200} width="100%" />
            <Skeleton height={200} width="100%" />
            <Skeleton height={200} width="100%" />
            <Skeleton height={200} width="100%" />
          </div>
          <Skeleton height={40} width="100%" />
        </>
      ) : (
        <footer className="secondaryBgColor text-[#D8E3D9]">
          {/* Stitched seam accent along the very top edge of the footer */}
          <div
            className="h-px w-full opacity-40"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #C6A15B 0 10px, transparent 10px 18px)',
            }}
          />

          <div className="xl:container xl:mx-auto px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div className="flex items-center justify-between flex-col gap-4">
                <Link to="/" className="inline-block">
                  <ImageComponent
                    imageName={GeneralInfoList?.SecondaryLogo}
                    className="w-30 h-30 object-contain "
                    altName={GeneralInfoList?.CompanyName}
                    skeletonHeight={44}
                  />
                </Link>
                {GeneralInfoList?.CompanyName && (
                  <p className="text-lg font-medium tertiaryTextColor">
                    {GeneralInfoList.CompanyName}
                  </p>
                )}
                {GeneralInfoList?.CompanyAddress && (
                  <div className="flex items-start gap-2 max-w-xs">
                    <MapPin className="size-4 mt-0.5 shrink-0 tertiaryTextColor" />
                    <p className="text-sm accentTextColor">
                      {GeneralInfoList.CompanyAddress}
                    </p>
                  </div>
                )}
                <div className="pt-2">
                  <SocialMedia />
                </div>
              </div>

              {/* Get in touch */}
              <div className="space-y-4 flex flex-col  ">
                <TagLabel>Get in touch</TagLabel>
                <div className="space-y-3">
                  {phoneFields.map(
                    ({ label, field }) =>
                      Array.isArray(GeneralInfoList?.[field]) &&
                      GeneralInfoList[field].length > 0 && (
                        <div key={field} className="flex items-start gap-2">
                          <Phone className="size-4 mt-0.5 shrink-0 tertiaryTextColor" />
                          <div>
                            <span className="block text-[11px] accentTextColor">
                              {label}
                            </span>
                            <p className="text-sm text-[#D8E3D9]">
                              {GeneralInfoList[field].map((number, i) => (
                                <React.Fragment key={i}>
                                  {i > 0 && <span>, </span>}
                                  <a
                                    href={`tel:${number}`}
                                    className="hover:tertiaryTextColor transition-colors"
                                  >
                                    {number}
                                  </a>
                                </React.Fragment>
                              ))}
                            </p>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>

              {/* Menu */}
              <div className="space-y-4">
                <TagLabel>Menu</TagLabel>
                <nav className="grid grid-cols-2 gap-x-6 gap-y-3 pt-5">
                  {menuLinks.map((link) => (
                    <FooterLink key={link.to} to={link.to}>
                      {link.label}
                    </FooterLink>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Dashed stitch divider, echoing the top seam */}
          <div
            className="h-px w-full opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #9FB3A4 0 10px, transparent 10px 18px)',
            }}
          />

          <div className="xl:container xl:mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#9FB3A4]">
            <p>
              &copy; {new Date().getFullYear()} {GeneralInfoList?.CompanyName}.
              All rights reserved.
            </p>
            <a
              href="https://www.digiwebdigital.com/"
              className="group inline-flex items-center gap-1 hover:text-[#C6A15B] transition-colors"
            >
              Design and developed by
              <span className="font-medium text-[#D8E3D9] group-hover:text-[#C6A15B]">
                DigiWeb
              </span>
              <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Footer;
