import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import useCategoryStore from '../../store/useCategoryStore.js';
import useSubCategoryStore from '../../store/useSubCategoryStore.js';
import useChildCategoryStore from '../../store/useChildCategoryStore.js';

const MobileMenu = ({ onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);

  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
    setExpandedSubCategory(null);
  };

  const toggleSubCategory = (subId) => {
    setExpandedSubCategory((prev) => (prev === subId ? null : subId));
  };

  // Function to build query strings for navigation
  const buildQueryString = (name) => {
    return new URLSearchParams({ category: name }).toString();
  };

  return (
    <div className="lg:hidden">
      <nav className="p-1">
        <ul className="space-y-2">
          {/* Categories */}
          {categories?.map((category) => {
            const hasSubs = subCategories?.some(
              (sub) => sub?.category?._id === category._id,
            );

            return (
              <li key={category._id}>
                <div className="flex justify-between items-center p-3">
                  <Link
                    to={`/shop?${buildQueryString(category.name)}`}
                    className="font-semibold"
                    onClick={onClose}
                  >
                    {category.name}
                  </Link>
                  {hasSubs && (
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className="text-xl"
                      aria-label={`Toggle ${category.name} subcategories`}
                    >
                      {expandedCategory === category._id ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                  )}
                </div>

                {expandedCategory === category._id && (
                  <MobileSubMenu
                    categoryId={category._id}
                    subCategories={subCategories}
                    childCategories={childCategories}
                    expandedSubCategory={expandedSubCategory}
                    toggleSubCategory={toggleSubCategory}
                    buildQueryString={buildQueryString}
                    onClose={onClose}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const MobileSubMenu = ({
  categoryId,
  subCategories,
  childCategories,
  expandedSubCategory,
  toggleSubCategory,
  buildQueryString,
  onClose,
}) => {
  const filteredSubs = subCategories?.filter(
    (sub) => sub?.category?._id === categoryId,
  );

  return (
    <ul className="pl-6">
      {filteredSubs?.map((sub) => {
        const hasChildren = childCategories?.some(
          (child) => child?.subCategory?._id === sub._id,
        );

        return (
          <li key={sub._id} className="py-2">
            <div className="flex justify-between items-center">
              <Link
                to={`/shop?${new URLSearchParams({
                  subcategory: sub.slug,
                }).toString()}`}
                className="block flex-1"
                onClick={onClose}
              >
                {sub.name}
              </Link>

              {hasChildren && (
                <button
                  onClick={() => toggleSubCategory(sub._id)}
                  className="pl-2 text-gray-500"
                  aria-label={`Toggle ${sub.name} children`}
                >
                  {expandedSubCategory === sub._id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>
              )}
            </div>

            {expandedSubCategory === sub._id && hasChildren && (
              <ul className="pl-4">
                {childCategories
                  ?.filter((child) => child?.subCategory?._id === sub._id)
                  ?.map((child) => (
                    <li key={child._id} className="py-1">
                      <Link
                        to={`/shop?${new URLSearchParams({
                          childCategory: child.slug,
                        }).toString()}`}
                        className="block text-sm text-gray-600"
                        onClick={onClose}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MobileMenu;
