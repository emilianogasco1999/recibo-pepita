# Guía de Inicialización de un Nuevo Proyecto (Bootstrap Fullstack: Backend + Frontend)

Esta guía paso a paso explica cómo utilizar la skill `pnpm-monorepo` para levantar un proyecto completo desde cero: estructura monorepo, backend con Clean Architecture y frontend con Next.js 16 (App Router) conectado con contratos Zod compartidos.

---

## Paso 1: Preparación del Directorio

1. Creá una carpeta vacía para tu nuevo proyecto:
   ```bash
   mkdir mi-nuevo-proyecto
   cd mi-nuevo-proyecto
   ```
2. Inicializá el repositorio de git:
   ```bash
   git init
   ```
3. Copiá esta carpeta de skill dentro de tu nuevo proyecto:
   ```
   mi-nuevo-proyecto/
   └── .agents/
       └── skills/
           └── pnpm-monorepo/   <-- Pegás todo este kit acá
   ```

---

## Paso 2: El Prompt para el Agente de IA

Abrí tu agente (Antigravity, Cursor, Claude Code, etc.) y enviale este prompt exacto:

```markdown
Actuá como Senior Architect e inicializá este monorepo nuevo siguiendo de manera estricta la skill @pnpm-monorepo y todas sus referencias técnicas de backend (`references/backend/`) y frontend (`references/frontend/`).

Realizá las siguientes fases en orden:

### Fase 1: Estructura Raíz y Paquetes Compartidos

1. Creá `pnpm-workspace.yaml` declarando `apps/*` y `packages/*`.
2. Creá el `package.json` raíz con los scripts canónicos (`dev:api`, `dev:web`, `dev:local`, `dev:db`, `build`, `lint`) y dependencias de desarrollo (`typescript`).
3. Creá `.env.example` y `.gitignore`.
4. Creá `docker-compose.yml` utilizando `include: - path: .docker/dev/docker-compose.dev.yml` y definí el servicio de PostgreSQL en `.docker/dev/docker-compose.dev.yml`.
5. Creá `packages/config` con `tsconfig.base.json`, `tsconfig.node.json` y `tsconfig.react.json`.
6. Creá `packages/shared` con:
   - Contrato Zod de usuarios/login (`user.schema.ts` y exportación de tipos con `z.infer`).
   - Constantes de roles (`roles.ts` con `ADMINISTRADOR` y `CONTADOR`).
   - Barrel export en `src/index.ts`.

### Fase 2: Aplicación Backend (apps/api)

1. Creá `apps/api/package.json` instalando las dependencias esenciales documentadas en `dependencies-stack.md` (Express, Prisma, bcrypt, jsonwebtoken, zod, cors, cookie-parser, morgan, dotenv, env-var, swagger-jsdoc, swagger-ui-express).
2. Configurá `apps/api/prisma/schema.prisma` con la conexión a PostgreSQL y el modelo `User` (con email, password hash, rol y timestamps).
3. Configurá el núcleo transversal (`core/`):
   - `core/domain/errors/appErrors.ts` (ClientError, NotFoundError, etc.).
   - `core/infrastructure/database/prisma.service.ts`.
   - `core/presentation/middlewares/` (authMiddleware, permission.middleware con requireRole, validateRequest, errorHandler).
   - `core/presentation/utils/` (catchedAsync, response, resError).
4. Implementá la feature de autenticación (`features/auth/`) con Clean Architecture estricta:
   - `domain/`: Entidad `User`, interfaz `IAuthRepository`.
   - `application/`: Casos de uso `LoginUseCase` y `RegisterUseCase`.
   - `infrastructure/`: Repositorio con Prisma `AuthRepositoryImpl`.
   - `presentation/`: `AuthController`, `AuthRoutes` (con `validateRequest` y `catchedAsync`) y documentación Swagger en `auth.docs.ts`.
   - Regla de sesión: Devolver el access token en JSON y el refresh token en cookie `httpOnly`.
5. Configurá `apps/api/src/index.ts` levantando el servidor Express, los middlewares globales con CORS configurado con `credentials: true` hacia el cliente web, y Swagger UI en `/api-docs`.

### Fase 3: Aplicación Frontend (apps/web)

1. Creá `apps/web/package.json` con Next.js 16, React 19, Tailwind CSS v4, Base UI / Radix / Shadcn, TanStack Query v5, Zustand v5, React Hook Form, `@hookform/resolvers`, Axios, Sonner, Lucide React, y vinculá `@<scope>/shared` y `@<scope>/config` como `workspace:*`.
2. Configurá `next.config.ts`, `postcss.config.mjs`, `tsconfig.json` y `components.json`.
3. Configurá el núcleo transversal (`src/core/`):
   - `core/api/api.client.ts`: Instancia de Axios centralizada con `baseURL`, `withCredentials: true` e interceptores de manejo de errores y renovación de tokens.
   - `core/providers/`: TanStack Query Provider (`QueryClientProvider`), Theme Provider y Toaster (`Sonner`).
   - `core/store/`: Store de sesión pública y UI con Zustand (persistiendo solo info pública de usuario, **nunca refresh tokens en localStorage**).
4. Implementá la feature de autenticación (`src/features/auth/`) con Clean Architecture modular:
   - `domain/`: Entidad `User` del frontend y contrato `IAuthRepository` (`login`, `logout`, `getMe`).
   - `application/`: Caso de uso `LoginUseCase` orquestando la llamada al repositorio y actualización del store.
   - `infrastructure/`: `AuthRepositoryImpl` implementando `IAuthRepository` consumiendo `core/api/api.client.ts`.
   - `presentation/`:
     - `validation/`: Esquemas de formulario importando los contratos Zod de `packages/shared`.
     - `mutations/`: Custom hook con TanStack Query (`useLoginMutation`).
     - `components/`: Componente presentacional del formulario de login (`LoginForm.tsx`) usando React Hook Form + Zod resolver + Shadcn UI.
     - `pages/`: `LoginPage.tsx` orquestando la vista completa.
5. Configurá `src/app/`: Shells de Next.js App Router:
   - `app/layout.tsx`: Configuración de fuentes, metadatos y envoltura con los providers globales de `core/providers`.
   - `app/page.tsx`: Redirección o renderizado de `LoginPage` desde `features/auth/presentation/pages`.
```

---

## Paso 3: Comandos de Terminal para Ponerlo en Marcha

Una vez que el agente terminó de generar el código, ejecutá estos comandos secuenciales en tu terminal:

### 1. Instalar dependencias del workspace:

```bash
pnpm install
```

### 2. Levantar la base de datos en Docker:

```bash
pnpm dev:db
```

_(Esto levanta el contenedor de PostgreSQL en segundo plano sin ocupar tu terminal)._

### 3. Generar el cliente de Prisma y sincronizar la base de datos:

```bash
# Genera los tipos de TypeScript de Prisma
pnpm --filter "@<scope>/api" db:generate

# Crea las tablas en PostgreSQL
pnpm --filter "@<scope>/api" db:push
```

### 4. Iniciar ambos entornos en modo desarrollo:

```bash
# Opción A: Levantar Backend y Frontend en paralelo
pnpm dev:local

# Opción B: Levantar en terminales separadas
pnpm dev:api   # En una terminal (Backend en http://localhost:4000)
pnpm dev:web   # En otra terminal (Frontend en http://localhost:3000)
```

---

## Paso 4: Verificación del Backend

1. **Documentación Swagger**: Abrí tu navegador en:
   👉 `http://localhost:4000/api-docs`
   Vas a ver la interfaz interactiva de Swagger con los endpoints de login y registro listos para probar.
2. **Prueba de Endpoint**:
   - Probá registrar un usuario desde Swagger o Postman (`POST /api/auth/register`).
   - Probá iniciar sesión (`POST /api/auth/login`) y verificá que te devuelva el JWT y setee la cookie segura.

---

## Paso 5: Verificación del Frontend e Integración Fullstack

1. **Navegación al Frontend**: Abrí tu navegador en:
   👉 `http://localhost:3000`
2. **Validación de Formularios**:
   - Ingresá un email inválido o dejá la contraseña vacía: verificá que los mensajes de error provengan directamente de los esquemas Zod de `packages/shared`.
3. **Flujo de Autenticación E2E**:
   - Ingresá las credenciales creadas en el Paso 4.
   - Presioná ingresar y verificá en la pestaña *Network* de DevTools:
     - La petición `POST /api/auth/login` responde `200 OK`.
     - Se recibe la cookie de sesión `httpOnly`.
     - Zustand actualiza el estado del usuario autenticado y la aplicación redirige a la vista principal.
