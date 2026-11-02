'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, PlusCircle } from 'lucide-react';
import logoPepita from '@/assets/LOGO PEPITA.png';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/Theme/ThemeToggle';
import { Receipt } from '../../domain/entities/receipt.entity';
import { ReceiptCard } from '../components/ReceiptCard';
import { ReceiptTerms } from '../components/ReceiptTerms';
import { useReceiptStore } from '../store/receipt.store';

export function ReceiptPreviewPage() {
  const router = useRouter();
  const currentReceipt = useReceiptStore((state) => state.currentReceipt);
  const clearReceipt = useReceiptStore((state) => state.clearReceipt);

  const receiptEntity = currentReceipt ? new Receipt(currentReceipt) : null;

  useEffect(() => {
    if (!currentReceipt) {
      router.replace('/');
    }
  }, [currentReceipt, router]);

  useEffect(() => {
    if (!receiptEntity) return;
    const previousTitle = document.title;
    document.title = receiptEntity.pdfFileName;
    return () => {
      document.title = previousTitle;
    };
  }, [receiptEntity]);

  if (!receiptEntity) {
    return null;
  }

  const handlePrint = () => {
    document.title = receiptEntity.pdfFileName;
    window.print();
  };

  const handleNewReceipt = () => {
    clearReceipt();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-neutral-100 dark:bg-neutral-950 py-8 px-4 transition-colors print:bg-white print:py-1 print:px-0 print:min-h-0">
      <div className="mx-auto w-full max-w-2xl space-y-6 print:space-y-2.5">
        {/* Misma cabecera superior que la vista principal (se oculta al imprimir) */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/10">
              <Image
                src={logoPepita}
                alt="Logo Pepita"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-widest text-neutral-900 dark:text-neutral-100">
                PEPITA
              </span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Vista Previa del Recibo
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>

        {/* Vista previa e imprimible del recibo */}
        <div className="space-y-6 py-2 print:space-y-2.5 print:py-0">
          <ReceiptCard receipt={receiptEntity} />
          <ReceiptTerms />
        </div>

        {/* Botones de acción en la parte inferior (igual que en la vista principal) */}
        <div className="mx-auto flex w-full max-w-[440px] flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1 sm:flex-initial"
            >
              <ArrowLeft className="h-4 w-4" />
              Editar datos
            </Button>

            <Button
              variant="ghost"
              onClick={handleNewReceipt}
              className="flex-1 sm:flex-initial"
            >
              <PlusCircle className="h-4 w-4" />
              Nuevo
            </Button>
          </div>

          <Button onClick={handlePrint} size="lg" className="w-full sm:w-auto">
            <Printer className="h-4 w-4" />
            Imprimir / PDF
          </Button>
        </div>
      </div>
    </main>
  );
}
