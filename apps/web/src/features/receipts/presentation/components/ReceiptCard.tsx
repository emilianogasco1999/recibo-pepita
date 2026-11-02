import Image from "next/image";
import logoPepita from "@/assets/LOGO PEPITA.png";
import { Receipt } from "../../domain/entities/receipt.entity";
import { formatCurrency, formatDate } from "@/core/utils/formatters";

interface ReceiptCardProps {
  receipt: Receipt;
}

const BARCODE_BARS = [
  2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 1, 2,
  3, 1, 1, 2, 3, 1, 2, 1, 2, 3, 1,
];

function AsteriskDivider() {
  return (
    <div
      aria-hidden="true"
      className="my-2 sm:my-2 select-none overflow-hidden text-center font-mono text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.35em] text-neutral-400"
    >
      * * * * * * * * * *
    </div>
  );
}

function ScallopEdge({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex w-full justify-between overflow-hidden px-1 print:hidden ${
        position === "top" ? "-mt-4 mb-4" : "mt-5 -mb-4"
      }`}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-950"
        />
      ))}
    </div>
  );
}

export function ReceiptCard({ receipt }: ReceiptCardProps) {
  const receiptCode = `${receipt.issuedAt.replace(/-/g, "")}-${
    ((receipt.personName.length * 17 + receipt.price) % 900) + 100
  }`;

  return (
    <article className="mx-auto w-full max-w-[440px] bg-white px-5 sm:px-8 py-2 print:py-6 text-neutral-900 ring-1 ring-neutral-200/80 dark:ring-neutral-800 dark:shadow-2xl print:shadow-none print:ring-1 print:ring-neutral-300">
      {/* Borde troquelado superior tipo ticket */}
      <ScallopEdge position="top" />

      {/* Encabezado con Logo PEPITA */}
      <header className="flex flex-col items-center pt-2 pb-3 text-center">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl shadow-md ring-2 ring-[#fa0c84]/20">
          <Image
            src={logoPepita}
            alt="Logo Pepita"
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>

        <h1 className="mt-3 sm:mt-4 font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-neutral-900">
          PEPITA
        </h1>
        <p className="mt-1 font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-neutral-500">
          Alquiler y Reserva de Vestidos
        </p>
        <p className="mt-1.5 inline-block rounded-full bg-neutral-100 px-3 py-0.5 font-mono text-[11px] font-medium text-neutral-600">
          Fecha de emisión: {formatDate(receipt.issuedAt)}
        </p>
      </header>

      <AsteriskDivider />

      <div className="py-0.5 text-center font-mono text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-neutral-900 uppercase">
        Comprobante de Recibo
      </div>

      <AsteriskDivider />

      {/* Filas de Conceptos con espacio aireado y puntos guía */}
      <section className="space-y-3.5 sm:space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          <span>Concepto</span>
          <span>Detalle</span>
        </div>

        <div className="flex items-baseline justify-between gap-2 sm:gap-4">
          <span className="shrink-0 text-neutral-500">Persona</span>
          <span className="min-w-[16px] flex-1 border-b border-dotted border-neutral-300" />
          <span className="max-w-[60%] break-words text-right text-xs sm:text-sm font-semibold text-neutral-900">
            {receipt.personName}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2 sm:gap-4">
          <span className="shrink-0 text-neutral-500">Vestido</span>
          <span className="min-w-[16px] flex-1 border-b border-dotted border-neutral-300" />
          <span className="max-w-[60%] break-words text-right text-xs sm:text-sm font-semibold text-neutral-900">
            {receipt.dressName}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2 sm:gap-4">
          <span className="shrink-0 text-neutral-500">Fecha del evento</span>
          <span className="min-w-[16px] flex-1 border-b border-dotted border-neutral-300" />
          <span className="shrink-0 text-right font-semibold text-neutral-900">
            {formatDate(receipt.eventDate)}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2 sm:gap-4">
          <span className="shrink-0 text-neutral-500">Día de entrega</span>
          <span className="min-w-[16px] flex-1 border-b border-dotted border-neutral-300" />
          <span className="shrink-0 text-right font-semibold text-neutral-900">
            {formatDate(receipt.deliveryDate)}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2 sm:gap-4">
          <span className="shrink-0 text-neutral-500">Día de devolución</span>
          <span className="min-w-[16px] flex-1 border-b border-dotted border-neutral-300" />
          <span className="shrink-0 text-right font-semibold text-neutral-900">
            {formatDate(receipt.returnDate)}
          </span>
        </div>
      </section>

      <AsteriskDivider />

      {/* Resumen Económico */}
      <section className="space-y-3 font-mono">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-neutral-600">Precio del vestido</span>
          <span className="text-sm font-semibold text-neutral-900">
            {formatCurrency(receipt.price)}
          </span>
        </div>

        <div className="flex items-baseline justify-between text-xs">
          <span className="text-neutral-600">Seña entregada</span>
          <span className="text-sm font-semibold text-emerald-700">
            - {formatCurrency(receipt.deposit)}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between rounded-xl bg-neutral-100 px-3.5 sm:px-4 py-3 sm:py-3.5 text-neutral-900 border border-neutral-200">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            Saldo Restante
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#fa0c84]">
            {formatCurrency(receipt.remainingBalance)}
          </span>
        </div>
      </section>

      <AsteriskDivider />

      {/* Observaciones */}
      <section className="space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span className="font-bold uppercase tracking-wider">
            Observaciones
          </span>
        </div>
        <div className="min-h-[60px] whitespace-pre-wrap rounded-xl border border-dashed border-neutral-300 bg-neutral-50/80 p-3 sm:p-3.5 text-xs leading-relaxed text-neutral-700">
          {receipt.observation || "Sin observaciones adicionales."}
        </div>
      </section>

      {/* <AsteriskDivider /> */}

      {/* Pie con agradecimiento y código de barras */}
      <footer className="pt-1 pb-2 text-center hidden">
        <p className="font-mono text-xs font-bold tracking-[0.18em] sm:tracking-[0.22em] text-neutral-800 uppercase">
          ¡Gracias por elegirnos!
        </p>

        <div
          aria-hidden="true"
          className="mt-3.5 flex h-11 sm:h-12 items-stretch justify-center gap-[2px] px-2 overflow-hidden"
        >
          {BARCODE_BARS.map((width, idx) => (
            <span
              key={idx}
              style={{ width: `${width * 2}px` }}
              className={
                idx % 2 === 0
                  ? "bg-neutral-900 shrink-0"
                  : "bg-transparent shrink-0"
              }
            />
          ))}
        </div>
        <p className="mt-1.5 font-mono text-[10px] tracking-[0.3em] text-neutral-400">
          {receiptCode}
        </p>
      </footer>

      {/* Borde troquelado inferior tipo ticket */}
      <ScallopEdge position="bottom" />
    </article>
  );
}
