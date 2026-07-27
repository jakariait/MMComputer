import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, CircleCheckIcon, OctagonXIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';

const iconMap = {
  success: CircleCheckIcon,
  error: OctagonXIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
};

function Snackbar({
  className,
  open,
  message,
  autoHideDuration,
  onClose,
  children,
  variant = 'info',
  anchorOrigin,
  ...props
}) {
  const [visible, setVisible] = React.useState(open);
  const Icon = iconMap[variant] || InfoIcon;

  React.useEffect(() => {
    setVisible(open);
  }, [open]);

  React.useEffect(() => {
    if (visible && autoHideDuration && onClose) {
      const timer = setTimeout(() => {
        onClose({}, 'timeout');
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHideDuration, onClose]);

  if (!visible) return null;

  return (
    <div
      data-slot="snackbar"
      className={cn(
        'fixed z-50 flex items-center gap-4 rounded-lg bg-popover px-4 py-3 text-popover-foreground shadow-lg border',
        anchorOrigin?.vertical === 'top' ? 'top-4' : 'bottom-4',
        anchorOrigin?.horizontal === 'left'
          ? 'left-4'
          : anchorOrigin?.horizontal === 'right'
            ? 'right-4'
            : 'left-1/2 -translate-x-1/2',
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {children || <span>{message}</span>}
      {onClose && (
        <button
          onClick={(e) => onClose(e, 'clickaway')}
          className="ml-auto shrink-0 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export { Snackbar };
