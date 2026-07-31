import { cn } from '@/lib/utils';

function FormControl({
  className,
  fullWidth,
  error,
  disabled,
  margin,
  size,
  variant,
  children,
  ...props
}) {
  return (
    <div
      data-slot="form-control"
      className={cn(
        'flex flex-col gap-1.5',
        fullWidth && 'w-full',
        disabled && 'opacity-50',
        margin === 'dense' && 'mb-1',
        margin === 'normal' && 'mb-4',
        className,
      )}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export { FormControl };
