import { cn } from '@/lib/utils';

export function AlertDialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

export function AlertDialogContent({ children, className }) {
  return (
    <div className={cn(
      'bg-card text-card-foreground rounded-xl border border-border shadow-lg p-6 w-full max-w-md mx-4',
      className
    )}>
      {children}
    </div>
  );
}

export function AlertDialogHeader({ children }) {
  return <div className="mb-4 space-y-2">{children}</div>;
}

export function AlertDialogTitle({ children }) {
  return <h2 className="text-lg font-semibold text-foreground">{children}</h2>;
}

export function AlertDialogDescription({ children }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function AlertDialogFooter({ children }) {
  return <div className="flex justify-end gap-3 mt-6">{children}</div>;
}

export function AlertDialogCancel({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({ children, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50',
        className || 'bg-primary text-primary-foreground hover:bg-primary/90'
      )}
    >
      {children}
    </button>
  );
}
