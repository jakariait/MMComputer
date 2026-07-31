import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  ShoppingCart,
  Heart,
  Monitor,
} from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useUIStore from '../../store/useUIStore';
import useWishlistStore from '../../store/useWishlistStore';

const navItems = [
  { icon: Home, label: 'Home', id: 'home', path: '/' },
  { icon: MessageCircle, label: 'Contact', id: 'chat', path: '/contact-us' },
  { icon: Monitor, label: 'PC Builder', id: 'pc-builder', path: '/pc-builder' },
  {
    icon: ShoppingCart,
    label: 'Cart',
    id: 'cart',
    path: null,
    showBadge: true,
  },
  {
    icon: Heart,
    label: 'Wishlist',
    id: 'wishlist',
    path: '/user/wishlist',
    showBadge: true,
  },
];

export default function MobileStickyBottom() {
  const { cart } = useCartStore();
  const { toggleCart } = useUIStore();
  const { wishlist } = useWishlistStore();
  const [active, setActive] = useState('home');
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > lastScrollY.current + 8) {
            setVisible(false);
          } else if (currentY < lastScrollY.current - 8) {
            setVisible(true);
          }
          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActive(id);
  };

  const handleCartClick = () => {
    setActive('cart');
    toggleCart();
  };

  return (
    <div
      className={`fixed md:hidden  bottom-0 left-0 right-0 z-510 transition-transform duration-300 ease-in-out pointer-events-none ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="secondaryBgColor  rounded flex items-center justify-around px-1 pt-2.5 pb-2">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          const content = (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative cursor-pointer flex flex-col items-center gap-[3px] bg-transparent outline-none px-3 pb-1 rounded-2xl active:scale-90 transition-transform duration-150 pointer-events-auto ${
                item.id === 'cart' ? 'cart-toggle-btn' : ''
              } ${
                item.id === 'pc-builder'
                  ? 'border border-gray-100 border-dashed rounded-lg'
                  : 'border-none'
              }`}
            >
              {Icon && (
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`transition-all duration-200 ${
                      isActive ? 'text-white -translate-y-px' : 'text-white'
                    }`}
                  />
                  {item.showBadge &&
                    ((item.id === 'cart' && totalQuantity > 0) ||
                      (item.id === 'wishlist' && wishlist.length > 0)) && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full primaryBgColor flex items-center justify-center text-[10px] font-medium text-white">
                        {item.id === 'cart'
                          ? totalQuantity > 99
                            ? '99+'
                            : totalQuantity
                          : wishlist.length > 99
                            ? '99+'
                            : wishlist.length}
                      </span>
                    )}
                </div>
              )}

              <span
                className={`text-[10.5px] font-medium tracking-wide leading-none transition-colors duration-200 ${
                  isActive ? 'text-gray-100' : 'text-gray-50'
                }`}
              >
                {item.label}
              </span>

              <span
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-200 transition-transform duration-200 ${
                  isActive ? 'scale-100' : 'scale-0'
                }`}
              />
            </button>
          );

          if (item.id === 'cart') {
            return (
              <div key={item.id} onClick={handleCartClick} className="contents">
                {content}
              </div>
            );
          }

          if (item.path) {
            return (
              <Link key={item.id} to={item.path} className="contents">
                {content}
              </Link>
            );
          }

          return content;
        })}
      </div>
    </div>
  );
}
