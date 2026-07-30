import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Heart, User, Menu, LogOut, Monitor } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

import GeneralInfoStore from '../../store/GeneralInfoStore';
import useCartStore from '../../store/useCartStore';
import useAuthUserStore from '../../store/AuthUserStore';
import useWishlistStore from '../../store/useWishlistStore';

import ImageComponent from './ImageComponent';
import MenuBar from './MenuBar';
import MobileMenu from './MobileMenu';
import Cart from './Cart';
import HeaderSearch from './HeaderSearch.jsx';

const Headers = () => {
  const navigate = useNavigate();
  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();
  const { cart } = useCartStore();
  const { user, logout } = useAuthUserStore();
  const { wishlist } = useWishlistStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const cartButtonRef = useRef(null);
  const cartMenuRef = useRef(null);

  const prevCartCount = useRef(
    cart.reduce((total, item) => total + item.quantity, 0),
  );

  const avatarClass = `
  w-10 h-10 md:w-12 md:h-12
  rounded-full object-cover border-2 border-white shadow-md
  flex items-center justify-center
  primaryBgColor accentTextColor
  transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg
`;

  const avatarInitialClass = `
  w-10 h-10 md:w-12 md:h-12
  rounded-full object-cover border-2 border-white shadow-md
  flex items-center justify-center
  primaryBgColor accentTextColor text-lg font-semibold
  transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg
`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      // Close cart menu
      if (
        cartMenuRef.current &&
        !cartMenuRef.current.contains(event.target) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target)
      ) {
        setIsCartMenuOpen(false);
      }

      // Close user dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isMenuOpen || isCartMenuOpen || isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isCartMenuOpen, isDropdownOpen]);

  useEffect(() => {
    const currentCartCount = cart.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    if (
      currentCartCount > prevCartCount.current &&
      !window.location.pathname.includes('/checkout')
    ) {
      setIsCartMenuOpen(true);
    }
    prevCartCount.current = currentCartCount;
  }, [cart]);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (GeneralInfoListError) {
    return (
      <div className="primaryTextColor container md:mx-auto text-center p-3">
        <h1>Something went wrong! Please try again later.</h1>
      </div>
    );
  }

  if (GeneralInfoListLoading) {
    return (
      <div className="xl:container xl:mx-auto p-3">
        <Skeleton height={40} />
        <Skeleton height={60} />
        <Skeleton height={40} />
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-40">
        {/* Header Main */}
        <div className=" md:px-3 primaryBgColor">
          <div className="py-1 px-3 flex gap-6 items-center justify-between xl:container xl:mx-auto">
            <div
              ref={hamburgerRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl cursor-pointer lg:hidden"
              role="button"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="md:w-8 md:h-8 cursor-pointer text-white" />
            </div>

            <Link to="/">
              <ImageComponent
                imageName={GeneralInfoList?.PrimaryLogo}
                className="w-30 h-10"
                altName={GeneralInfoList?.CompanyName}
                skeletonHeight={'10'}
              />
            </Link>
            <div className={'hidden lg:block'}>
              <HeaderSearch fullSize={true} />
            </div>

            {/* Right Icons */}
            <div className="flex items-center justify-center gap-2 relative">
              <div className={'lg:hidden'}>
                <HeaderSearch />
              </div>
              {/* PC Builder */}
              <Link
                to="/pc-builder"
                className="border border-white/30 text-white px-3 py-1.5 text-sm font-semibold rounded hover:bg-white/10 transition-colors"
              >
                PC Builder
              </Link>

              {/* Wishlist */}

              <Link
                to="/user/wishlist"
                className="relative flex flex-col justify-center items-center"
                aria-label="Wishlist"
              >
                <Heart className="md:w-8 md:h-8 cursor-pointer text-white" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 -right-2 -mt-2 -mr-2 md:mr-0 secondaryBgColor rounded-full h-6 w-6 flex items-center justify-center text-xs accentTextColor">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <div
                ref={cartButtonRef}
                onClick={() => setIsCartMenuOpen(!isCartMenuOpen)}
                className="relative"
                role="button"
                aria-label="Shopping cart"
                aria-expanded={isCartMenuOpen}
              >
                <div className={'flex flex-col justify-center items-center'}>
                  {/* Shopping Cart Icon */}
                  <ShoppingCart
                    className="md:w-8 md:h-8 cursor-pointer text-white"
                    aria-hidden="true"
                  />
                </div>

                {/* Cart Quantity Badge */}
                {totalQuantity > 0 && (
                  <span className="absolute top-0 -right-2 -mt-2 -mr-2 md:mr-0 secondaryBgColor rounded-full h-6 w-6 flex items-center justify-center text-xs accentTextColor">
                    {totalQuantity}
                  </span>
                )}
              </div>

              {/* User / Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 cursor-pointer"
                    aria-label="User menu"
                    aria-expanded={isDropdownOpen}
                  >
                    {user?.userImage &&
                    typeof user.userImage === 'string' &&
                    user.userImage.trim() !== '' ? (
                      <ImageComponent
                        imageName={user.userImage}
                        className={avatarClass}
                      />
                    ) : (
                      <span className={avatarInitialClass}>
                        {(user?.fullName &&
                          user.fullName.trim().charAt(0).toUpperCase()) ||
                          'U'}
                      </span>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 top-full right-0 mt-3 bg-white shadow-xl rounded-lg p-3 min-w-[180px] animate-fadeIn"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <button className="primaryBgColor px-4 py-2 rounded-lg w-full accentTextColor cursor-pointer hover:opacity-90 transition-opacity">
                          <Link
                            to="/user/home"
                            className={'flex items-center justify-center gap-2'}
                          >
                            <User
                              className="md:w-8 md:h-8 cursor-pointer text-white"
                              aria-hidden="true"
                            />
                          </Link>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="bg-red-500 w-full text-white px-4 py-2 cursor-pointer rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                          aria-label="Log out"
                        >
                          <LogOut
                            className="w-8 h-8 text-white cursor-pointer"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" aria-label="Login or register">
                  <div className="flex items-center gap-2 flex-col">
                    <User
                      className="md:w-8 md:h-8 cursor-pointer text-white"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
            isMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            ref={menuRef}
            className="relative bg-white w-64 h-full shadow-lg transform transition-transform"
            style={{
              transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Link to="/" aria-label="Home">
                  <ImageComponent
                    imageName={GeneralInfoList?.PrimaryLogo}
                    className="w-30"
                    altName={GeneralInfoList?.CompanyName}
                  />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-8 h-8 cursor-pointer" />
                </button>
              </div>

              <div className="space-y-2">
                <MobileMenu onClose={() => setIsMenuOpen(false)} />
              </div>
              <div className="mt-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="primaryBgColor accentTextColor px-4 py-2 rounded-lg w-full"
                    aria-label="Log out"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link to="/login" aria-label="Login or register">
                    <div className="inline-flex items-center gap-3">
                      <User
                        className="w-8 h-8 cursor-pointer"
                        aria-hidden="true"
                      />
                      <span className="text-sm">Login / Register</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cart Menu */}
        <div
          className={`fixed inset-0 z-50 ß transition-opacity duration-300 ${
            isCartMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-opacity-50"
            onClick={() => setIsCartMenuOpen(false)}
          />

          {/* Slide-In Cart from Right */}
          <div
            ref={cartMenuRef}
            className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg transition-transform duration-300 ease-in-out"
            style={{
              transform: isCartMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between text-lg mb-4">
                <h1>Your Cart</h1>
                <h1>
                  {totalQuantity} {totalQuantity <= 1 ? 'item' : 'items'}
                </h1>
                <button
                  onClick={() => setIsCartMenuOpen(false)}
                  className={'cursor-pointer'}
                  aria-label="Close cart"
                >
                  <X className="w-8 h-8 cursor-pointer" />
                </button>
              </div>

              {/* Cart Items Scrollable Section */}
              <div className="flex-1 overflow-y-auto space-y-2">
                <Cart onCloseCartMenu={() => setIsCartMenuOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MenuBar (Desktop) */}
      <div className="hidden lg:block">
        <MenuBar />
      </div>
    </>
  );
};

export default Headers;
