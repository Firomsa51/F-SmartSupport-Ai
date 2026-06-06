export function ToastProvider({ children }) {
  return <>{children}</>;
}

export function Toast({ children, variant = 'default', ...props }) {
  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm
      ${variant === 'destructive'
        ? 'bg-destructive text-destructive-foreground border-destructive'
        : 'bg-card text-card-foreground border-border'}`}
      {...props}>
      {children}
    </div>
  );
}

export function ToastTitle({ children }) {
  return <div className="font-semibold text-sm">{children}</div>;
}

export function ToastDescription({ children }) {
  return <div className="text-sm text-muted-foreground mt-1">{children}</div>;
}

export function ToastClose({ onClick }) {
  return (
    <button onClick={onClick}
      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-xs">
      ✕
    </button>
  );
}

export function ToastViewport() {
  return null;
}
