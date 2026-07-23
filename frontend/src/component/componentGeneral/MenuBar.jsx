import { useState, memo, useRef, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import useCategoryStore from '../../store/useCategoryStore.js';
import useSubCategoryStore from '../../store/useSubCategoryStore.js';
import useChildCategoryStore from '../../store/useChildCategoryStore.js';

const MenuBar = () => {
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const location = useLocation();

  // Build query string helper
  const buildQueryString = useCallback((params) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    return urlParams.toString();
  }, []);

  // Check if current route matches to prevent unnecessary navigation
  const isCurrentRoute = useCallback(
    (queryParams) => {
      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(queryParams);

      // Compare relevant parameters
      return (
        currentParams.get('category') === newParams.get('category') &&
        currentParams.get('subcategory') === newParams.get('subcategory') &&
        currentParams.get('childCategory') === newParams.get('childCategory')
      );
    },
    [location.search],
  );

  return (
    <div className="lg:shadow-sm lg:bg-white border-b border-gray-100 lg:border-b-0">
      <nav>
        {/*
          Minimum gap on every breakpoint:
          - flex-wrap + gap-x-* + gap-y-* keeps a real gutter even when items wrap
          - gap scales up gently as the viewport grows
        */}
        <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:gap-x-1">
          {categories?.length ? (
            categories.map((category) => {
              const categoryQuery = buildQueryString({
                category: category.name,
              });
              const categoryPath = `/shop?${categoryQuery}`;
              const hasSubCategories =
                Array.isArray(subCategories) &&
                subCategories.some(
                  (subCat) =>
                    subCat?.category?._id === category._id && subCat.isActive,
                );
              const active = isCurrentRoute(categoryQuery);

              return (
                <MenuItem
                  key={category._id}
                  active={active}
                  hasChildren={hasSubCategories}
                  label={
                    <Link
                      to={categoryPath}
                      className="flex items-center gap-1 w-full text-left"
                      onClick={(e) => {
                        // Prevent navigation if already on this category
                        if (active) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {category.name}
                    </Link>
                  }
                >
                  {hasSubCategories && (
                    <SubMenu
                      subCategories={subCategories}
                      categoryId={category._id}
                      childCategories={childCategories}
                      buildQueryString={buildQueryString}
                      isCurrentRoute={isCurrentRoute}
                    />
                  )}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem label={<span></span>} />
          )}
        </ul>
      </nav>
    </div>
  );
};

// ✅ Optimized MenuItem Component with better hover handling
const MenuItem = memo(({ label, children, active, hasChildren }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (children) {
      openMenu();
    }
  }, [children, openMenu]);

  const handleMouseLeave = useCallback(() => {
    if (children) {
      timerRef.current = setTimeout(closeMenu, 250);
    }
  }, [children, closeMenu]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeMenu]);

  // Close on Escape for keyboard users
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closeMenu]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <li
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex items-center  px-2 py-2 rounded-md uppercase font-semibold tracking-wide cursor-pointer transition-colors duration-150
         `}
        onClick={() => hasChildren && setIsOpen((prev) => !prev)}
      >
        {label}
        {hasChildren && (
          <ChevronDown
            size={14}
            strokeWidth={2.5}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>

      {children && (
        <div
          className={`absolute left-0 top-full pt-2 z-50 transition-all duration-200 ${
            isOpen
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible -translate-y-1 pointer-events-none'
          }`}
          onMouseEnter={openMenu}
          onMouseLeave={handleMouseLeave}
        >
          <div className="min-w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-1.5">
            {children}
          </div>
        </div>
      )}
    </li>
  );
});

// ✅ Optimized SubMenu Component using Links instead of navigate
const SubMenu = memo(
  ({
    subCategories,
    categoryId,
    childCategories,
    items,
    buildQueryString,
    isCurrentRoute,
  }) => {
    const [hoveredSub, setHoveredSub] = useState(null);
    const filteredSubCategories = Array.isArray(subCategories)
      ? subCategories.filter(
          (subCategory) => subCategory?.category?._id === categoryId,
        )
      : [];

    return (
      <ul className="text-black">
        {filteredSubCategories
          .filter((subCategory) => subCategory.isActive)
          .map((subCategory) => {
            const subCategoryQuery = buildQueryString({
              subcategory: subCategory.slug,
            });
            const subCategoryPath = `/shop?${subCategoryQuery}`;
            const hasChildren = Array.isArray(childCategories)
              ? childCategories.some(
                  (childCategory) =>
                    String(
                      childCategory?.subCategory?._id ||
                        childCategory?.subCategory,
                    ) === String(subCategory._id) && childCategory.isActive,
                )
              : false;

            return (
              <li
                key={subCategory._id}
                className="relative px-1.5"
                onMouseEnter={() => setHoveredSub(subCategory._id)}
                onMouseLeave={() => setHoveredSub(null)}
              >
                <Link
                  to={subCategoryPath}
                  className="flex items-center justify-between gap-2 w-full text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-2.5 py-2 rounded-md transition-colors duration-150"
                  onClick={(e) => {
                    if (isCurrentRoute && isCurrentRoute(subCategoryQuery)) {
                      e.preventDefault();
                    }
                  }}
                >
                  {subCategory.name}
                  {hasChildren && (
                    <ChevronDown
                      size={12}
                      strokeWidth={2.5}
                      className="text-gray-300 -rotate-90"
                    />
                  )}
                </Link>
                {hoveredSub === subCategory._id && hasChildren && (
                  <div className="absolute left-full top-0 ml-1.5 min-w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-1.5 z-50">
                    <ChildSubMenu
                      subCategoryId={subCategory._id}
                      childCategories={childCategories}
                      buildQueryString={buildQueryString}
                      isCurrentRoute={isCurrentRoute}
                    />
                  </div>
                )}
              </li>
            );
          })}

        {items?.map((item, index) => (
          <li key={index} className="px-1.5">
            <Link
              to={item.path}
              className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-2.5 py-2 rounded-md transition-colors duration-150"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  },
);

// ✅ Optimized ChildSubMenu Component using Links
const ChildSubMenu = memo(
  ({ childCategories, subCategoryId, buildQueryString, isCurrentRoute }) => {
    const filteredChildCategories = Array.isArray(childCategories)
      ? childCategories.filter(
          (childCategory) =>
            String(
              childCategory?.subCategory?._id || childCategory?.subCategory,
            ) === String(subCategoryId),
        )
      : [];

    if (filteredChildCategories.length === 0) return null;

    return (
      <ul className="text-black">
        {filteredChildCategories
          .filter((childCategory) => childCategory.isActive)
          .map((childCategory) => {
            const childCategoryQuery = buildQueryString({
              childCategory: childCategory.slug,
            });
            const childCategoryPath = `/shop?${childCategoryQuery}`;

            return (
              <li key={childCategory._id} className="px-1.5">
                <Link
                  to={childCategoryPath}
                  className="block w-full text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-2.5 py-2 rounded-md transition-colors duration-150"
                  onClick={(e) => {
                    if (isCurrentRoute && isCurrentRoute(childCategoryQuery)) {
                      e.preventDefault();
                    }
                  }}
                >
                  {childCategory.name}
                </Link>
              </li>
            );
          })}
      </ul>
    );
  },
);

export default MenuBar;
