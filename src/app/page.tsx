import LightningReceiptForm from '@/components/LightningReceiptForm';
import Image from 'next/image';
import Link from 'next/link';

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
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>
          Construído com <a href="https://www.npmjs.com/package/light-bolt11-decoder" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">bolt11</a> | <a href="https://github.com/HodleHub/hodle-receipt" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">GitHub</a>
        </p>
      </footer>
    </div>
  );
}
