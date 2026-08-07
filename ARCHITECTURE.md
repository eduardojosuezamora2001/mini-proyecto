# Arquitectura de AdminPro

## Estructura de LocalStorage

La aplicación administrativa usa una sola llave, `adminpro_db`:

```js
{
  version: 2,
  customers: [],
  products: [],
  suppliers: [],
  orders: [],
  settings: {},
  metadata: { updatedAt: "..." }
}
```

`localStorage.js` migra automáticamente las antiguas llaves `adminpro_customers`, `adminpro_products`, `adminpro_suppliers` y `adminpro_orders`, y luego las elimina.

## Capas

1. **Datos — `localStorage.js`:** lectura, escritura, CRUD, migración, exportación e importación de la base raíz.
2. **Lógica — `businessLogic.js` y `appCore.js`:** cálculos de pedidos, validación de inventario, relaciones, analítica, roles, debounce y paginación.
3. **Interfaz — `customers.js`, `products.js`, `supplierman.js`, `orders.js`, `adminpanel.js`:** renderizado y eventos DOM. Estos archivos consumen las APIs anteriores y no usan `localStorage` directamente.

## Datos de carga

`datasetGenerator.js` genera datos deterministas y relacionados. `dataBootstrap.js` solicita completar el mínimo de 200 registros. El prompt está documentado en `DATASET_PROMPT.md`.

## Respaldo

Configuración permite descargar la estructura completa como JSON y restaurarla. La importación valida que las cuatro colecciones obligatorias sean arreglos antes de reemplazar la base actual.
