import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OrderProgress from './OrderProgress';
import ImageComponent from './ImageComponent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Search,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Truck,
  ArrowRight,
  AlertCircle,
  User,
  Hash,
  Receipt,
  ShoppingBag,
} from 'lucide-react';
import sanitizeHtml from '../../utils/sanitizeHtml.js';

const TrackOrder = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = `${apiUrl.replace('/api', '')}/uploads`;
  const [orderNo, setOrderNo] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const getVariantDisplayName = (variant) => {
    if (!variant) return 'N/A';
    if (variant.attributes && Array.isArray(variant.attributes)) {
      const attributeValues = variant.attributes
        .map((attr) => attr.value)
        .filter((val) => val);
      if (attributeValues.length > 0) {
        return attributeValues.join(' / ');
      }
    }
    if (variant.size?.name) {
      return variant.size.name;
    }
    if (variant.sizeName) {
      return variant.sizeName;
    }
    return 'N/A';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`${apiUrl}/track-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNo, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to track order');
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const n = Number(price);
    if (isNaN(n)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(n);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto w-14 h-14 primaryBgColor rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-[var(--primaryColor)]/20">
            <Truck className="size-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Track Your Order
          </h1>
          <p className="text-base text-gray-500 max-w-md mx-auto">
            Enter your order number and phone number to track your shipment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="orderNo">Order Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="orderNo"
                    type="text"
                    required
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    placeholder="e.g., #123456"
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., 01XXXXXXXXX"
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full md:w-auto px-8 h-11 rounded-xl cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin size-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Tracking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="size-4" />
                    Track Order
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-5 max-w-2xl mx-auto flex gap-4"
            role="alert"
          >
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800 text-sm">
                Order Not Found
              </h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 border-l-4 border-l-[var(--primaryColor)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Order Number
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1.5">
                    #{order.orderNo}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Order Status
                  </p>
                  <span className="inline-block mt-1.5 primaryBgColor text-white text-sm font-semibold px-4 py-1.5 rounded-lg capitalize">
                    {order.status || order.orderStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Order Date
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1.5">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Shipment Status
              </h2>
              <OrderProgress status={order.status || order.orderStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <User className="size-5 text-[var(--primaryColor)]" />
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Full Name
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {order.shippingInfo?.fullName || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Email Address
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1 break-all">
                        {order.shippingInfo?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Phone Number
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {order.shippingInfo?.mobileNo || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <MapPin className="size-5 text-[var(--primaryColor)]" />
                  Shipping Address
                </h2>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {order.shippingInfo?.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingInfo?.address || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingInfo?.city}
                    {order.shippingInfo?.state &&
                      `, ${order.shippingInfo.state}`}
                    {order.shippingInfo?.postalCode &&
                      `, ${order.shippingInfo.postalCode}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingInfo?.country || 'Bangladesh'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Receipt className="size-5 text-[var(--primaryColor)]" />
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex justify-between items-start text-sm py-2"
                  >
                    <div>
                      <p className="text-gray-900 font-medium">
                        {item.productId?.name}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        Qty: {item.quantity}
                        {item.variantId && (
                          <span className="ml-2">
                            •{' '}
                            {getVariantDisplayName(
                              item.productId?.variants?.find(
                                (v) => v._id === item.variantId,
                              ),
                            )}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-gray-900 font-semibold ml-2 whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-gray-900 font-semibold">
                    {formatPrice(
                      order.totalAmount - (order.deliveryCharge || 0),
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-gray-900 font-semibold">
                    {formatPrice(order.deliveryCharge || 0)}
                  </span>
                </div>

                {order.promoCode && (
                  <div className="flex justify-between text-sm bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                    <span className="text-gray-600">
                      Promo Code ({order.promoCode})
                    </span>
                    <span className="text-green-600 font-semibold">
                      -{formatPrice(order.discount || 0)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                <ShoppingBag className="size-5 text-[var(--primaryColor)]" />
                Order Items
              </h2>
              <div className="space-y-6">
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      {item.productId?.thumbnailImage ? (
                        <img
                          src={`${imageUrl}/${item.productId.thumbnailImage}`}
                          alt={item.productId?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-bold mb-1">
                        {item.productId?.name}
                      </h3>
                      {item.productId?.shortDesc && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(
                                item.productId.shortDesc.substring(0, 100),
                              ),
                            }}
                          />
                        </p>
                      )}

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        {item.variantId && (
                          <span>
                            <span className="text-muted-foreground">
                              Variant:{' '}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {getVariantDisplayName(
                                item.productId?.variants?.find(
                                  (v) => v._id === item.variantId,
                                ),
                              )}
                            </span>
                          </span>
                        )}
                        <span>
                          <span className="text-muted-foreground">
                            Qty:{' '}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                        </span>
                        <span>
                          <span className="text-muted-foreground">
                            Price:{' '}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        Item Total
                      </p>
                      <p className="text-lg font-bold text-[var(--primaryColor)]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="size-5 text-[var(--primaryColor)]" />
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--primaryColor)]/5 rounded-xl p-5 border border-[var(--primaryColor)]/10">
                  <p className="text-xs text-muted-foreground font-medium mb-1.5">
                    Delivery Type
                  </p>
                  <p className="text-gray-900 font-bold capitalize">
                    {order.deliveryType || 'Home Delivery'}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <p className="text-xs text-muted-foreground font-medium mb-1.5">
                    Delivery Charge
                  </p>
                  <p className="text-green-600 font-bold">
                    {formatPrice(order.deliveryCharge || 0)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                  <p className="text-xs text-muted-foreground font-medium mb-1.5">
                    Total Items
                  </p>
                  <p className="text-purple-600 font-bold">
                    {order.items?.length || 0} items
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
