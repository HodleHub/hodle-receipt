"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/utils/utils';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface CopyButtonProps {
  title: string;
  value: string;
}

export default function CopyButton({ title, value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleCopy} 
      className="mx-1 text-gray-400 hover:text-gray-600"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
      <span className="sr-only">Copiar {title}</span>
    </Button>
  );
} 