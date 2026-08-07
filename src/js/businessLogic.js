/** CAPA DE LÓGICA: reglas de pedidos, relaciones, inventario y permisos. */
const BusinessRules=(()=>{
 const byId=(entity,id)=>Storage.find(entity,id);
 function can(role,action){return role==="admin"||action==="view"||action==="create"}
 function orderLines(order){return(order.items||[]).map((item)=>{const product=byId("products",item.productId),unitPrice=Number(item.unitPrice??product?.price??0);return{...item,product,unitPrice,subtotal:Number(item.quantity)*unitPrice,supplier:byId("suppliers",item.supplierId||product?.supplierId)}})}
 function orderTotals(order){const lines=orderLines(order);return{lines,itemCount:lines.reduce((n,x)=>n+Number(x.quantity),0),total:lines.reduce((n,x)=>n+x.subtotal,0)}}
 function validateOrder(customerId,items){if(!byId("customers",customerId))return{valid:false,message:"Selecciona un cliente válido."};if(!Array.isArray(items)||!items.length)return{valid:false,message:"Selecciona al menos un producto."};for(const item of items){const product=byId("products",item.productId);if(!product)return{valid:false,message:"Uno de los productos ya no existe."};if(Number(item.quantity)<1||Number(item.quantity)>Number(product.stock))return{valid:false,message:`Cantidad inválida para ${product.name}.`}}return{valid:true}}
 function relatedOrders(entity,id){return Storage.get("orders").filter((order)=>entity==="customers"?String(order.customerId)===String(id):order.items?.some((item)=>String(item.productId)===String(id)))}
 function productsBySupplier(id){return Storage.get("products").filter((product)=>String(product.supplierId)===String(id))}
 function analytics(){const products=Storage.get("products"),suppliers=Storage.get("suppliers"),orders=Storage.get("orders"),counts=products.reduce((map,p)=>{if(p.supplierId)map[p.supplierId]=(map[p.supplierId]||0)+1;return map},{}),topId=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];return{customers:Storage.count("customers"),lowStock:products.filter((p)=>Number(p.stock)<=10).length,pendingOrders:orders.filter((o)=>o.status==="pending").length,topSupplier:suppliers.find((s)=>String(s.id)===String(topId))||null,topSupplierProducts:counts[topId]||0}}
 return{can,orderLines,orderTotals,validateOrder,relatedOrders,productsBySupplier,analytics};
})();
window.BusinessRules=BusinessRules;
