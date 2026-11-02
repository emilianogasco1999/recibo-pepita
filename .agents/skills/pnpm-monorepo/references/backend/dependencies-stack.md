# Stack de Dependencias Esenciales del Backend

Esta referencia técnica documenta el catálogo de dependencias esenciales que componen el backend (`apps/api`), explicando el propósito arquitectónico de cada librería, por qué fue elegida y cómo se utiliza.

---

## 1. Servidor y Capa de Transporte HTTP

### `express` (^5.x)
- **Propósito**: Framework de servidor web y enrutamiento HTTP.
- **Uso en el sistema**: Define la aplicación principal, routers por feature y ciclo de middleware (interceptor de peticiones y respuestas).

### `cors`
- **Propósito**: Gestión de Cross-Origin Resource Sharing.
- **Uso en el sistema**: Permite peticiones seguras exclusivamente desde los orígenes autorizados del frontend (`envs.CORS_ORIGIN`), habilitando `credentials: true` para el intercambio de cookies.

### `cookie-parser`
- **Propósito**: Procesamiento y parseo de encabezados `Cookie`.
- **Uso en el sistema**: Permite al backend leer cookies seguras `httpOnly` (como el `refreshToken`), protegiendo tokens de sesión contra ataques XSS en el navegador.

### `morgan`
- **Propósito**: Logger de peticiones HTTP en consola.
- **Uso en el sistema**: Registra método, ruta, código de estado y tiempo de respuesta de cada petición en tiempo de desarrollo.

---

## 2. Configuración y Validación de Entorno

### `dotenv`
- **Propósito**: Carga de variables de entorno desde archivos `.env`.
- **Uso en el sistema**: Resuelve e inyecta la configuración tanto de la raíz del monorepo (`../../.env`) como del entorno local de la API (`.env`).

### `env-var`
- **Propósito**: Validación estricta y tipado de variables de entorno.
- **Uso en el sistema**: Garantiza que el backend aborte al iniciar si falta una variable obligatoria (`required()`) o si un puerto no es un número válido (`asPortNumber()`, `asIntPositive()`, `asBool()`).

---

## 3. Seguridad y Criptografía

### `bcrypt`
- **Propósito**: Hashing unidireccional y seguro de contraseñas.
- **Uso en el sistema**: 
  - `bcrypt.hash(password, 10)` al crear o actualizar contraseñas de usuarios.
  - `bcrypt.compare(password, hash)` para validar credenciales en el inicio de sesión sin almacenar texto plano.

### `jsonwebtoken`
- **Propósito**: Generación y verificación criptográfica de tokens JWT.
- **Uso en el sistema**:
  - `jwt.sign(payload, secret, options)` para emitir access tokens (vida corta) y refresh tokens.
  - `jwt.verify(token, secret)` para autenticar peticiones en `authMiddleware` y proteger endpoints sensibles.

---

## 4. Validación de Contratos y Esquemas

### `zod`
- **Propósito**: Validación de esquemas y tipado estático en tiempo de ejecución.
- **Uso en el sistema**: Valida el cuerpo (`body`), parámetros de consulta (`query`) y parámetros de ruta (`params`) en el middleware `validateRequest(schema)` antes de llegar a los controladores.

---

## 5. Base de Datos y Persistencia Relacional

### `@prisma/client`, `@prisma/adapter-pg` y `pg`
- **Propósito**: ORM fuertemente tipado y pool de conexiones para PostgreSQL.
- **Uso en el sistema**: 
  - Provee consultas con autocompletado y tipos de TypeScript autogenerados a partir de `schema.prisma`.
  - `@prisma/adapter-pg` optimiza la conexión mediante el driver nativo de PostgreSQL (`pg.Pool`).

---

## 6. Almacenamiento de Objetos Compatible con S3

### `@aws-sdk/client-s3` y `@aws-sdk/s3-request-presigner`
- **Propósito**: Cliente estándar de AWS SDK para interactuar con buckets S3 (MinIO en desarrollo y AWS en producción).
- **Uso en el sistema**:
  - Subida directa (`PutObjectCommand`) de adjuntos, remitos y comprobantes.
  - Eliminación segura de objetos (`DeleteObjectCommand`).
  - Generación de URLs prefirmadas temporales (`getSignedUrl` con `GetObjectCommand`) para acceder a archivos privados sin exponer credenciales.

---

## 7. Documentación Interactiva de API

### `swagger-jsdoc` y `swagger-ui-express`
- **Propósito**: Generación y visualización de la especificación OpenAPI / Swagger.
- **Uso en el sistema**:
  - `swagger-jsdoc`: Escanea comentarios JSDoc `@swagger` en los archivos `presentation/docs/*.docs.ts`.
  - `swagger-ui-express`: Expone la interfaz gráfica interactiva en el endpoint `/api-docs` para pruebas y contratos de integración.

---

## Resumen del Comando de Instalación Esencial

Si se crea un nuevo backend con este estándar, estas son las dependencias base a instalar:

```bash
# Dependencias de producción
pnpm --filter "@<scope>/api" add express cors cookie-parser morgan dotenv env-var bcrypt jsonwebtoken zod @prisma/client @prisma/adapter-pg pg @aws-sdk/client-s3 @aws-sdk/s3-request-presigner swagger-jsdoc swagger-ui-express

# Tipos y herramientas de desarrollo
pnpm --filter "@<scope>/api" add -D @types/express @types/cors @types/cookie-parser @types/morgan @types/bcrypt @types/jsonwebtoken @types/pg @types/swagger-jsdoc @types/swagger-ui-express @types/node prisma tsx typescript
```
