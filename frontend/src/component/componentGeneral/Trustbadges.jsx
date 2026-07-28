import { Truck, RotateCcw, ShieldCheck, BadgeCheck } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    subtitle: 'Free delivery over ৳ 5000',
  },
  { icon: RotateCcw, title: 'Free Returns', subtitle: 'Hassle free returns' },
  {
    icon: ShieldCheck,
    title: 'Secure Shopping',
    subtitle: 'Best security features',
  },
  {
    icon: BadgeCheck,
    title: 'Genuine Product',
    subtitle: '100% brand original products',
  },
];

export default function TrustBadges() {
  return (
    <div className="w-full secondaryBgColor">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden">
        {badges.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="group relative secondaryBgColor px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-3"
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-8 transition-all duration-300 ease-out"
              style={{ backgroundColor: 'var(--primaryColor)' }}
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold tertiaryTextColor tracking-wide">
                {title}
              </p>
              <p className="text-[11px] text-slate-100 mt-0.5 leading-snug">
                {subtitle}
              </p>
            </div>
            <div
              className="md:w-15 md:h-15 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--primaryColor) 15%, white)',
              }}
            >
              <Icon
                className="md:w-10 md:h-10"
                style={{ color: 'var(--primaryColor)' }}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
