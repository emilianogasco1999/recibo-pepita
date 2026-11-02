import { z } from 'zod';

export const receiptSchema = z
  .object({
    personName: z
      .string()
      .trim()
      .min(2, 'Ingresá el nombre de la persona'),
    dni: z
      .string()
      .trim()
      .min(6, 'Ingresá un DNI válido'),
    phone: z
      .string()
      .trim()
      .min(6, 'Ingresá un número de teléfono válido'),
    dressName: z
      .string()
      .trim()
      .min(2, 'Ingresá el nombre o modelo del vestido'),
    eventDate: z
      .string()
      .min(1, 'Seleccioná la fecha del evento'),
    price: z.coerce
      .number({ invalid_type_error: 'Ingresá un precio válido' })
      .min(0, 'El precio no puede ser negativo'),
    deposit: z.coerce
      .number({ invalid_type_error: 'Ingresá una seña válida' })
      .min(0, 'La seña no puede ser negativa'),
    deliveryDate: z
      .string()
      .min(1, 'Seleccioná el día de entrega'),
    returnDate: z
      .string()
      .min(1, 'Seleccioná el día de devolución'),
    observation: z.string().optional(),
  })
  .refine((data) => data.deposit <= data.price, {
    message: 'La seña no puede ser mayor al precio total',
    path: ['deposit'],
  });

export type ReceiptFormValues = z.infer<typeof receiptSchema>;

