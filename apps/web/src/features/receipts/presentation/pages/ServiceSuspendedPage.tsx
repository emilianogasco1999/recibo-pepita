import { AlertTriangle } from 'lucide-react';

export function ServiceSuspendedPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 text-center shadow-xl space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="inline-block rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-mono uppercase tracking-widest text-neutral-400">
            Error 404
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            El servicio ha finalizado.
          </h1>
          <p className="text-sm leading-relaxed text-neutral-400">
            Por favor ponerse en contacto con el distribuidor.
          </p>
        </div>
      </div>
    </main>
  );
}

