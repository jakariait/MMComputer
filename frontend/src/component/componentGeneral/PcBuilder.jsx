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
  CheckCircle2,
} from 'lucide-react';
import ImageComponent from './ImageComponent.jsx';

const COMPONENT_SLOTS = [
  {
    name: 'Processor',
    icon: Cpu,
    required: true,
    group: 'Core Components',
    slug: 'processor-6a64c8f287d012817ce92934',
    link: '/pc-builder/category/Processor?slug=processor-6a64c8f287d012817ce92934&core=1',
  },
  {
    name: 'CPU Cooler',
    icon: Wind,
    required: true,
    group: 'Core Components',
    slug: 'cpu-cooler-6a64c8f087d012817ce9291c',
    link: '/pc-builder/category/CPU%20Cooler?slug=cpu-cooler-6a64c8f087d012817ce9291c&core=1',
  },
  {
    name: 'Motherboard',
    icon: CircuitBoard,
    required: true,
    group: 'Core Components',
    slug: 'motherboard-6a64c8f187d012817ce9292e',
    link: '/pc-builder/category/Motherboard?slug=motherboard-6a64c8f187d012817ce9292e&core=1',
  },
  {
    name: 'RAM (Desktop)',
    icon: Server,
    required: true,
    group: 'Core Components',
    slug: 'ram-%28desktop%29-6a64c8f287d012817ce92937',
    link: '/pc-builder/category/RAM%20(Desktop)?slug=ram-%28desktop%29-6a64c8f287d012817ce92937&core=1',
  },
  {
    name: 'Graphics Card',
    icon: Monitor,
    required: true,
    group: 'Core Components',
    slug: 'graphics-card-6a64c8f187d012817ce92922',
    link: '/pc-builder/category/Graphics%20Card?slug=graphics-card-6a64c8f187d012817ce92922&core=1',
  },
  {
    name: 'Power Supply',
    icon: Zap,
    required: true,
    group: 'Core Components',
    slug: 'power-supply-6a64c8f187d012817ce92931',
    link: '/pc-builder/category/Power%20Supply?slug=power-supply-6a64c8f187d012817ce92931&core=1',
  },
  {
    name: 'SSD',
    icon: HardDrive,
    required: true,
    group: 'Core Components',
    slug: 'ssd-6a64c8f287d012817ce9293a',
    link: '/pc-builder/category/SSD?slug=ssd-6a64c8f287d012817ce9293a&core=1',
  },
  {
    name: 'Hard Disk Drive',
    icon: HardDrive,
    required: true,
    group: 'Core Components',
    slug: 'hard-disk-drive-6a64c8f187d012817ce9291f',
    link: '/pc-builder/category/Hard%20Disk%20Drive?slug=hard-disk-drive-6a64c8f187d012817ce9291f&core=1',
  },
  {
    name: 'Casing',
    icon: Box,
    required: true,
    group: 'Core Components',
    slug: 'casing-6a64c8f187d012817ce92925',
    link: '/pc-builder/category/Casing?slug=casing-6a64c8f187d012817ce92925&core=1',
  },
  {
    name: 'Casing Fan',
    icon: Fan,
    required: false,
    group: 'Peripherals & Others',
    slug: 'casing-fan-6a64c8f087d012817ce92919',
    link: '/pc-builder/category/Casing%20Fan?slug=casing-fan-6a64c8f087d012817ce92919&core=1',
  },
  {
    name: 'Monitor',
    icon: Monitor,
    required: false,
    group: 'Peripherals & Others',
    slug: 'monitor',
    link: '/pc-builder/category/Monitor?category=Monitor&core=1',
  },
  {
    name: 'Keyboard',
    icon: Keyboard,
    required: false,
    group: 'Peripherals & Others',
    slug: 'keyboard',
    link: '/pc-builder/category/Keyboard?slug=keyboard-19&core=1',
  },
  {
    name: 'Mouse',
    icon: Mouse,
    required: false,
    group: 'Peripherals & Others',
    slug: 'mouse',
    link: '/pc-builder/category/Mouse?slug=mouse-18&core=1',
  },
  {
    name: 'Speaker',
    icon: Speaker,
    required: false,
    group: 'Peripherals & Others',
    slug: 'speaker',
    link: '/pc-builder/category/Speaker?slug=speaker-andamp-home-theater-23&core=1',
  },
  {
    name: 'Headphone',
    icon: Headphones,
    required: false,
    group: 'Peripherals & Others',
    slug: 'headphone',
    link: '/pc-builder/category/Headphone?slug=headphone-20&core=1',
  },
  {
    name: 'UPS',
    icon: BatteryCharging,
    required: false,
    group: 'Peripherals & Others',
    slug: 'ups',
    link: '/pc-builder/category/UPS?slug=ups-106&core=1',
  },
];

