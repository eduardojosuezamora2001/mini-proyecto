# Prompt documentado para generar datos de prueba

> Genera un dataset determinista en JavaScript para un sistema administrativo. Debe incluir 80 clientes, 90 productos y 40 proveedores (210 registros combinados). Cada entidad necesita identificadores únicos; cada producto debe tener precio, stock, SKU, categoría y `supplierId` válido. Incluye algunos registros inactivos, productos agotados y productos con inventario bajo. No uses librerías externas y evita datos personales reales.

El resultado está en `src/js/datasetGenerator.js`. Los IDs usan los prefijos `demo-c`, `demo-p` y `demo-s` para evitar colisiones. El generador solo completa el dataset cuando existen menos de 200 registros combinados.
