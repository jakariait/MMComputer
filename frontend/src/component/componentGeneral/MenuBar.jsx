import { memo, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCategoryStore from '../../store/useCategoryStore.js';
import useSubCategoryStore from '../../store/useSubCategoryStore.js';
import useChildCategoryStore from '../../store/useChildCategoryStore.js';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from '@/components/ui/menubar';

const MenuBar = () => {
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('');

  const buildQueryString = useCallback((params) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    return urlParams.toString();
  }, []);

  const isCurrentRoute = useCallback(
    (queryParams) => {
      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(queryParams);
      return (
        currentParams.get('category') === newParams.get('category') &&
        currentParams.get('subcategory') === newParams.get('subcategory') &&
        currentParams.get('childCategory') === newParams.get('childCategory')
      );
    },
    [location.search],
  );

  const handleNavigate = useCallback(
    (path) => {
      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(path.split('?')[1] || '');
      const shouldSkip =
        currentParams.get('category') === newParams.get('category') &&
        currentParams.get('subcategory') === newParams.get('subcategory') &&
        currentParams.get('childCategory') === newParams.get('childCategory');
      if (!shouldSkip) {
        navigate(path);
      }
    },
    [navigate, location.search],
  );

  return (
    <div className="shadow">
      <nav>
        <Menubar
          value={activeMenu}
          onValueChange={setActiveMenu}
          className="flex-wrap justify-center border-0 bg-transparent shadow-none h-auto gap-0"
        >
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

              if (!hasSubCategories) {
                return (
                  <MenubarMenu key={category._id}>
                    <MenubarTrigger
                      className="uppercase text-sm font-semibold tracking-wide px-3 py-2 data-[state=open]:bg-transparent focus:bg-transparent cursor-pointer"
                      onClick={() => handleNavigate(categoryPath)}
                    >
                      {category.name}
                    </MenubarTrigger>
                  </MenubarMenu>
                );
              }

              return (
                <MenubarMenu key={category._id} value={category._id}>
                  <MenubarTrigger
                    className="uppercase text-sm font-semibold tracking-wide px-3 py-2 data-[state=open]:bg-transparent focus:bg-transparent cursor-pointer"
                    onPointerEnter={() => setActiveMenu(category._id)}
                    onClick={() => handleNavigate(categoryPath)}
                  >
                    {category.name}
                  </MenubarTrigger>
                  <MenubarContent>
                    <SubMenu
                      subCategories={subCategories}
                      categoryId={category._id}
                      childCategories={childCategories}
                      buildQueryString={buildQueryString}
                      handleNavigate={handleNavigate}
                    />
                  </MenubarContent>
                </MenubarMenu>
              );
            })
          ) : (
            <MenubarMenu>
              <MenubarTrigger className="uppercase text-sm font-semibold tracking-wide px-3 py-2" />
            </MenubarMenu>
          )}
        </Menubar>
      </nav>
    </div>
  );
};

const SubMenu = memo(
  ({
    subCategories,
    categoryId,
    childCategories,
    items,
    buildQueryString,
    handleNavigate,
  }) => {
    const filteredSubCategories = Array.isArray(subCategories)
      ? subCategories.filter((subCat) => subCat?.category?._id === categoryId)
      : [];

    return (
      <>
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

            if (!hasChildren) {
              return (
                <MenubarItem
                  key={subCategory._id}
                  onSelect={() => handleNavigate(subCategoryPath)}
                >
                  {subCategory.name}
                </MenubarItem>
              );
            }

            return (
              <MenubarSub key={subCategory._id}>
                <MenubarSubTrigger
                  className="cursor-pointer"
                  onClick={() => handleNavigate(subCategoryPath)}
                >
                  {subCategory.name}
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <ChildSubMenu
                    subCategoryId={subCategory._id}
                    childCategories={childCategories}
                    buildQueryString={buildQueryString}
                    handleNavigate={handleNavigate}
                  />
                </MenubarSubContent>
              </MenubarSub>
            );
          })}

        {items?.map((item, index) => (
          <MenubarItem key={index} onSelect={() => handleNavigate(item.path)}>
            {item.name}
          </MenubarItem>
        ))}
      </>
    );
  },
);

const ChildSubMenu = memo(
  ({ childCategories, subCategoryId, buildQueryString, handleNavigate }) => {
    const filteredChildCategories = Array.isArray(childCategories)
      ? childCategories.filter(
          (childCategory) =>
            String(
              childCategory?.subCategory?._id || childCategory?.subCategory,
            ) === String(subCategoryId),
        )
      : [];

    if (filteredChildCategories.length === 0) return null;

    return filteredChildCategories
      .filter((childCategory) => childCategory.isActive)
      .map((childCategory) => {
        const childCategoryQuery = buildQueryString({
          childCategory: childCategory.slug,
        });
        const childCategoryPath = `/shop?${childCategoryQuery}`;

        return (
          <MenubarItem
            key={childCategory._id}
            onSelect={() => handleNavigate(childCategoryPath)}
          >
            {childCategory.name}
          </MenubarItem>
        );
      });
  },
);

export default MenuBar;
