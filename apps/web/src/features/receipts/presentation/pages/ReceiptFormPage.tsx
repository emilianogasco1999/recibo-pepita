'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logoPepita from '@/assets/LOGO PEPITA.png';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ThemeToggle } from '@/components/Theme/ThemeToggle';
import { ReceiptForm } from '../components/ReceiptForm';
import { useReceiptStore } from '../store/receipt.store';
import type { ReceiptFormValues } from '../validation/receipt.schema';

export function ReceiptFormPage() {
  const router = useRouter();
  const currentReceipt = useReceiptStore((state) => state.currentReceipt);
  const setReceipt = useReceiptStore((state) => state.setReceipt);
  const clearReceipt = useReceiptStore((state) => state.clearReceipt);

  const handleGenerateReceipt = (values: ReceiptFormValues) => {
    setReceipt(values);
    router.push('/recibo');
  };

  return (
    <main className="min-h-screen bg-neutral-100/90 dark:bg-neutral-950 py-8 px-4 transition-colors">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        {/* Barra superior con logo y cambio de tema */}
        <div className="flex items-center justify-between">
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
                Gestión de Recibos
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Generar Recibo</CardTitle>
            <CardDescription>
              Completá los datos del alquiler o reserva del vestido para armar
              el comprobante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptForm
              defaultValues={currentReceipt ?? undefined}
              onSubmitForm={handleGenerateReceipt}
              onResetForm={clearReceipt}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
