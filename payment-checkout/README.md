# Payment Checkout

Aplicación full stack para comprar productos, agruparlos en un carrito y procesar un único pago con entrega usando Wompi en ambiente sandbox.

- Repositorio: [github.com/Kellycaro1993/payment-checkout](https://github.com/Kellycaro1993/payment-checkout)
- Deploy: pendiente de publicación. No se detectó una URL de despliegue configurada en el repositorio.
- API para Postman: [colección Postman](postman/Payment-Checkout.postman_collection.json)
- Swagger local: [http://localhost:3000/api](http://localhost:3000/api). Está organizado por `products`, `customers`, `deliveries` y `transactions`.

## Funcionalidades

- Catálogo de productos con control de inventario.
- Carrito con cantidades, eliminación de productos y subtotal.
- Un checkout para todos los productos del carrito.
- Registro de cliente y dirección de entrega.
- Tokenización y procesamiento de pago con Wompi.
- Resultado de transacción aprobada o rechazada.
- Descuento de inventario únicamente cuando el pago es aprobado.

## Tecnologías

- Frontend: React, TypeScript, Vite, Redux Toolkit y Jest.
- Backend: NestJS, Prisma, PostgreSQL y Jest.
- Pagos: Wompi Sandbox.

## Arquitectura

```text
frontend/                         React + Vite
├── src/pages/ProductPage         Catálogo, carrito y orquestación del checkout
├── src/components                ProductCard y modales de pago/resultado
└── src/features                  Estado Redux y servicios HTTP

backend/                          NestJS + Prisma
├── src/modules/products          Consulta de productos
├── src/modules/customers         Creación de clientes
├── src/modules/deliveries        Registro de entregas
├── src/modules/transactions      Cálculo y creación de pagos
├── src/infrastructure            Integración con Wompi
└── prisma                        Esquema, migraciones y base PostgreSQL
```

El frontend solicita el token de tarjeta y los tokens de aceptación a Wompi. El backend valida los datos, calcula el total, crea la transacción y actualiza el inventario solo si Wompi la aprueba.

## Modelo de datos

```text
Customer 1 ─── N Delivery
Customer 1 ─── N Transaction
Delivery 1 ─── 1 Transaction
TransactionStatus 1 ─── N Transaction
Transaction 1 ─── N TransactionItem N ─── 1 Product
```

| Entidad | Campos principales | Descripción |
| --- | --- | --- |
| `Product` | `name`, `description`, `price`, `stock` | Producto disponible en el catálogo. |
| `Customer` | `name`, `email`, `phone` | Comprador; el correo es único. |
| `Delivery` | `address`, `city`, `customerId` | Dirección de envío asociada al cliente. |
| `Transaction` | `productAmount`, `baseFee`, `deliveryFee`, `totalAmount`, `statusId`, `paymentId` | Pago único de todo el carrito. |
| `TransactionItem` | `transactionId`, `productId`, `quantity`, `unitPrice` | Artículo y cantidad incluidos en una transacción. |
| `TransactionStatus` | `name` | Estado devuelto por el proceso de pago. |

## Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL 18, local o administrado.

## Configuración

### Backend

Desde la carpeta `backend`, instala dependencias y prepara Prisma:

```bash
npm install
npm exec prisma generate
npm exec prisma migrate deploy
```

Crea `backend/.env` con tus propias credenciales:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/payment_checkout?schema=public"
WOMPI_API_URL="https://api-sandbox.co.uat.wompi.dev/v1"
WOMPI_PUBLIC_KEY="pub_test_..."
WOMPI_PRIVATE_KEY="prv_test_..."
WOMPI_EVENTS_SECRET="..."
WOMPI_INTEGRITY_SECRET="..."
PORT=3000
```

Reemplaza `USUARIO`, `CONTRASENA`, host, puerto y nombre de base de datos por los datos de tu instancia de PostgreSQL. No uses credenciales reales en el README ni las subas al repositorio.

Inicia el servidor:

```bash
npm run start:dev
```

El backend queda disponible normalmente en `http://localhost:3000`. La documentación interactiva de Swagger está en `http://localhost:3000/api`.

### Frontend

Desde la carpeta `frontend`, instala dependencias:

```bash
npm install
```

Crea `frontend/.env`:

```env
VITE_API_URL="http://localhost:3000"
VITE_WOMPI_API_URL="https://api-sandbox.co.uat.wompi.dev/v1"
VITE_WOMPI_PUBLIC_KEY="pub_test_..."
```

Inicia la aplicación:

```bash
npm run dev
```

Vite mostrará la URL local, habitualmente `http://localhost:5173`.

## API principal

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/` | Verifica que la API esté en ejecución. |
| `GET` | `/products` | Consulta el catálogo. |
| `GET` | `/products/:id` | Consulta un producto. |
| `POST` | `/customers` | Crea el cliente del checkout. |
| `POST` | `/deliveries` | Registra la dirección de entrega. |
| `GET` | `/transactions` | Lista las transacciones. |
| `GET` | `/transactions/:id` | Consulta una transacción. |
| `POST` | `/transactions` | Crea una transacción para todos los artículos del carrito. |

La transacción recibe una lista de productos y cantidades, por ejemplo:

```json
{
  "items": [
    { "productId": 1, "quantity": 1 },
    { "productId": 2, "quantity": 2 }
  ],
  "customerId": 1,
  "deliveryId": 1,
  "customerEmail": "cliente@ejemplo.com",
  "cardToken": "tok_test_...",
  "installments": 1,
  "reference": "checkout-001",
  "acceptanceToken": "...",
  "acceptPersonalAuth": "..."
}
```

### Usar la colección Postman

1. Importa [Payment-Checkout.postman_collection.json](postman/Payment-Checkout.postman_collection.json) en Postman.
2. Define la variable de colección `baseUrl` como `http://localhost:3000`.
3. Inicia el backend y ejecuta las solicitudes en este orden: productos, cliente, entrega y transacción.

### Usar Swagger

1. Inicia el backend con `npm run start:dev`.
2. Abre [http://localhost:3000/api](http://localhost:3000/api).
3. Selecciona la etiqueta del recurso que quieres consultar: `products`, `customers`, `deliveries` o `transactions`.

## Wompi Sandbox

1. Crea o utiliza credenciales de prueba en Wompi Sandbox.
2. Configura las claves públicas y privadas en los archivos `.env` correspondientes.
3. Usa el flujo del frontend para tokenizar la tarjeta: nunca envíes el número o CVV sin tokenizar al backend.
4. Obtén y envía los tokens de aceptación requeridos por Wompi junto con la referencia de pago.
5. Realiza las pruebas solo contra `https://api-sandbox.co.uat.wompi.dev/v1`; no reutilices credenciales de producción.

## Pruebas y cobertura

Frontend:

```bash
cd frontend
npm test
npm run test:coverage
```

Backend:

```bash
cd backend
npm test
npm run test:cov
```

Resultados actuales de cobertura:

| Proyecto | Statements | Lines |
| --- | ---: | ---: |
| Frontend | 91.82% | 92.74% |
| Backend | 90.35% | 88.46% |

## Compilación para producción

```bash
cd frontend
npm run build

cd ../backend
npm run start:prod
```

`start:prod` ejecuta la compilación del backend antes de iniciar la aplicación, evitando usar archivos desactualizados de `dist`.

## Seguridad

No subas archivos `.env` ni claves de Wompi al repositorio. El frontend solo debe usar la clave pública; las claves privadas, secretos de eventos e integridad pertenecen exclusivamente al backend.
