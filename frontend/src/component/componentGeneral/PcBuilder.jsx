import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  Server,
  Wind,
  Fan,
  CircuitBoard,
  ShoppingCart,
  Trash2,
  Plus,
  Keyboard,
  Mouse,
  Speaker,
  Headphones,
  BatteryCharging,
  X,
  Box,
} from 'lucide-react';
import ImageComponent from './ImageComponent.jsx';

const COMPONENT_SLOTS = [
  { name: 'Processor', icon: Cpu, required: true, group: 'Core Components', link: '/shop?subcategory=processor-6a64c8f287d012817ce92934' },
  { name: 'CPU Cooler', icon: Wind, required: true, group: 'Core Components', link: '/shop?subcategory=cpu-cooler-6a64c8f087d012817ce9291c' },
  { name: 'Motherboard', icon: CircuitBoard, required: true, group: 'Core Components', link: '/shop?subcategory=motherboard-6a64c8f187d012817ce9292e' },
  { name: 'RAM (Desktop)', icon: Server, required: true, group: 'Core Components', link: '/shop?subcategory=ram-%28desktop%29-6a64c8f287d012817ce92937' },
  { name: 'Graphics Card', icon: Monitor, required: true, group: 'Core Components', link: '/shop?subcategory=graphics-card-6a64c8f187d012817ce92922' },
  { name: 'Power Supply', icon: Zap, required: true, group: 'Core Components', link: '/shop?subcategory=power-supply-6a64c8f187d012817ce92931' },
  { name: 'SSD', icon: HardDrive, required: true, group: 'Core Components', link: '/shop?subcategory=ssd-6a64c8f287d012817ce9293a' },
  { name: 'Hard Disk Drive', icon: HardDrive, required: true, group: 'Core Components', link: '/shop?subcategory=hard-disk-drive-6a64c8f187d012817ce9291f' },
  { name: 'Casing', icon: Box, required: true, group: 'Core Components', link: '/shop?subcategory=casing-6a64c8f187d012817ce92925' },
  { name: 'Casing Fan', icon: Fan, required: false, group: 'Peripherals & Others', link: '/shop?subcategory=casing-fan-6a64c8f087d012817ce92919' },
  { name: 'Monitor', icon: Monitor, required: false, group: 'Peripherals & Others', link: '/pc-builder/category/Monitor' },
  { name: 'Keyboard', icon: Keyboard, required: false, group: 'Peripherals & Others', link: '/pc-builder/category/Keyboard' },
  { name: 'Mouse', icon: Mouse, required: false, group: 'Peripherals & Others', link: '/pc-builder/category/Mouse' },
  { name: 'Speaker', icon: Speaker, required: false, group: 'Peripherals & Others', link: '/pc-builder/category/Speaker' },
  { name: 'Headphone', icon: Headphones, required: false, group: 'Peripherals & Others', link: '/pc-builder/category/Headphone' },
  { name: 'UPS', icon: BatteryCharging, required: false, group: 'Peripherals & Others', link: '/pc-builder/category/UPS' },
];

const GROUPS = ['Core Components', 'Peripherals & Others'];

const formatPrice = (price) => {
  if (isNaN(price)) return price;
  return Number(price).toLocaleString();
};

