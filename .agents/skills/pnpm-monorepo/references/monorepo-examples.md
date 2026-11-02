# Ejemplos Canónicos del Monorepo Raíz y Paquetes Compartidos

Este archivo provee los ejemplos de código exactos para los archivos de configuración raíz y los paquetes compartidos (`packages/shared` y `packages/config`).

---

## 1. Definición del Workspace (`pnpm-workspace.yaml`)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 2. Orquestador Raíz (`package.json`)

```json
{
  "name": "monorepo-root",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:db": "docker compose -f .docker/dev/docker-compose.dev.yml up -d",
    "dev:api": "pnpm --filter \"@<scope>/api\" dev",
    "dev:web": "pnpm --filter \"@<scope>/web\" dev",
    "dev:local": "pnpm --filter \"./apps/*\" --parallel dev",
    "dev:backup": "docker compose -f .docker/dev/docker-compose.dev.yml run --rm backup",
    "dev:down": "docker compose -f .docker/dev/docker-compose.dev.yml down",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

---

## 3. Docker Compose Raíz (`docker-compose.yml`)

```yaml
# Docker Compose Raíz (utiliza Compose v2 include)
include:
  - path: .docker/dev/docker-compose.dev.yml
```

---

## 4. Contratos Compartidos: Esquemas Zod (`packages/shared/src/schemas/user.schema.ts`)

```typescript
import { z } from 'zod';

export const USER_ROLES = ['ADMINISTRADOR', 'CONTADOR'] as const;
export const userRoleSchema = z.enum(USER_ROLES);

export const createUserSchema = z.object({
  email: z.string({ message: 'El email es requerido' }).email('Formato de email inválido'),
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: userRoleSchema,
  personId: z.string().uuid('ID de persona inválido').optional().nullable(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().extend({
  activo: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

---

## 5. Contratos Compartidos: Constantes (`packages/shared/src/constants/roles.ts`)

```typescript
export const ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  CONTADOR: 'CONTADOR',
} as const;

export type Rol = (typeof ROLES)[keyof typeof ROLES];
```

---

## 6. Exportación de Contratos (`packages/shared/src/index.ts`)

```typescript
export * from './constants/index.js';
export * from './types/index.js';
export * from './schemas/index.js';
```

---

## 7. Configuración Compartida de TypeScript (`packages/config/tsconfig.base.json`)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Herencia en `apps/api/tsconfig.json`:
```json
{
  "extends": "@<scope>/config/tsconfig.node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
```
