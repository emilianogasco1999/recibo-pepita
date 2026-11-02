# Recibo Pepita

Aplicación web liviana para la generación, vista previa y exportación a PDF / impresión de recibos de alquiler y reserva de vestidos para **PEPITA**.

Diseñada bajo **Clean Architecture (Feature-Sliced + Container/Presentational)** en `apps/web`, preparada para escalar a un monorepo completo en caso de incorporar un backend en el futuro.

---

## Características Principales

- **Vista 1 — Formulario de Recibo (`/`)**:
  - Carga validada con **React Hook Form** + **Zod**.
  - Campos: *Nombre de la persona*, *Nombre del vestido*, *Fecha del evento*, *Día de entrega*, *Día de devolución*, *Precio*, *Seña* y *Observación*.
  - Cálculo automático en tiempo real del **Saldo pendiente** (`Precio - Seña`).
- **Vista 2 — Vista Previa estilo Ticket / Comprobante (`/recibo`)**:
  - Diseño pre-impreso con formato de ticket troquelado, logo oficial de **PEPITA**, desglose de importes, número de comprobante y código de barras estético.
  - Exportación nativa a **PDF / Impresión** (`window.print()`) que oculta automáticamente los controles de navegación y conserva el papel blanco limpio tanto en modo claro como oscuro.
- **Vista 3 — Estado de Servicio Finalizado (`ACTIVO=false`)**:
  - Interruptor por variable de entorno evaluado en el servidor (`RootLayout`).
  - Cuando `ACTIVO=false`, bloquea el acceso a todas las rutas y muestra la pantalla: *"Error 404 — El servicio ha finalizado. Por favor ponerse en contacto con el distribuidor."*
- **Modo Claro / Oscuro (Light & Dark Mode)**:
  - Selector de tema persistido en el navegador (`ThemeToggle`).

---

## Arquitectura de Carpetas (`apps/web`)

```text
pepita/
├── .env.example                     # Plantilla de variables de entorno
├── package.json                     # Scripts globales del workspace
├── pnpm-workspace.yaml              # Configuración de workspace (apps/*)
└── apps/
    └── web/
        ├── .env.local               # Configuración local (ACTIVO=true / false)
        └── src/
            ├── app/                 # Next.js 16 App Router (shells delgados + guard de ACTIVO)
            ├── assets/              # Recursos gráficos (LOGO PEPITA.png)
            ├── components/          # Design System reutilizable
            │   ├── Form/            # InputField, TextareaField
            │   ├── Theme/           # ThemeToggle (Modo Dark / Light)
            │   └── ui/              # Button, Card
            ├── core/                # Configuración de entorno y formateadores
            ├── features/
            │   └── receipts/        # Feature vertical de recibos
            │       ├── domain/
            │       │   └── entities/receipt.entity.ts
            │       └── presentation/
            │           ├── components/  # ReceiptForm, ReceiptCard (Ticket)
            │           ├── pages/       # ReceiptFormPage, ReceiptPreviewPage, ServiceSuspendedPage
            │           ├── store/       # Zustand store (receipt.store.ts)
            │           └── validation/  # Esquema Zod (receipt.schema.ts)
            └── lib/                 # Utilidad cn() para clases de Tailwind
```

---

## Requisitos y Ejecución

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Configurar variable de entorno**:
   Verificar el archivo `apps/web/.env.local` (creado a partir de `.env.example`):
   ```env
   ACTIVO=true
   ```
   - `ACTIVO=true`: Habilita el formulario y la generación de recibos.
   - `ACTIVO=false`: Muestra únicamente la vista de servicio finalizado (Error 404).

3. **Iniciar en modo desarrollo**:
   ```bash
   pnpm dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

4. **Compilar para producción**:
   ```bash
   pnpm build
   pnpm start
   ```
