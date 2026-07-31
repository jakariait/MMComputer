import { useRef, useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout.jsx';
import UserMenu from './UserMenu.jsx';
import { FaUser } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import { preloadUserRoutes } from '../../utils/routePreloader.js';

const UserLoadingFallback = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const UserLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    preloadUserRoutes();
  }, []);

  return (
    <Layout>
      <div className={'xl:container xl:mx-auto p-3 flex gap-4 relative'}>
        {/*User Menu*/}
        <div className={'w-[350px] hidden lg:block'}>
          <UserMenu />
        </div>
        {/*User Menu Icon*/}
        <button
          type="button"
          className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50 secondaryBgColor accentTextColor p-3 rounded-r-lg cursor-pointer"
          aria-label="Open user menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaUser className={'text-2xl'} aria-hidden="true" />
        </button>
        {/* Mobile Menu Overlay for User Menu */}
        <div
          inert={!isMenuOpen}
          aria-hidden={!isMenuOpen}
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
            isMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div
            ref={menuRef}
            className="relative bg-white w-64 h-full shadow-lg transform transition-transform duration-400 ease-in-out"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsMenuOpen(false);
            }}
            style={{
              transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            }}
          >
            <button
              className={
                'absolute z-50 right-5 top-5 bg-white p-2 rounded-full'
              }
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Close user menu"
            >
              <MdClose className={'w-4 h-4'} aria-hidden="true" />
            </button>
            <UserMenu />
          </div>
        </div>
        {/*Children Component Append Here*/}
        <div className="w-full">
          <Suspense fallback={<UserLoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default UserLayout;
