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
          active ? 'border-cyan-400' : 'border-slate-700'
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
    <section className="min-h-screen bg-[#0A0E14] py-10 font-mono text-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Header / Status Panel ───────────────────────────── */}
        <div className="relative border border-slate-800 bg-[#0F141B] p-6 sm:p-8">
          <CornerBrackets active={buildComplete} />
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                Configuration Console
              </span>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                PC Builder
              </h1>
              <p className="mt-2 max-w-md text-base leading-relaxed text-slate-400">
                Assemble a compatible rig, slot by slot — pick your core
                hardware first, then round it out with peripherals.
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
              <div className="border border-slate-800 bg-[#0A0E14] px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-slate-500">
                  Items
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {totalItems}
                </p>
              </div>
              <div className="border border-cyan-900 bg-cyan-950/20 px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-cyan-500">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold text-cyan-400">
                  ৳{formatPrice(totalPrice)}
                </p>
              </div>
              {totalItems > 0 && (
                <button
                  onClick={clearBuild}
                  className="flex items-center gap-2 self-stretch border border-slate-800 px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:border-red-800 hover:text-red-400"
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
              <span className="uppercase tracking-widest text-slate-400">
                Required Components&nbsp;
                <span className="text-white">
                  {filledRequired}/{requiredSlots.length}
                </span>
              </span>
              {buildComplete && (
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
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
                    i < filledRequired ? 'bg-cyan-400' : 'bg-slate-800'
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
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                  {group}
                </h2>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="space-y-3">
                {slots.map((slot) => {
                  const selected = getSelectedForSlot(slot.name);
                  const Icon = slot.icon;
                  return (
                    <div
                      key={slot.name}
                      className={`group relative border bg-[#0F141B] transition-colors duration-200 ${
                        selected
                          ? 'border-cyan-800/70'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <CornerBrackets active={!!selected} />
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-5">
                        <div
                          className={`flex size-14 shrink-0 items-center justify-center border ${
                            selected
                              ? 'border-cyan-800 bg-cyan-950/30'
                              : 'border-slate-800 bg-[#0A0E14]'
                          }`}
                        >
                          <Icon
                            className={`size-6 ${selected ? 'text-cyan-400' : 'text-slate-500'}`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-lg font-semibold text-white">
                              {slot.name}
                            </span>
                            {slot.required ? (
                              <span className="border border-amber-900 bg-amber-950/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                                Required
                              </span>
                            ) : (
                              <span className="border border-slate-800 bg-slate-900/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Optional
                              </span>
                            )}
                          </div>

                          {selected ? (
                            <div className="mt-3 flex items-center gap-3">
                              <div className="size-11 shrink-0 overflow-hidden border border-slate-800 bg-white/5">
                                <ImageComponent
                                  imageName={selected.thumbnailImage}
                                  className="h-full w-full object-contain"
                                  altName={selected.name}
                                  skeletonHeight={44}
                                />
                              </div>
                              <Link
                                to={`/product/${selected.slug}`}
                                className="truncate text-base text-slate-300 transition-colors hover:text-cyan-400"
                              >
                                {selected.name}
                              </Link>
                            </div>
                          ) : (
                            <p className="mt-1.5 text-sm text-slate-500">
                              No component selected yet
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-3 sm:justify-end">
                          {selected ? (
                            <>
                              <span className="text-xl font-bold text-cyan-400">
                                ৳{formatPrice(selected.finalPrice)}
                              </span>
                              {slot.link && (
                                <Link
                                  to={slot.link}
                                  className="border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-700 hover:text-cyan-400"
                                >
                                  Change
                                </Link>
                              )}
                              <button
                                onClick={() => removeItem(selected._id)}
                                className="border border-slate-800 p-2 text-slate-500 transition-colors hover:border-red-800 hover:text-red-400"
                                title="Remove"
                              >
                                <X className="size-5" />
                              </button>
                            </>
                          ) : (
                            <Link
                              to={slot.link}
                              className="flex items-center gap-2 border border-cyan-800 bg-cyan-950/20 px-4 py-2.5 text-base font-semibold text-cyan-400 transition-colors hover:bg-cyan-900/30"
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
          <div className="mt-12 border-t border-slate-800 pt-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 text-xl font-bold text-white">
                <ShoppingCart className="size-6 text-cyan-400" />
                Your Build
                <span className="text-base font-normal text-slate-500">
                  ({build.length} items)
                </span>
              </h2>
              <span className="text-2xl font-bold text-cyan-400">
                ৳{formatPrice(totalPrice)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {build.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 border border-slate-800 bg-[#0F141B] px-4 py-3"
                >
                  <div className="size-12 shrink-0 overflow-hidden border border-slate-800 bg-white/5">
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
                      className="block truncate text-base font-medium text-slate-200 transition-colors hover:text-cyan-400"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-slate-500">{item.category}</p>
                  </div>
                  <p className="shrink-0 text-base font-bold text-cyan-400">
                    ৳{formatPrice(item.finalPrice)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="shrink-0 text-slate-600 transition-colors hover:text-red-400"
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
