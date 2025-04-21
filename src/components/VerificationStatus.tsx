'use client';

import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface VerificationStatusProps {
  isPaid: boolean;
  isVerified: boolean;
  isLoading: boolean;
}

export default function VerificationStatus({ 
  isPaid, 
  isVerified, 
  isLoading 
}: VerificationStatusProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-end text-amber-500">
        <Clock className="mx-2 animate-pulse" />
        <span>Verificando pagamento...</span>
      </div>
    );
  }
  
  if (!isVerified) {
    return (
      <div className="flex items-center justify-end text-gray-500">
        <Clock className="mx-2" />
        <span>Informe invoice e pré-imagem para verificar</span>
      </div>
    );
  }
  
  if (isPaid) {
    return (
      <div className="text-green-500 flex items-center justify-end">
        <CheckCircle2 className="mx-2 text-xl" />
        <span>Pagamento bem-sucedido!</span>
      </div>
    );
  }
  
  return (
    <div className="text-red-500 flex items-center justify-end">
      <XCircle className="mx-2 text-xl" />
      <span>Pré-imagem inválida</span>
    </div>
  );
} 