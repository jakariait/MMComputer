import React from 'react';
import GeneralInfoStore from '../../store/GeneralInfoStore.js';
import { Link } from 'react-router-dom';
import SocialMedia from './SocialMedia.jsx';
import ImageComponent from './ImageComponent.jsx';
import Skeleton from 'react-loading-skeleton';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact-us' },
  { label: 'Track Your Order', to: '/track-order' },
];

const policyLinks = [
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
  <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9FB3A4]">
    {children}
  </span>
);

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-1 text-sm text-[#D8E3D9] transition-colors hover:text-[#C6A15B]"
  >
    <span className="relative">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#C6A15B] transition-all duration-300 group-hover:w-full" />
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

          <div className="xl:container xl:mx-auto px-6 py-14">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {/* Brand */}
              <div className="space-y-4 lg:col-span-1">
                <Link to="/" className="inline-block">
                  <ImageComponent
                    imageName={GeneralInfoList?.PrimaryLogo}
                    className="max-h-11 object-contain brightness-0 invert"
                    altName={GeneralInfoList?.CompanyName}
                    skeletonHeight={44}
                  />
                </Link>
                {GeneralInfoList?.CompanyName && (
                  <p className="text-lg font-medium text-[#F3EFE4]">
                    {GeneralInfoList.CompanyName}
                  </p>
                )}
                {GeneralInfoList?.CompanyAddress && (
                  <div className="flex items-start gap-2 max-w-xs">
                    <MapPin className="size-4 mt-0.5 shrink-0 text-[#C6A15B]" />
                    <p className="text-sm text-[#9FB3A4]">
                      {GeneralInfoList.CompanyAddress}
                    </p>
                  </div>
                )}
                <div className="pt-2">
                  <SocialMedia />
                </div>
              </div>

              {/* Company links */}
              <div className="space-y-4">
                <TagLabel>Company</TagLabel>
                <nav className="flex flex-col gap-3">
                  {companyLinks.map((link) => (
                    <FooterLink key={link.to} to={link.to}>
                      {link.label}
                    </FooterLink>
                  ))}
                </nav>
              </div>

              {/* Policy links */}
              <div className="space-y-4">
                <TagLabel>Policies</TagLabel>
                <nav className="flex flex-col gap-3">
                  {policyLinks.map((link) => (
                    <FooterLink key={link.to} to={link.to}>
                      {link.label}
                    </FooterLink>
                  ))}
                </nav>
              </div>

              {/* Contact + social */}
              <div className="space-y-4">
                <TagLabel>Get in touch</TagLabel>
                <div className="space-y-3">
                  {phoneFields.map(
                    ({ label, field }) =>
                      GeneralInfoList?.[field]?.length > 0 && (
                        <div key={field} className="flex items-start gap-2">
                          <Phone className="size-4 mt-0.5 shrink-0 text-[#C6A15B]" />
                          <div>
                            <span className="block text-[11px] text-[#9FB3A4]">
                              {label}
                            </span>
                            {GeneralInfoList[field].map((number, i) => (
                              <a
                                key={i}
                                href={`tel:${number}`}
                                className="block text-sm text-[#D8E3D9] hover:text-[#C6A15B] transition-colors"
                              >
                                {number}
                              </a>
                            ))}
                          </div>
                        </div>
                      ),
                  )}
                </div>
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
