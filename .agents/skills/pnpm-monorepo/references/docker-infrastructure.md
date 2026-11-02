# Infraestructura y Contenedores en Monorepo (Docker)

Esta referencia técnica describe los estándares de contenedorización, orquestación y persistencia de servicios para monorepos con soporte Docker.

---

## 1. Filosofía de Desarrollo Híbrido

En desarrollo, el monorepo adopta un modelo **híbrido optimizado para Developer Experience (DX)**:

1. **Servicios de Apoyo en Docker**:
   - Bases de datos relacionales (ej: PostgreSQL).
   - Servidores de almacenamiento de objetos (ej: MinIO / S3 compatible).
   - Herramientas visuales de administración (ej: PgAdmin).
   - Tareas automáticas de respaldo (backup).
2. **Aplicaciones en Host (Node.js local con pnpm)**:
   - Corren directamente en la máquina del desarrollador (`pnpm dev:api`, `pnpm dev:web`).
   - **Ventaja**: Hot Module Replacement (HMR) ultrarrápido, depuración interactiva y sin overhead de virtualización para herramientas de frontend/backend.

---

## 2. Topología Modular de Docker Compose

Para evitar archivos de compose masivos y difíciles de mantener, se utiliza una estructura modular en `.docker/`:

```
<monorepo-root>/
├── docker-compose.yml                # Punto de entrada raíz (utiliza include)
└── .docker/
    ├── dev/
    │   └── docker-compose.dev.yml    # Servicios para entorno de desarrollo local
    ├── prod/
    │   └── docker-compose.prod.yml   # Orquestación de producción (apps + servicios)
    └── backup/
        └── Dockerfile                # Imagen para scripts de respaldo periódico
```

### Inclusión en la Raíz (`docker-compose.yml`):
```yaml
include:
  - path: .docker/dev/docker-compose.dev.yml
```
Permite que comandos simples como `docker compose up -d` desde la raíz utilicen la configuración de desarrollo sin necesidad de flags de ruta extensos.

---

## 3. Persistencia de Datos y Volúmenes Nombrados

Toda base de datos y almacenamiento de archivos debe utilizar **volúmenes nombrados** de Docker para asegurar que los datos sobrevivan a reinicios o reconstrucciones de imágenes:

```yaml
volumes:
  postgres_dev_data:
    driver: local
  minio_dev_data:
    driver: local
```

- **Regla**: Nunca mapear carpetas del código fuente directamente como volumen de base de datos (`./data:/var/lib/postgresql/data`), ya que degrada el rendimiento de disco y puede provocar conflictos de permisos en Windows/Linux.

---

## 4. Redes Internas y Puertos de Servicio

1. **Resolución Interna**: Entre contenedores de Docker (por ejemplo, el script de backup conectándose a PostgreSQL), la comunicación se realiza mediante el nombre del servicio en la red de Docker (`postgres:5432`).
2. **Acceso desde el Host**: Las aplicaciones que corren localmente en la máquina física acceden a los servicios mediante los puertos expuestos (`localhost:5432` para BD, `localhost:9000` para API S3, `localhost:9001` para consola MinIO).

---

## 5. Comandos Estándar de Infraestructura

```bash
# Levantar únicamente los servicios de base de datos y storage en background
pnpm dev:db          # docker compose -f .docker/dev/docker-compose.dev.yml up -d

# Detener los contenedores preservando los datos
pnpm dev:down        # docker compose -f .docker/dev/docker-compose.dev.yml down

# Ejecutar una copia de seguridad bajo demanda
pnpm dev:backup      # docker compose -f .docker/dev/docker-compose.dev.yml run --rm backup

# Ver logs de un servicio específico
docker compose logs -f postgres
```
