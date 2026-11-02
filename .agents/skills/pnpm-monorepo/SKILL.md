---
name: pnpm-monorepo
description: Arquitectura y convenciones globales para monorepos fullstack con pnpm workspaces, apps (API + Web) y packages compartidos (shared + config). Aplica a cualquier proyecto que utilice este estándar.
---

# Fullstack Monorepo Architecture & Standards (pnpm Workspaces)

Esta directiva define la arquitectura, topología de directorios, flujo de contratos y estándares de ingeniería para monorepos estructurados con **pnpm workspaces**.

---

## 1. Topología del Monorepo

La estructura raíz organiza aplicaciones, librerías compartidas, infraestructura en contenedores y configuración de agentes:

```
<monorepo-root>/
├── .agents/                 # Directivas, skills y configuraciones de agentes de IA
│   └── skills/              # Skills modulares reutilizables
├── .docker/                 # Entornos dockerizados (dev, prod, scripts de backup)
├── apps/                    # Aplicaciones ejecutables
│   ├── api/                 # Backend (Node.js / Express / Prisma / Clean Architecture)
│   └── web/                 # Frontend (Next.js 16 App Router / React 19 / Tailwind v4 / Shadcn + Base UI / TanStack Query / Zustand)
├── packages/                # Paquetes y contratos compartidos entre aplicaciones
│   ├── shared/              # SSOT: Esquemas Zod, Tipos inferidos y Constantes
│   └── config/              # Configuraciones de compilación y estilo compartidas
├── .dockerignore            # Exclusión de archivos para optimizar builds de Docker
├── .env.example             # Plantilla canónica de variables de entorno requeridas
├── .gitignore               # Exclusiones de control de versiones
├── .prettierrc              # Estándares de formateo de código unificados
├── docker-compose.yml       # Orquestación de infraestructura local (BD, Storage, etc.)
├── package.json             # Scripts de orquestación global del workspace
├── pnpm-lock.yaml           # Bloqueo determinista de versiones de dependencias
├── pnpm-workspace.yaml      # Definición de miembros del workspace (apps/*, packages/*)
├── skills-lock.json         # Registro y bloqueo de dependencias de skills para agentes
└── README.md                # Documentación general y guía de inicialización del proyecto
```

---

## 2. Definición del Workspace (`pnpm-workspace.yaml`)

El archivo raíz declara los paquetes que componen la solución:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Las aplicaciones consumen los paquetes compartidos mediante dependencias de espacio de trabajo:
- `"@<scope>/shared": "workspace:*"`
- `"@<scope>/config": "workspace:*"`

---

## 3. Patrón Contract-First: `packages/shared` como Single Source of Truth (SSOT)

Ningún modelo, DTO o entidad que viaje por la frontera HTTP se define de forma aislada en `apps/api` o `apps/web`. **Toda definición nace en `packages/shared`.**

### Estructura Interna:
```
packages/shared/src/
├── constants/           # Enums del dominio, constantes de negocio, estados y roles
├── schemas/             # Esquemas de validación Zod organizados por feature
├── types/               # Tipos TypeScript compartidos o inferidos de esquemas
└── index.ts             # Punto de exportación único (barrel export)
```

### Reglas de Implementación:
1. **Zod como Definición Primaria**:
   ```typescript
   export const createEntitySchema = z.object({ ... });
   export type CreateEntityInput = z.infer<typeof createEntitySchema>;
   ```
2. **Validación en Backend (`apps/api`)**:
   - Cada ruta Express valida la entrada usando middlewares basados en los esquemas de Zod (`validateRequest(schema)`).
   - Garantiza que los controladores y casos de uso reciban datos ya parseados, tipados y sanitizados.
3. **Validación en Frontend (`apps/web`)**:
   - Los formularios consumen los mismos esquemas de Zod con resolvers (`@hookform/resolvers/zod`).
   - Elimina duplicación de lógica y desincronizaciones entre cliente y servidor.

---

## 4. Centralización de Compilación: `packages/config`

Evita la fragmentación de configuraciones técnicas en cada aplicación:
- `tsconfig.base.json`: Opciones estrictas de TypeScript base.
- `tsconfig.node.json`: Configuración para entornos Node / backend (`apps/api`).
- `tsconfig.react.json`: Configuración para entornos DOM / React (`apps/web`).
- `eslint.base.js`: Reglas homogéneas de linter para todo el monorepo.

---

## 5. Separación de Responsabilidades en Aplicaciones (`apps/`)

### `apps/api` (Backend Desacoplado)
- Diseñado bajo **Clean Architecture / Hexagonal**:
  - `domain/`: Reglas de negocio puras, Entidades y Value Objects (sin dependencias de frameworks).
  - `application/`: Casos de uso (`use-cases`), orquestación de la lógica.
  - `infrastructure/`: Implementación de persistencia (ORM/Prisma), clientes de almacenamiento (S3) y servicios de terceros.
  - `presentation/`: Rutas, middlewares (autenticación, autorización de roles), y controladores HTTP.

