export function ReceiptTerms() {
  return (
    <section
      aria-label="Condiciones del servicio"
      className="mx-auto w-full max-w-[440px] break-inside-avoid rounded-2xl border border-neutral-200/90 bg-white/90 px-5 sm:px-7 py-5 text-xs leading-relaxed text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-300 print:mt-0 print:rounded-xl print:border-neutral-300 print:bg-white print:px-5 print:py-3 print:text-[10px] print:leading-snug print:text-neutral-700 print:shadow-none"
    >
      <h2 className="font-mono text-xs print:text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 print:text-neutral-900 text-center">
        Condiciones del servicio – Pepita Alquiler de Vestidos
      </h2>

      <p className="mt-2.5 print:mt-1.5 text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
        Para que podamos ofrecer una experiencia linda y satisfactoria para
        ambas partes, te pedimos tener en cuenta las siguientes condiciones:
      </p>

      <ol className="mt-3 print:mt-1.5 list-decimal space-y-2 print:space-y-1 pl-4 text-neutral-600 dark:text-neutral-300 print:text-neutral-700">
        <li>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100 print:text-neutral-900">
            Fecha de devolución:
          </strong>{" "}
          En caso de no devolver la prenda en la fecha pactada, se aplicará un
          recargo de $10.000 por cada día de demora.
        </li>
        <li>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100 print:text-neutral-900">
            Cuidado de la prenda:
          </strong>{" "}
          En caso de daños, roturas o deterioros, se cobrará el importe
          correspondiente al arreglo o reparación. Si la prenda se pierde o no
          puede recuperarse, deberá abonarse el valor de reposición de la misma.
        </li>
        <li>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100 print:text-neutral-900">
            Servicio de tintorería:
          </strong>{" "}
          El alquiler incluye el servicio de tintorería clásico. Este servicio
          contempla la limpieza habitual de la prenda. En caso de presentar
          suciedad excesiva, vómito, manchas de bebidas u otras manchas
          difíciles de remover, los costos adicionales de limpieza estarán a
          cargo de la clienta.
        </li>
        <li>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100 print:text-neutral-900">
            Compromiso de cuidado:
          </strong>{" "}
          En Pepita queremos que ambas partes disfrutemos de una buena
          experiencia de alquiler. Por eso, te pedimos cuidar la prenda y
          devolverla en las mismas condiciones generales en las que fue
          entregada.
        </li>
      </ol>

      <p className="mt-4 print:mt-2 text-center font-serif text-sm print:text-xs font-semibold text-[#fa0c84]">
        ¡Gracias por elegir Pepita y confiar en nosotras! ♡
      </p>
    </section>
  );
}
