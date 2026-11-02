# Orquestación de Scripts y Ciclo de Vida del Workspace

Esta referencia técnica describe cómo orquestar la ejecución, compilación, análisis estático y tareas de base de datos en monorepos gestionados con **pnpm**.

---

## 1. Principio de Ejecución Filtrada y Recursiva

`pnpm` proporciona dos modificadores fundamentales para interactuar con los paquetes del monorepo:

1. **`--filter "<paquete>"`**: Aísla la ejecución a una aplicación o paquete específico sin salir del directorio raíz.
2. **`-r` (`--recursive`)**: Ejecuta un comando en todos los paquetes del workspace que tengan definido ese script en su `package.json`.

---

## 2. Mapa de Scripts Canónicos en la Raíz

El `package.json` raíz actúa como el panel de control operativo:

| Script | Comando Subyacente | Propósito |
| :--- | :--- | :--- |
| `dev:local` | `pnpm --filter "./apps/*" --parallel dev` | Inicia simultáneamente frontend y backend en desarrollo. |
| `dev:api` | `pnpm --filter "@<scope>/api" dev` | Inicia únicamente el servidor backend (`tsx watch`). |
| `dev:web` | `pnpm --filter "@<scope>/web" dev` | Inicia únicamente el servidor Vite del frontend. |
| `dev:db` | `docker compose -f ... up -d` | Levanta PostgreSQL y MinIO sin correr código de apps. |
| `build` | `pnpm -r build` | Compila todo el monorepo en el orden correcto de dependencias. |
| `lint` | `pnpm -r lint` | Chequea tipos en todas las aplicaciones (`tsc --noEmit`). |

---

## 3. Topología de Compilación en Cascada (Build Order)

Cuando se ejecuta `pnpm -r build`:
1. `pnpm` analiza el árbol de dependencias de `package.json`.
2. Primero compila los paquetes base (`packages/shared` y `packages/config`).
3. Una vez listos los artefactos de `packages/`, compila las aplicaciones (`apps/api` y `apps/web`).
4. **Regla de oro**: Las aplicaciones nunca deben compilarse antes de que sus dependencias compartidas locales hayan generado sus tipos/distribución.

---

## 4. Tareas de Base de Datos y Generación de Clientes

En arquitecturas donde el backend utiliza un ORM (como Prisma):
- **Generación de Cliente Tipado**:
  ```bash
  pnpm --filter "@<scope>/api" db:generate
  ```
  Debe ejecutarse tras cualquier cambio en el esquema para que los tipos de TypeScript coincidan con la base de datos.
- **Sincronización con la Base de Datos**:
  ```bash
  pnpm --filter "@<scope>/api" db:push
  ```
  Aplica los cambios directamente a la base de datos de desarrollo.
- **Ejecución de Scripts Administrativos**:
  ```bash
  pnpm --filter "@<scope>/api" exec tsx prisma/<script>.ts
  ```
