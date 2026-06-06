import { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext({});

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div className={cn('inline-flex w-full items-center justify-center rounded-lg bg-muted p-1', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const { value: active, onValueChange } = useContext(TabsContext);
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        active === value
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
        , className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { value: active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={cn('mt-2', className)}>{children}</div>;
}
