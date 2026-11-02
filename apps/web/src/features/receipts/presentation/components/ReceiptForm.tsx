'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, RotateCcw } from 'lucide-react';
import {
  receiptSchema,
  type ReceiptFormValues,
} from '../validation/receipt.schema';
import { InputField } from '@/components/Form/InputField';
import { TextareaField } from '@/components/Form/TextareaField';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/core/utils/formatters';

interface ReceiptFormProps {
  defaultValues?: Partial<ReceiptFormValues>;
  onSubmitForm: (values: ReceiptFormValues) => void;
  onResetForm?: () => void;
}

export function ReceiptForm({
  defaultValues,
  onSubmitForm,
  onResetForm,
}: ReceiptFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      personName: defaultValues?.personName ?? '',
      dni: defaultValues?.dni ?? '',
      phone: defaultValues?.phone ?? '',
      dressName: defaultValues?.dressName ?? '',
      eventDate: defaultValues?.eventDate ?? '',
      price: defaultValues?.price ?? ('' as unknown as number),
      deposit: defaultValues?.deposit ?? ('' as unknown as number),
      deliveryDate: defaultValues?.deliveryDate ?? '',
      returnDate: defaultValues?.returnDate ?? '',
      observation: defaultValues?.observation ?? '',
    },
  });

  const watchedPrice = Number(watch('price')) || 0;
  const watchedDeposit = Number(watch('deposit')) || 0;
  const remaining = Math.max(0, watchedPrice - watchedDeposit);

  const handleClear = () => {
    reset({
      personName: '',
      dni: '',
      phone: '',
      dressName: '',
      eventDate: '',
      price: '' as unknown as number,
      deposit: '' as unknown as number,
      deliveryDate: '',
      returnDate: '',
      observation: '',
    });
    onResetForm?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Nombre de la persona"
          placeholder="Ej: María González"
          error={errors.personName?.message}
          {...register('personName')}
        />

        <InputField
          label="Nombre del vestido"
          placeholder="Ej: Vestido Esmeralda Largo"
          error={errors.dressName?.message}
          {...register('dressName')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="DNI"
          type="text"
          inputMode="numeric"
          placeholder="Ej: 40123456"
          error={errors.dni?.message}
          {...register('dni')}
        />

        <InputField
          label="Número de teléfono"
          type="tel"
          placeholder="Ej: 11 2345-6789"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InputField
          label="Fecha del evento"
          type="date"
          error={errors.eventDate?.message}
          {...register('eventDate')}
        />

        <InputField
          label="Día de entrega"
          type="date"
          error={errors.deliveryDate?.message}
          {...register('deliveryDate')}
        />

        <InputField
          label="Día de devolución"
          type="date"
          error={errors.returnDate?.message}
          {...register('returnDate')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Precio ($)"
          type="number"
          min="0"
          step="any"
          placeholder="0"
          error={errors.price?.message}
          {...register('price')}
        />

        <InputField
          label="Seña ($)"
          type="number"
          min="0"
          step="any"
          placeholder="0"
          error={errors.deposit?.message}
          {...register('deposit')}
        />
      </div>

      {watchedPrice > 0 && (
        <section className="space-y-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 p-4 font-mono">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-neutral-600 dark:text-neutral-400">
              Precio del vestido
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {formatCurrency(watchedPrice)}
            </span>
          </div>

          <div className="flex items-baseline justify-between text-xs">
            <span className="text-neutral-600 dark:text-neutral-400">
              Seña entregada
            </span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              - {formatCurrency(watchedDeposit)}
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between rounded-xl bg-neutral-100 dark:bg-neutral-800 px-3.5 sm:px-4 py-3 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              Saldo Restante
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#fa0c84]">
              {formatCurrency(remaining)}
            </span>
          </div>
        </section>
      )}

      <TextareaField
        label="Observación"
        placeholder="Espacio para aclaraciones (arreglos, accesorios incluidos, estado de entrega, etc.)"
        error={errors.observation?.message}
        {...register('observation')}
      />

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={handleClear}>
          <RotateCcw className="h-4 w-4" />
          Limpiar campos
        </Button>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <FileText className="h-4 w-4" />
          Generar recibo
        </Button>
      </div>
    </form>
  );
}
