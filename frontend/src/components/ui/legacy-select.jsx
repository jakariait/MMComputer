import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

function LegacySelect({
  className,
  value,
  onChange,
  name,
  displayEmpty,
  renderValue,
  children,
  variant,
  size,
  label,
  fullWidth,
  ...props
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const options = React.Children.toArray(children)
    .filter(Boolean)
    .map((child) => {
      const childName = child.type?.displayName || child.type?.name;
      if (childName === 'MenuItem') {
        return {
          value: child.props.value ?? '',
          label: child.props.children,
          disabled: child.props.disabled,
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="relative w-full">
      <select
        data-slot="legacy-select"
        name={name}
        value={value ?? ''}
        onChange={handleChange}
        className={cn(
          'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-xs transition-[color,box-shadow] outline-none appearance-none cursor-pointer',
          'focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {typeof opt.label === 'string' ? opt.label : opt.value || 'Select...'}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
}

LegacySelect.displayName = 'LegacySelect';

export { LegacySelect as Select };
