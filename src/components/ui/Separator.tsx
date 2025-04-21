import React from 'react';
import { cn } from '@/utils/utils';

interface SeparatorProps {
  className?: string;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function Separator({
  className,
  label,
  orientation = 'horizontal',
  ...props
}: SeparatorProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center',
        orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
        className
      )}
      {...props}
    >
      <div className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      )} />
      
      {label && (
        <div className="relative flex justify-center">
          <span className="bg-card px-2 text-xs text-muted-foreground absolute -top-2">
            {label}
          </span>
        </div>
      )}
    </div>
  );
} 