const PcBuilder = () => {
  const [build, setBuild] = useState([]);

  const loadBuild = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('pcBuild') || '[]');
      setBuild(saved);
    } catch {
      setBuild([]);
    }
  };

  useEffect(() => {
    loadBuild();
    window.addEventListener('focus', loadBuild);
    return () => window.removeEventListener('focus', loadBuild);
  }, []);

  const removeItem = (id) => {
    const updated = build.filter((item) => item._id !== id);
    setBuild(updated);
    localStorage.setItem('pcBuild', JSON.stringify(updated));
  };

  const clearBuild = () => {
    setBuild([]);
    localStorage.setItem('pcBuild', '[]');
  };

  const totalPrice = build.reduce(
    (sum, item) => sum + (Number(item.finalPrice) || 0), 0
  );

  const getSelectedForSlot = (slotName) =>
    build.find((item) => item.category === slotName);

  const totalItems = build.length;
  const requiredSlots = COMPONENT_SLOTS.filter((s) => s.required);
  const filledRequired = requiredSlots.filter((s) => getSelectedForSlot(s.name)).length;

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="xl:container xl:mx-auto px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] md:text-[34px] font-semibold text-gray-800 leading-tight tracking-tight">
                PC Builder
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Build your custom PC by selecting components below.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Items:</span>{' '}
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total:</span>{' '}
                <span className="font-semibold text-[var(--primaryColor)]">
                  ৳{formatPrice(totalPrice)}
                </span>
              </div>
              {totalItems > 0 && (
                <button
                  onClick={clearBuild}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="size-4" />
                  Clear Build
                </button>
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
              <span>
                Required Components: {filledRequired}/{requiredSlots.length} selected
              </span>
              {filledRequired === requiredSlots.length && (
                <span className="text-green-600 font-medium">Complete</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-[var(--primaryColor)] h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(filledRequired / requiredSlots.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {GROUPS.map((group) => {
          const slots = COMPONENT_SLOTS.filter((s) => s.group === group);
          return (
            <div key={group} className="mb-8">
              <h2 className="text-base font-semibold text-gray-800 mb-3 px-1">
                {group}
              </h2>
              <div className="space-y-2">
                {slots.map((slot) => {
                  const selected = getSelectedForSlot(slot.name);
                  const Icon = slot.icon;
                  return (
                    <div
                      key={slot.name}
                      className={`bg-white rounded-lg border transition-colors ${
                        selected
                          ? 'border-[var(--primaryColor)] ring-1 ring-[var(--primaryColor)]/20'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 p-3 sm:px-4 sm:py-3">
                        <div className="size-10 shrink-0 rounded-lg bg-[var(--primaryColor)]/10 flex items-center justify-center">
                          <Icon className="size-5 text-[var(--primaryColor)]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              {slot.name}
                            </span>
                            {slot.required ? (
                              <span className="text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                Required
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                Optional
                              </span>
                            )}
                          </div>
                          {selected && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="size-7 shrink-0 overflow-hidden rounded bg-gray-50">
                                <ImageComponent
                                  imageName={selected.thumbnailImage}
                                  className="w-full h-full object-contain"
                                  altName={selected.name}
                                  skeletonHeight={28}
                                />
                              </div>
                              <Link
                                to={`/product/${selected.slug}`}
                                className="text-xs text-gray-600 truncate hover:text-[var(--primaryColor)] max-w-[180px] sm:max-w-[300px]"
                              >
                                {selected.name}
                              </Link>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {selected ? (
                            <>
                              <span className="text-sm font-semibold text-[var(--primaryColor)]">
                                ৳{formatPrice(selected.finalPrice)}
                              </span>
                              <Link
                                to={slot.link}
                                className="text-xs text-[var(--primaryColor)] hover:underline font-medium"
                              >
                                Change
                              </Link>
                              <button
                                onClick={() => removeItem(selected._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Remove"
                              >
                                <X className="size-4" />
                              </button>
                            </>
                          ) : (
                            <Link
                              to={slot.link}
                              className="flex items-center gap-1 text-sm font-medium text-[var(--primaryColor)] bg-[var(--primaryColor)]/10 hover:bg-[var(--primaryColor)]/20 transition-colors rounded-md px-3 py-1.5"
                            >
                              <Plus className="size-3.5" />
                              Choose
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {build.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="size-5 text-[var(--primaryColor)]" />
                Your Build ({build.length} items)
              </h2>
              <span className="text-lg font-bold text-[var(--primaryColor)]">
                ৳{formatPrice(totalPrice)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {build.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-white rounded-md border border-gray-200 px-3 py-2"
                >
                  <div className="size-10 shrink-0 overflow-hidden rounded bg-gray-50">
                    <ImageComponent
                      imageName={item.thumbnailImage}
                      className="w-full h-full object-contain"
                      altName={item.name}
                      skeletonHeight={40}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-sm font-medium text-gray-800 truncate hover:text-[var(--primaryColor)] block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--primaryColor)] shrink-0">
                    ৳{formatPrice(item.finalPrice)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PcBuilder;