const GROUPS = ['Core Components', 'Peripherals & Others'];

const formatPrice = (price) => {
  if (isNaN(price)) return price;
  return Number(price).toLocaleString();
};

// Corner-bracket motif — the recurring MM Computer signature, drawn as four
// absolutely-positioned L-shapes so it can wrap any panel without touching layout.
const CornerBrackets = ({ active }) => (
  <>
    {[
      'top-0 left-0',
      'top-0 right-0 rotate-90',
      'bottom-0 right-0 rotate-180',
      'bottom-0 left-0 -rotate-90',
    ].map((pos, i) => (
      <span
        key={i}
        aria-hidden="true"
        className={`pointer-events-none absolute ${pos} h-3 w-3 border-t-2 border-l-2 transition-colors duration-200 ${
          active ? 'primaryBorderColor' : 'border-gray-300'
        }`}
      />
    ))}
  </>
);

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
    (sum, item) => sum + (Number(item.finalPrice) || 0),
    0,
  );

  const getSelectedForSlot = (slotName) =>
    build.find((item) => item.category === slotName);

  const totalItems = build.length;
  const requiredSlots = COMPONENT_SLOTS.filter((s) => s.required);
  const filledRequired = requiredSlots.filter((s) =>
    getSelectedForSlot(s.name),
  ).length;
  const buildComplete = filledRequired === requiredSlots.length;

  return (
    <section className="min-h-screen bg-gray-50 py-10 font-mono text-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Header / Status Panel ───────────────────────────── */}
        <div className="relative border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <CornerBrackets active={buildComplete} />
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.25em] primaryTextColor">
                Configuration Console
              </span>
              <h1 className="mt-2 text-3xl font-bold tracking-tight secondaryTextColor sm:text-4xl">
                PC Builder
              </h1>
              <p className="mt-2 max-w-md text-base leading-relaxed text-gray-500">
                Assemble a compatible rig, slot by slot — pick your core
                hardware first, then round it out with peripherals.
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
              <div className="border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-gray-400">
                  Items
                </p>
                <p className="mt-1 text-2xl font-bold secondaryTextColor">
                  {totalItems}
                </p>
              </div>
              <div className="border border-[var(--primaryColor)]/30 bg-[var(--primaryColor)]/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest primaryTextColor">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold primaryTextColor">
                  ৳{formatPrice(totalPrice)}
                </p>
              </div>
              {totalItems > 0 && (
                <button
                  onClick={clearBuild}
                  className="flex items-center gap-2 self-stretch border border-gray-200 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-red-300 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Progress trace */}
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="uppercase tracking-widest text-gray-500">
                Required Components&nbsp;
                <span className="secondaryTextColor">
                  {filledRequired}/{requiredSlots.length}
                </span>
              </span>
              {buildComplete && (
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                  <CheckCircle2 className="size-4" />
                  Build Complete
                </span>
              )}
            </div>
            <div className="flex h-2 gap-1">
              {requiredSlots.map((s, i) => (
                <div
                  key={s.name}
                  className={`flex-1 transition-colors duration-300 ${
                    i < filledRequired ? 'primaryBgColor' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Slot Groups ──────────────────────────────────────── */}
        {GROUPS.map((group) => {
          const slots = COMPONENT_SLOTS.filter((s) => s.group === group);
          return (
            <div key={group} className="mt-10">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-bold uppercase tracking-wider secondaryTextColor">
                  {group}
                </h2>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-3">
                {slots.map((slot) => {
                  const selected = getSelectedForSlot(slot.name);
                  const Icon = slot.icon;
                  return (
                    <div
                      key={slot.name}
                      className={`group relative border bg-white transition-colors duration-200 ${
                        selected
                          ? 'primaryBorderColor shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CornerBrackets active={!!selected} />
                      <div className="flex flex-row flex-wrap items-start gap-4 p-4 sm:flex-nowrap sm:items-center sm:gap-5 sm:px-6 py-2">
                        <div
                          className={`flex size-14 shrink-0 items-center justify-center border ${
                            selected
                              ? 'border-[var(--primaryColor)]/40 bg-[var(--primaryColor)]/10'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <Icon
                            className={`size-6 ${selected ? 'primaryTextColor' : 'text-gray-400'}`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-lg font-semibold secondaryTextColor">
                              {slot.name}
                            </span>
                            {slot.required ? (
                              <span className="border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                                Required
                              </span>
                            ) : (
                              <span className="border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                Optional
                              </span>
                            )}
                          </div>

                          {selected ? (
                            <div className="mt-3 flex items-center gap-3">
                              <div className="size-11 shrink-0 overflow-hidden border border-gray-200 bg-gray-50">
                                <ImageComponent
                                  imageName={selected.thumbnailImage}
                                  className="h-full w-full object-contain"
                                  altName={selected.name}
                                  skeletonHeight={44}
                                />
                              </div>
                              <Link
                                to={`/product/${selected.slug}`}
                                className="truncate text-base text-gray-600 transition-colors hover:primaryTextColor"
                              >
                                {selected.name}
                              </Link>
                            </div>
                          ) : (
                            <p className="mt-1.5 text-sm text-gray-400">
                              No component selected yet
                            </p>
                          )}
                        </div>

                        <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto sm:justify-end">
                          {selected ? (
                            <>
                              <span className="text-xl font-bold primaryTextColor">
                                ৳{formatPrice(selected.finalPrice)}
                              </span>
                              {slot.link && (
                                <Link
                                  to={slot.link}
                                  className="border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-[var(--primaryColor)] hover:primaryTextColor"
                                >
                                  Change
                                </Link>
                              )}
                              <button
                                onClick={() => removeItem(selected._id)}
                                className="border border-gray-200 p-2 text-gray-400 transition-colors hover:border-red-300 hover:text-red-500"
                                title="Remove"
                              >
                                <X className="size-5" />
                              </button>
                            </>
                          ) : (
                            <Link
                              to={slot.link}
                              className="flex items-center gap-2 border primaryBorderColor primaryBgColor px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[var(--primaryColor)]/90"
                            >
                              <Plus className="size-4" />
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

        {/* ── Build Summary ────────────────────────────────────── */}
        {build.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 text-xl font-bold secondaryTextColor">
                <ShoppingCart className="size-6 primaryTextColor" />
                Your Build
                <span className="text-base font-normal text-gray-400">
                  ({build.length} items)
                </span>
              </h2>
              <span className="text-2xl font-bold primaryTextColor">
                ৳{formatPrice(totalPrice)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {build.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 border border-gray-200 bg-white px-4 py-3"
                >
                  <div className="size-12 shrink-0 overflow-hidden border border-gray-200 bg-gray-50">
                    <ImageComponent
                      imageName={item.thumbnailImage}
                      className="h-full w-full object-contain"
                      altName={item.name}
                      skeletonHeight={48}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.slug}`}
                      className="block truncate text-base font-medium text-gray-800 transition-colors hover:primaryTextColor"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-400">{item.category}</p>
                  </div>
                  <p className="shrink-0 text-base font-bold primaryTextColor">
                    ৳{formatPrice(item.finalPrice)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="shrink-0 text-gray-400 transition-colors hover:text-red-500"
                  >
                    <Trash2 className="size-5" />
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
