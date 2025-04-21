"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ShareIcon, CheckIcon } from 'lucide-react';
import { copyToClipboard } from '@/utils/utils';
import { type LightningReceipt } from '@/utils/lightning';

interface ShareButtonProps {
  form: LightningReceipt;
}

export default function ShareButton({ form }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const { invoice, preimage } = form;
    
    if (!invoice || !preimage) {
      return;
    }
    
    const url = new URL(window.location.origin);
    url.searchParams.set('invoice', invoice);
    url.searchParams.set('proof', preimage);
    
    const shareUrl = url.toString();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Recibo Lightning',
          text: 'Confira este recibo de pagamento Lightning Network',
          url: shareUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        await copyToClipboard(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } else {
      await copyToClipboard(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <Button 
      onClick={handleShare} 
      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
      disabled={!form.invoice || !form.preimage}
    >
      {shared ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Copiado
        </>
      ) : (
        <>
          <ShareIcon className="h-4 w-4" />
          Compartilhar Recibo
        </>
      )}
    </Button>
  );
} 