### `apps/web` (Frontend con Clean Architecture & Feature-Driven)
- Diseñado bajo **Clean Architecture desacoplada + Feature-Driven & Container/Presentational**:
  - `app/`: Enrutamiento delgado (Next.js 16 App Router), shells de página, layouts y providers que delegan la UI a la capa de presentación.
  - `features/<feature>/`:
    - `domain/`: Entidades del frontend, interfaces y contratos de repositorios locales.
    - `application/`: Casos de uso (`use-cases`) que orquestan flujos de negocio del cliente.
    - `infrastructure/`: Implementaciones de repositorios y adaptadores que consumen la API mediante `core/api/api.client.ts`.
    - `presentation/`: Páginas completas, componentes modulares (Container/Presentational), queries/mutations con TanStack Query v5 y validaciones con React Hook Form + Zod (`packages/shared`).
  - `core/`: Servicios transversales (`api/api.client.ts` con `withCredentials: true` para cookies seguras `httpOnly`, interceptores de refresh token, providers globales, errores y stores de sesión).
  - Manejo de Estado: **TanStack Query** para Server State (caching y revalidación) y **Zustand** para Client State liviano (UI y sesión pública; **nunca persistir refresh tokens en localStorage**).

---

## 6. Infraestructura y Entorno

- **Docker Compose**: Gestiona servicios auxiliares (base de datos relacional, storage compatible con S3/MinIO, caches) sin obligar a instalar motores locales.
- **Variables de Entorno**: El archivo `.env.example` en la raíz documenta todas las claves requeridas para levantar los servicios del workspace y sus puertos.

---

## 7. Comandos Universales del Workspace

Desde la raíz del monorepo:
```bash
# Desarrollo
pnpm dev:local       # Ejecuta en paralelo las aplicaciones del workspace
pnpm dev:api         # Ejecuta únicamente el backend en modo watch
pnpm dev:web         # Ejecuta únicamente el frontend de desarrollo

# Construcción y Calidad
pnpm build           # Compila todos los paquetes y aplicaciones recursivamente
pnpm lint            # Verificación de tipos y análisis estático en todo el monorepo
```

---

## 8. Referencias Técnicas Especializadas

Para profundizar en normas operativas específicas, consultar bajo demanda:

### Estándares del Workspace e Infraestructura:
- [Política y Gestión de Dependencias](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/dependencies.md): Reglas de aislamiento por capa, uso de `workspace:*`, prevención de *phantom dependencies* y comandos con `--filter`.
- [Infraestructura y Contenedores (Docker)](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/docker-infrastructure.md): Modelo híbrido de desarrollo, compose modular en `.docker/`, volúmenes nombrados y redes de servicios.
- [Docker Multi-Stage Builds en Monorepos](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/docker-multistage-builds.md): Dockerfiles canónicos para API (Prisma/Express) y Frontend (Next.js Standalone), cache de capas y usuario no-root.
- [Estrategia de Backups y Disaster Recovery](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/backup-and-disaster-recovery.md): Servicio automatizado de backup 24/7 (pg_dump + MinIO S3), sincronización multi-destino con Rclone, rotación y restauración.
- [Orquestación de Scripts y Ciclo de Vida](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/workspace-scripts.md): Ejecución filtrada y paralela, orden de compilación en cascada y tareas de base de datos.
- [Ejemplos Canónicos del Monorepo Raíz y Shared](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/monorepo-examples.md): Snippets modelo para `pnpm-workspace.yaml`, esquemas Zod en `packages/shared`, constantes y `docker-compose.yml`.

### Arquitectura de Backend (`apps/api`):
- [Clean Architecture en Backend](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/backend/clean-architecture.md): Topología Feature-Sliced, regla de dependencias, matrices de imports y estructura completa por feature.
- [Reglas de Dependencias por Capa (Backend)](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/backend/layer-rules.md): Matriz estricta de imports permitidos y prohibidos entre domain, application, infrastructure y presentation.
- [Stack de Dependencias del Backend](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/backend/dependencies-stack.md): Justificación y uso de Express, Prisma, JWT, Bcrypt, Zod y Swagger.
- [Ejemplos Canónicos por Capa (Backend)](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/backend/layer-examples.md): Código fuente canónico de entidades, repositorios, casos de uso, controladores y rutas.
- [Patrón Caso de Uso y Controlador (Backend)](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/backend/use-case-controller-pattern.md): Guía de orquestación, manejo de errores y respuestas estandarizadas.
- [Patrón de Almacenamiento S3 Desacoplado](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/backend/s3-storage-pattern.md): Integración agnóstica de MinIO / S3 con `@aws-sdk/client-s3`, URLs prefirmadas temporales, sanitización y prevención de Path Traversal.

### Arquitectura de Frontend (`apps/web`):
- [Clean Architecture en Frontend](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/frontend/clean-architecture.md): Clean Architecture adaptada a Next.js 16 (App Router) + React 19, separación modular por feature y routing delgado.
- [Reglas de Dependencias por Capa (Frontend)](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/frontend/layer-rules.md): Matriz de imports entre domain, application, infrastructure, presentation y app.
- [Stack de Dependencias del Frontend](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/frontend/dependencies-stack.md): Next.js 16, React 19, Tailwind v4, TanStack Query v5, Zustand v5, React Hook Form y Axios.
- [Ejemplos Canónicos por Capa (Frontend)](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/frontend/layer-examples.md): Snippets completos de entidad, repositorio con Axios, caso de uso, validación Zod, hook de TanStack Query y formulario.
- [Patrón Caso de Uso, Hooks y Componentes (Frontend)](file:///d:/_Gasco/programacion/finca-don-osvaldo/.agents/skills/pnpm-monorepo/references/frontend/use-case-controller-pattern.md): Flujo unidireccional de datos, hooks como controladores y patrón Container/Presentational.


