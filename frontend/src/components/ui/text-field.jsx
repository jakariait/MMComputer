import * as React from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function TextField({
  className,
  label,
  variant,
  size,
  color,
  fullWidth = true,
  error,
  helperText,
  InputProps,
  ...props
}) {
  const autoId = useId();
  const id = props.id ?? autoId;
  const helperId = `${id}-helper`;

  return (
    <div
      className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive/50',
          InputProps?.className,
        )}
        aria-invalid={error || undefined}
        aria-describedby={helperText ? helperId : undefined}
        {...InputProps}
        {...props}
        id={id}
      />
      {helperText && (
        <p
          id={helperId}
          className={cn(
            'text-xs',
            error ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export { TextField };
