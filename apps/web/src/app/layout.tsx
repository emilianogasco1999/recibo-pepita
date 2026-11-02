import type { Metadata } from 'next';
import './globals.css';
import { isServiceActive } from '@/core/config/env.config';
import { ServiceSuspendedPage } from '@/features/receipts/presentation/pages/ServiceSuspendedPage';

export const metadata: Metadata = {
  title: 'PEPITA | Recibos de Vestidos',
  description: 'Generación e impresión de recibos de alquiler y reserva de vestidos',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const active = isServiceActive();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased text-neutral-900 bg-neutral-100/90 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
        {active ? children : <ServiceSuspendedPage />}
      </body>
    </html>
  );
}
