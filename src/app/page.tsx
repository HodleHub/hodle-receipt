import LightningReceiptForm from '@/components/LightningReceiptForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <Image 
            src="/hodlelogo.png" 
            alt="Hodle Logo" 
            width={120} 
            height={120} 
            className="mb-2"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-orange-500">Recibo Lightning</h1>
        <p className="text-muted-foreground">
          Gere provas criptográficas para seus pagamentos na Lightning Network
        </p>
      </header>

      <div className="grid gap-6 w-full max-w-2xl mx-auto">
        <LightningReceiptForm />
      </div>
    </div>
  );
}
