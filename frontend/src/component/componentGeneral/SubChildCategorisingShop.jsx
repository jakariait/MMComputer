import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useCategoryStore from '../../store/useCategoryStore.js';
import useSubCategoryStore from '../../store/useSubCategoryStore.js';
import useChildCategoryStore from '../../store/useChildCategoryStore.js';

const BackChip = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-3 py-1 rounded-full text-sm border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
  >
    &larr; {children}
  </button>
);

const SubChildCategorisingShop = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const { subCategories, fetchSubCategories } = useSubCategoryStore();
  const { childCategories, fetchChildCategories } = useChildCategoryStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const categoryName = searchParams.get('category') || '';
  const subcategorySlug = searchParams.get('subcategory') || '';
  const childCategorySlug = searchParams.get('childCategory') || '';

  useEffect(() => {
    if (!categories || categories.length === 0) fetchCategories();
    if (!subCategories || subCategories.length === 0) fetchSubCategories();
    if (!childCategories || childCategories.length === 0)
      fetchChildCategories();
  }, [
    categories,
    fetchCategories,
    subCategories,
    fetchSubCategories,
    childCategories,
    fetchChildCategories,
  ]);

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.name === categoryName) || null,
    [categories, categoryName],
  );

  const selectedChildCategory = useMemo(
    () => childCategories.find((child) => child.slug === childCategorySlug) || null,
    [childCategories, childCategorySlug],
  );

  const selectedSubCategory = useMemo(() => {
    if (subcategorySlug) {
      return subCategories.find((sub) => sub.slug === subcategorySlug) || null;
    }
    if (selectedChildCategory?.subCategory) {
      return (
        subCategories.find(
          (sub) => sub._id === selectedChildCategory.subCategory._id,
        ) || null
      );
    }
    return null;
  }, [subCategories, subcategorySlug, selectedChildCategory]);

  const activeCategory = useMemo(() => {
    if (selectedCategory) return selectedCategory;
    if (selectedSubCategory?.category) {
      return (
        categories.find(
          (cat) => cat._id === selectedSubCategory.category._id,
        ) || null
      );
    }
    return null;
  }, [selectedCategory, selectedSubCategory, categories]);

  const filteredSubCategories = useMemo(() => {
    if (!activeCategory) return [];
    return subCategories.filter(
      (sub) => sub.category?._id === activeCategory._id,
    );
  }, [activeCategory, subCategories]);

  const filteredChildCategories = useMemo(() => {
    if (!selectedSubCategory) return [];
    return childCategories.filter(
      (child) => child.subCategory?._id === selectedSubCategory._id,
    );
  }, [selectedSubCategory, childCategories]);

  const level = selectedSubCategory
    ? 'child'
    : selectedCategory
      ? 'sub'
      : 'category';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === 'category') {
      params.delete('subcategory');
      params.delete('childCategory');
    } else if (key === 'subcategory') {
      params.delete('childCategory');
    }
    params.set('page', '1');
    setSearchParams(params, { replace: true });
  };

  const chipClass = (active) =>
    `px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer ${
      active
        ? 'primaryBgColor accentTextColor border-transparent'
        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
    }`;

  return (
    <div className="mb-4 space-y-3 shadow rounded  p-4 ">
      {level === 'category' && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => updateFilter('category', cat.name)}
                className={chipClass(cat.name === categoryName)}
              >
                {cat.name}
              </button>
            ))
          ) : (
            <span className="text-sm text-gray-400">
              No categories available
            </span>
          )}
        </div>
      )}

      {level === 'sub' && (
        <div className="flex flex-wrap items-center gap-2">
          <BackChip onClick={() => updateFilter('category', '')}>
            {activeCategory?.name || categoryName}
          </BackChip>

          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((sub) => (
              <button
                key={sub._id}
                type="button"
                onClick={() => updateFilter('subcategory', sub.slug)}
                className={chipClass(sub.slug === subcategorySlug)}
              >
                {sub.name}
              </button>
            ))
          ) : (
            <span className="text-sm text-gray-400">
              No sub categories available
            </span>
          )}
        </div>
      )}

      {level === 'child' && (
        <div className="flex flex-wrap items-center gap-2">
          <BackChip
            onClick={() => {
              if (subcategorySlug) updateFilter('subcategory', '');
              else updateFilter('childCategory', '');
            }}
          >
            {selectedSubCategory.name}
          </BackChip>

          {filteredChildCategories.length > 0 ? (
            filteredChildCategories.map((child) => (
              <button
                key={child._id}
                type="button"
                onClick={() =>
                  updateFilter(
                    'childCategory',
                    child.slug === childCategorySlug ? '' : child.slug,
                  )
                }
                className={chipClass(child.slug === childCategorySlug)}
              >
                {child.name}
              </button>
            ))
          ) : (
            <span className="text-sm text-gray-400">
              No child categories available
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SubChildCategorisingShop;