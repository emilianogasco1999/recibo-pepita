export function isServiceActive(): boolean {
  const raw = process.env.ACTIVO ?? process.env.NEXT_PUBLIC_ACTIVO ?? 'true';
  return raw.trim().toLowerCase() === 'true';
}

