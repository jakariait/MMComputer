import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useProductStore from '../../store/useProductStore.js';
import useBrandStore from '../../store/useBrandStore.js';
import useCategoryStore from '../../store/useCategoryStore.js';
import useSubCategoryStore from '../../store/useSubCategoryStore.js';
import useChildCategoryStore from '../../store/useChildCategoryStore.js';
import useFlagStore from '../../store/useFlagStore.js';
import ImageComponent from '../componentGeneral/ImageComponent.jsx';
import { Link, useNavigate } from 'react-router-dom';
import RequirePermission from './RequirePermission.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  Pencil,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { SectionHeader } from '@/component/componentAdmin/SectionHeader.jsx';

const ViewAllProducts = () => {
  const {
    products,
    totalPages,
    totalProductsAdmin,
    activeCount,
    inactiveCount,
    currentPage,
    loading,
    error,
    fetchProductsAdmin,
    deleteProduct,
    duplicateProduct,
  } = useProductStore();

  const { brands, fetchBrands } = useBrandStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subCategories, fetchSubCategories } = useSubCategoryStore();
  const { childCategories, fetchChildCategories } = useChildCategoryStore();
  const { flags, fetchFlags } = useFlagStore();

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    brand: '',
    category: '',
    subcategory: '',
    childCategory: '',
    flags: '',
    isActive: '',
    stock: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [allProductsCount, setAllProductsCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        filters.search ||
        filters.brand ||
        filters.category ||
        filters.subcategory ||
        filters.childCategory ||
        filters.flags ||
        filters.isActive ||
        filters.stock
      ) {
        setIsFiltering(true);
      } else {
        setIsFiltering(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [
    filters.search,
    filters.brand,
    filters.category,
    filters.subcategory,
    filters.childCategory,
    filters.flags,
    filters.isActive,
    filters.stock,
  ]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  useEffect(() => {
    fetchChildCategories();
  }, [fetchChildCategories]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  useEffect(() => {
    fetchProductsAdmin(filters);
  }, [filters, fetchProductsAdmin]);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(
          `${apiUrl}/getAllProductsAdmin?page=1&limit=1`,
        );
        setAllProductsCount(response.data.totalProducts || 0);
      } catch (err) {
        console.error('Failed to fetch total count', err);
      }
    };
    fetchTotalCount();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      [...products].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    );
  }, [products]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }, []);

  const handleCategoryFilterChange = (value) => {
    handleFilterChange('category', value);
    handleFilterChange('subcategory', '');
    handleFilterChange('childCategory', '');
  };

  const handleSubCategoryFilterChange = (value) => {
    handleFilterChange('subcategory', value);
    handleFilterChange('childCategory', '');
  };

  const selectedCategoryId = categories.find(
    (category) => category.name === filters.category,
  )?._id;

  const filteredSubCategories = subCategories.filter(
    (subCategory) =>
      !selectedCategoryId || subCategory.category?._id === selectedCategoryId,
  );

  const selectedSubCategoryId = filteredSubCategories.find(
    (subCategory) => subCategory.slug === filters.subcategory,
  )?._id;

  const filteredChildCategories = childCategories.filter((childCategory) => {
    if (selectedSubCategoryId) {
      return childCategory.subCategory?._id === selectedSubCategoryId;
    }
    if (selectedCategoryId) {
      return childCategory.category?._id === selectedCategoryId;
    }
    return true;
  });

  const handleSearch = () => {
    handleFilterChange('search', searchQuery.trim());
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    handleFilterChange('search', '');
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenDialog = (id) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      toast.success(`Product ID ${selectedProductId} deleted successfully!`);
      fetchProductsAdmin(filters);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateProduct(id);
      toast.success('Product duplicated successfully!');
      fetchProductsAdmin(filters);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to duplicate product.',
      );
    }
  };

  const startItem =
    totalProductsAdmin > 0 ? (currentPage - 1) * filters.limit + 1 : 0;
  const endItem = Math.min(
    currentPage * filters.limit,
    (currentPage - 1) * filters.limit + filteredProducts.length,
  );

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive/50">
          <CardContent className="py-4">
            <p className="text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title={'All Products'} />
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate('/admin/addnewproduct')}
        >
          + Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-md border-0 border-l-4 border-l-[#00395d]">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-[#00395d]">
              {allProductsCount}
            </p>
            <p className="text-sm text-muted-foreground">All Products</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0 border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0 border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-red-600">{inactiveCount}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-3 space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-36 bg-background"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearSearch}
                className="h-7 px-3"
              >
                Clear
              </Button>
            )}
            <Button size="sm" onClick={handleSearch} className="h-7 px-3">
              Search
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          <SearchableSelect
            value={filters.brand}
            onValueChange={(value) => handleFilterChange('brand', value)}
            placeholder="All brands"
            searchPlaceholder="Search brands..."
            options={brands.map((brand) => ({
              value: brand.name,
              label: brand.name,
            }))}
            triggerClassName="w-full h-8 bg-background"
          />
          <Select
            value={filters.category}
            onValueChange={handleCategoryFilterChange}
          >
            <SelectTrigger className="w-full h-8 bg-background">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.subcategory}
            onValueChange={handleSubCategoryFilterChange}
          >
            <SelectTrigger className="w-full h-8 bg-background">
              <SelectValue placeholder="All subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All subcategories</SelectItem>
              {filteredSubCategories.map((subCategory) => (
                <SelectItem key={subCategory._id} value={subCategory.slug}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.childCategory}
            onValueChange={(value) =>
              handleFilterChange('childCategory', value)
            }
          >
            <SelectTrigger className="w-full h-8 bg-background">
              <SelectValue placeholder="All child categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All child categories</SelectItem>
              {filteredChildCategories.map((childCategory) => (
                <SelectItem key={childCategory._id} value={childCategory.slug}>
                  {childCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.flags}
            onValueChange={(value) => handleFilterChange('flags', value)}
          >
            <SelectTrigger className="w-full h-8 bg-background">
              <SelectValue placeholder="All flags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All flags</SelectItem>
              {flags.map((flag) => (
                <SelectItem key={flag._id} value={flag.name}>
                  {flag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.isActive}
            onValueChange={(value) => handleFilterChange('isActive', value)}
          >
            <SelectTrigger className="w-full h-8 bg-background">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.stock}
            onValueChange={(value) => handleFilterChange('stock', value)}
          >
            <SelectTrigger className="w-full h-8 bg-background">
              <SelectValue placeholder="All stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All stock</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-center gap-2">
            <span className="hidden md:inline text-sm text-muted-foreground">
              Show
            </span>
            <div className="flex-1 min-w-0">
              <Select
                value={String(filters.limit)}
                onValueChange={(value) =>
                  handleFilterChange('limit', Number(value))
                }
              >
                <SelectTrigger className="w-full h-8 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">
              entries
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-md border-0">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-muted-foreground/10">
            <div>
              <h3 className="text-lg font-semibold">All Products</h3>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead className="hidden md:table-cell">Flags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(filters.limit)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-12 w-12 rounded-lg" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-28" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center text-muted-foreground py-8"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm text-muted-foreground">
                        #{product.productId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <ImageComponent
                        imageName={product?.thumbnailImage}
                        altName={product?.name}
                        skeletonHeight={30}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                    </TableCell>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category?.name || 'No Category'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {product.brand?.name || 'No Brand'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.variants?.length ? (
                        <div>
                          <p className="font-semibold">
                            ৳
                            {product.variants.length > 0
                              ? Math.min(
                                  ...product.variants.map((v) => v.price),
                                )
                              : 0}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.variants.length} var.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold">
                            ৳
                            {product.finalDiscount > 0
                              ? product.finalDiscount
                              : product.finalPrice}
                          </p>
                          {product.finalDiscount > 0 &&
                            product.finalPrice > 0 && (
                              <p className="text-xs text-destructive line-through">
                                ৳{product.finalPrice}
                              </p>
                            )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            product.finalStock > 0
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {product.finalStock > 0
                            ? `${product.finalStock} in stock`
                            : 'Out of stock'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {product.flags?.length ? (
                          product.flags.map((flag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {flag?.name ?? ''}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No Flag
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? 'default' : 'secondary'}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-xs" asChild>
                              <a
                                href={`/product/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="size-3.5" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Product</TooltipContent>
                        </Tooltip>
                        <RequirePermission
                          permission="edit_products"
                          fallback={true}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon-xs" asChild>
                                <Link
                                  to={`/admin/edit-product/${product.slug}`}
                                >
                                  <Pencil className="size-3.5" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Product</TooltipContent>
                          </Tooltip>
                        </RequirePermission>
                        <RequirePermission
                          permission="add_products"
                          fallback={true}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => handleDuplicate(product._id)}
                              >
                                <Copy className="size-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicate</TooltipContent>
                          </Tooltip>
                        </RequirePermission>
                        <RequirePermission
                          permission="delete_products"
                          fallback={true}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => handleOpenDialog(product._id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </RequirePermission>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalProductsAdmin} products
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {(() => {
              const pages = [];
              const delta = 1;
              const left = Math.max(2, currentPage - delta);
              const right = Math.min(totalPages - 1, currentPage + delta);
              pages.push(1);
              if (left > 2) pages.push('...');
              for (let i = left; i <= right; i++) pages.push(i);
              if (right < totalPages - 1) pages.push('...');
              if (totalPages > 1) pages.push(totalPages);
              return pages.map((p, i) =>
                p === '...' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === currentPage ? 'default' : 'ghost'}
                    size="sm"
                    className="min-w-9"
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                ),
              );
            })()}
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewAllProducts;
